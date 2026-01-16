import fs from 'fs';
import path from 'path';
import { getVolumeId } from './volumeManager';
import { calculateContentIdentity } from './contentHasher';
import { dbQuery } from '../database/db';
import { Book } from '../../types';
import { BrowserWindow } from 'electron';

/**
 * スマートスキャンを実行
 * 指定されたディレクトリをスキャンし、DBと同期する
 */
export async function smartScan(
  targetDirs: string[],
  window?: BrowserWindow
): Promise<{ added: number; updated: number; removed: number }> {
  const stats = { added: 0, updated: 0, removed: 0 };
  let totalFiles = 0;

  // 1. ファイル列挙 (再帰的)
  // まず全対象ファイルをリストアップ
  const allFilePaths: string[] = [];

  const updateProgress = (current: number, message: string) => {
    if (window) {
      window.webContents.send('scanner:progress', {
        total: totalFiles,
        current,
        message
      });
    }
  };

  updateProgress(0, 'ファイル一覧を取得中...');

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = await getAllFiles(dir);
    allFilePaths.push(...files);
  }

  totalFiles = allFilePaths.length;
  updateProgress(0, `${totalFiles} 件のファイルを検出`);

  // 2. VolumeIDごとに処理
  // ファイルパスからVolumeIDを取得し、処理グループを分けるのが理想だが、
  // ここではシンプルに1ファイルずつ処理する
  // (パフォーマンス最適化は後回し)

  let processed = 0;

  for (const filePath of allFilePaths) {
    processed++;
    updateProgress(processed, `確認中: ${path.basename(filePath)}`);

    try {
      // パス情報の解析
      const volumeId = await getVolumeId(filePath);
      if (!volumeId) {
        console.error(`VolumeID取得失敗: ${filePath}`);
        continue;
      }

      // ベースパスと相対パスの分離（簡易実装）
      // targetDirsのどれに該当するか探す
      const baseDir = targetDirs.find(d => filePath.startsWith(d));
      if (!baseDir) continue; // ありえないはず

      const relativePath = path.relative(baseDir, filePath);

      // 2.3 DB検索: book_locations にこの VolumeID + Path があるか？
      const existingLoc = await dbQuery.get<any>(`
                SELECT * FROM book_locations 
                WHERE volume_id = ? AND base_path = ? AND relative_path = ?
            `, [volumeId, baseDir, relativePath]);

      if (existingLoc) {
        // 既に登録済み -> 存在確認OK
        if (existingLoc.status !== 'active') {
          await dbQuery.run(`UPDATE book_locations SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [existingLoc.id]);
        }
        continue;
      }

      // 2.4 未登録ファイル -> コンテンツ照合 (Heavy)
      updateProgress(processed, `解析中(Heavy): ${path.basename(filePath)}`);
      const identity = await calculateContentIdentity(filePath);

      // booksテーブル検索 (pHashとページ数で)
      let existingBook = await dbQuery.get<Book>(`
                SELECT * FROM books 
                WHERE phash = ? AND page_count = ?
            `, [identity.phash, identity.pageCount]);

      // レガシー対応: pHashで見つからない場合、タイトルとページ数が一致し、かつphashがNULLのものを探す
      if (!existingBook) {
        const title = path.basename(filePath, path.extname(filePath));
        existingBook = await dbQuery.get<Book>(`
              SELECT * FROM books 
              WHERE title = ? AND page_count = ? AND phash IS NULL
          `, [title, identity.pageCount]);

        if (existingBook) {
          // 見つかったらpHashとサムネイルを更新（マイグレーション）
          await dbQuery.run(
            `UPDATE books SET phash = ?, thumbnail = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [identity.phash, identity.thumbnail, existingBook.id]
          );
          console.log(`Legacy book migrated with thumbnail: ${title}`);
        }
      }

      if (existingBook) {
        // 移動検出: 同じボリューム内にこの本の別のロケーションがあるか？
        const locOnSameVolume = await dbQuery.get<any>(`
            SELECT * FROM book_locations 
            WHERE book_id = ? AND volume_id = ?
        `, [existingBook.id, volumeId]);

        if (locOnSameVolume) {
          // パスが変わっているなら更新（移動とみなす）
          await dbQuery.run(`
                UPDATE book_locations 
                SET base_path = ?, relative_path = ?, status = 'active', updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [baseDir, relativePath, locOnSameVolume.id]);
          stats.updated++;
          console.log(`Move detected and location updated: ${existingBook.title}`);
        } else {
          // 新しいボリュームなど -> ロケーション追加
          await dbQuery.run(`
                INSERT INTO book_locations (book_id, volume_id, base_path, relative_path, status)
                VALUES (?, ?, ?, ?, 'active')
            `, [existingBook.id, volumeId, baseDir, relativePath]);
          stats.updated++;
          console.log(`New location added to existing book: ${existingBook.title}`);
        }
      } else {
        // 完全新規 -> Book作成 + Location作成
        const title = path.basename(filePath, path.extname(filePath));
        const result = await dbQuery.run(`
            INSERT INTO books (title, phash, page_count, thumbnail, created_at, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, [title, identity.phash, identity.pageCount, identity.thumbnail]);

        const newBookId = result.lastID;

        await dbQuery.run(`
            INSERT INTO book_locations (book_id, volume_id, base_path, relative_path, status)
            VALUES (?, ?, ?, ?, 'active')
        `, [newBookId, volumeId, baseDir, relativePath]);
        stats.added++;
        console.log(`New book added: ${title}`);
      }

    } catch (e) {
      console.error(`Error processing ${filePath}:`, e);
    }
  }

  // 3. 削除検出 (Cleanup)
  updateProgress(totalFiles, '削除されたファイルを検索中...');

  // 今回スキャンしたVolumeIDごとに、
  // "status='active'" なのに "実ファイルが存在しない" ロケーションを探して削除orMissing化する
  // 今回は簡易的に、targetDir以下のロケーションを全チェックする戦略

  // TODO: cleanup logic implementation
  // 時間がかかるので、今回のスコープでは「追加・更新」メインとし、削除は別途「クリーンアップ」機能で行うのが安全かも？
  // しかし要望は「sync時に削除」なので少しやる。

  // 簡易実装: targetDirs に含まれる locations を取得し、fs.existsSync
  // (より厳密には VolumeID で絞るべきだが)
  for (const dir of targetDirs) {
    // base_path が dir と一致するもの
    const locations = await dbQuery.all<any>(`SELECT * FROM book_locations WHERE base_path = ?`, [dir]);

    for (const loc of locations) {
      const fullPath = path.join(loc.base_path, loc.relative_path);
      if (!fs.existsSync(fullPath)) {
        // ファイルがない
        await dbQuery.run(`DELETE FROM book_locations WHERE id = ?`, [loc.id]);
        stats.removed++;
        console.log(`Location removed: ${fullPath}`);

        // Bookが孤児になったら？ -> ユーザーが手動削除、または自動削除オプション
        // 今回はLocationのみ削除（仕様通り）
      }
    }
  }

  return stats;
}

/**
 * 再帰的にファイルを列挙
 * (ZIPまたは画像を含むフォルダ)
 */
async function getAllFiles(dirPath: string): Promise<string[]> {
  const results: string[] = [];

  // フォルダ自体が画像を含むかチェック
  if (await hasImages(dirPath)) {
    results.push(dirPath);
    // このフォルダ自体が本なら、サブフォルダの探索は行わない（二重検出防止）
    return results;
  }

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const subs = await getAllFiles(fullPath);
        results.push(...subs);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.zip')) {
        results.push(fullPath);
      }
    }
  } catch (e) {
    // アクセス権限等で読めない場合
  }
  return results;
}

/**
 * 画像ファイルが含まれているかチェック
 */
async function hasImages(dirPath: string): Promise<boolean> {
  try {
    const entries = fs.readdirSync(dirPath);
    return entries.some(f => ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase()));
  } catch {
    return false;
  }
}
