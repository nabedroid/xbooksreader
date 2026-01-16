import fs from 'fs';
import path from 'path';
import { dbQuery } from '../database/db';
import { getVolumeId } from './volumeManager';

/**
 * 整理計画の1件
 */
export interface ReorganizeItem {
  bookId: number;
  title: string;
  basePath: string; // 基準ディレクトリ
  originalPath: string;
  newPath: string;
  status: 'pending' | 'success' | 'error' | 'skipped';
  message?: string;
}

/**
 * 整理計画のサマリー
 */
export interface ReorganizePlan {
  items: ReorganizeItem[];
  total: number;
  conflicts: number;
  errors: number;
  notConnectedPorts: string[]; // 接続されていない基準ディレクトリ
}

/**
 * ファイル名として使えない文字を全角に置換
 */
export function sanitizePathSegment(segment: string): string {
  if (!segment) return '不明';
  return segment
    .replace(/[\\/:*?"<>|]/g, (match) => {
      const map: Record<string, string> = {
        '\\': '＼',
        '/': '／',
        ':': '：',
        '*': '＊',
        '?': '？',
        '"': '＂',
        '<': '＜',
        '>': '＞',
        '|': '｜',
      };
      return map[match] || match;
    })
    .trim() || '不明';
}

/**
 * 整理計画（プレビュー）を作成
 */
export async function previewReorganize(template: string): Promise<ReorganizePlan> {
  const books = await dbQuery.all<any>(`
    SELECT 
      b.*, 
      bl.base_path, 
      bl.relative_path, 
      bl.volume_id,
      (SELECT m.name FROM metadata m JOIN book_metadata bm ON m.id = bm.metadata_id WHERE bm.book_id = b.id AND m.type = 'original_work' LIMIT 1) as meta_original_work,
      (SELECT m.name FROM metadata m JOIN book_metadata bm ON m.id = bm.metadata_id WHERE bm.book_id = b.id AND m.type = 'series' LIMIT 1) as meta_series,
      (SELECT m.name FROM metadata m JOIN book_metadata bm ON m.id = bm.metadata_id WHERE bm.book_id = b.id AND m.type = 'author' LIMIT 1) as meta_author,
      (SELECT m.name FROM metadata m JOIN book_metadata bm ON m.id = bm.metadata_id WHERE bm.book_id = b.id AND m.type = 'circle' LIMIT 1) as meta_circle
    FROM books b
    JOIN book_locations bl ON b.id = bl.book_id
    WHERE bl.status = 'active'
  `);

  const plan: ReorganizePlan = {
    items: [],
    total: books.length,
    conflicts: 0,
    errors: 0,
    notConnectedPorts: [],
  };

  const newPathsSet = new Set<string>();
  const basePaths = Array.from(new Set(books.map((b: any) => b.base_path))) as string[];

  // 基準ディレクトリごとのボリューム接続確認
  const connectedBasePaths = new Set<string>();
  for (const bp of basePaths) {
    const currentVolume = await getVolumeId(bp);
    // その基準ディレクトリに紐づく全てのロケーションのvolume_idを確認し、
    // 現在のボリュームIDと一致するかチェックする（本来はロケーションごとに見るべき）
    // ここでは簡易的に「そのドライブが生きているか」で判定
    if (currentVolume) {
      connectedBasePaths.add(bp);
    } else {
      plan.notConnectedPorts.push(bp);
    }
  }

  for (const book of books) {
    if (!connectedBasePaths.has(book.base_path)) {
      continue; // 接続されていない場合はスキップ
    }

    const originalPath = path.join(book.base_path, book.relative_path);
    const ext = path.extname(book.relative_path);

    // テンプレート置換
    let relDirPath = template
      .replace(/\{タイトル\}/g, sanitizePathSegment(book.title))
      .replace(/\{原作\}/g, sanitizePathSegment(book.meta_original_work))
      .replace(/\{シリーズ\}/g, sanitizePathSegment(book.meta_series))
      .replace(/\{サークル\}/g, sanitizePathSegment(book.meta_circle));

    // 各セグメントをサニタイズ（念のため全体置換後もパス要素ごとにサニタイズ）
    const pathParts = relDirPath.split(/[\\/]/).filter(p => p).map(p => sanitizePathSegment(p));
    relDirPath = path.join(...pathParts);

    const newRelativePath = ext ? relDirPath + ext : relDirPath;
    const newFullPath = path.join(book.base_path, newRelativePath);

    const item: ReorganizeItem = {
      bookId: book.id,
      title: book.title,
      basePath: book.base_path,
      originalPath,
      newPath: newFullPath,
      status: 'pending',
    };

    // 衝突チェック
    if (newPathsSet.has(newFullPath.toLowerCase())) {
      item.status = 'error';
      item.message = '移動先パスが他の本と衝突しています';
      plan.conflicts++;
    } else if (originalPath.toLowerCase() === newFullPath.toLowerCase()) {
      item.status = 'skipped';
      item.message = '現在のパスと同じです';
    } else if (newFullPath.length > 255) {
      item.status = 'error';
      item.message = 'パスが長すぎます（Windows制限）';
      plan.errors++;
    }

    newPathsSet.add(newFullPath.toLowerCase());
    plan.items.push(item);
  }

  return plan;
}

/**
 * 整理を実行
 */
export async function executeReorganize(items: ReorganizeItem[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const item of items) {
    if (item.status !== 'pending') continue;

    try {
      const newDir = path.dirname(item.newPath);
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }

      // ファイルの移動
      fs.renameSync(item.originalPath, item.newPath);

      // DBの更新 (book_locations)
      const newRelativePath = path.relative(item.basePath, item.newPath);
      await dbQuery.run(`
          UPDATE book_locations 
          SET relative_path = ?, updated_at = CURRENT_TIMESTAMP
          WHERE book_id = ? AND base_path = ? AND status = 'active'
      `, [newRelativePath, item.bookId, item.basePath]);

      success++;
      item.status = 'success';

      // 空になった旧フォルダを（可能なら）削除
      cleanupEmptyDirs(path.dirname(item.originalPath));

    } catch (e: any) {
      console.error(`Failed to move ${item.originalPath}:`, e);
      item.status = 'error';
      item.message = e.message;
      failed++;
    }
  }

  return { success, failed };
}

/**
 * 空のディレクトリを再帰的に削除
 */
function cleanupEmptyDirs(dir: string) {
  try {
    let current = dir;
    while (true) {
      if (!fs.existsSync(current)) break;
      const files = fs.readdirSync(current);
      if (files.length === 0) {
        fs.rmdirSync(current);
        current = path.dirname(current);
      } else {
        break;
      }
    }
  } catch (e) {
    // 削除に失敗しても致命的ではないので無視
  }
}
