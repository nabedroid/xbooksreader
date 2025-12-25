/**
 * ファイルスキャナーサービス
 * フォルダを再帰的にスキャンして本（画像を含むフォルダまたはZIPファイル）を検出
 */
import fs from 'fs';
import path from 'path';
import { BrowserWindow } from 'electron';
import yauzl from 'yauzl';
import { createBook, getBookByPath, getAllBooks, deleteBook, updateBook } from '../database/models/Book';
import { generateThumbnail } from './thumbnailGenerator';
import { extractMetadataFromPath } from './metadataExtractor';
import type { MetadataExtractionOptions, ScanProgress } from '@/types';

// サポートする画像拡張子
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];

// スキャン状態
let isScanning = false;
let shouldCancel = false;

/**
 * 複数のディレクトリをスキャン
 */
export async function scanDirectories(
  dirPaths: string[],
  mode: 'add' | 'sync',
  options: MetadataExtractionOptions,
  window: BrowserWindow | null
): Promise<number> {
  if (isScanning) {
    throw new Error('スキャンは既に実行中です');
  }

  isScanning = true;
  shouldCancel = false;
  let totalBooksFound = 0;

  try {
    console.log(`スキャン開始: ${dirPaths.length}件のパス, モード: ${mode}`);

    // パスごとにスキャン
    for (let i = 0; i < dirPaths.length; i++) {
      if (shouldCancel) break;
      const dirPath = dirPaths[i];

      // 進捗：メインフェーズ開始
      sendProgress(window, {
        current: i,
        total: dirPaths.length,
        currentPath: dirPath,
        status: 'scanning',
      });

      totalBooksFound += await scanDirectoryInternal(dirPath, mode, options, window);
    }

    // Syncモード時のクリーンアップ
    if (mode === 'sync' && !shouldCancel) {
      sendProgress(window, {
        current: 0,
        total: 100,
        currentPath: 'データベースのクリーンアップ中',
        status: 'processing', // クライアント側の型定義に processing が必要
      });
      await cleanupDatabase(dirPaths);
    }

    sendProgress(window, {
      current: totalBooksFound,
      total: totalBooksFound,
      currentPath: '',
      status: 'completed',
    });

    console.log(`全スキャン完了: ${totalBooksFound}冊の本を検出`);
    return totalBooksFound;
  } finally {
    isScanning = false;
    shouldCancel = false;
  }
}

/**
 * 単一ディレクトリのスキャン（内部用）
 */
async function scanDirectoryInternal(
  dirPath: string,
  mode: 'add' | 'sync',
  options: MetadataExtractionOptions,
  window: BrowserWindow | null
): Promise<number> {
  let booksFound = 0;

  try {
    // 全てのファイルとディレクトリを再帰的に取得
    const items = await getAllItems(dirPath);
    const total = items.length;

    for (let i = 0; i < items.length; i++) {
      if (shouldCancel) break;

      const item = items[i];

      // 間引いて進捗を送信（頻繁すぎるとUIが固まるため）
      if (i % 10 === 0) {
        sendProgress(window, {
          current: i + 1,
          total,
          currentPath: item,
          status: 'scanning',
        });
      }

      try {
        // ファイルの存在確認 (getAllItemsから時間が経っている可能性があるため)
        if (!fs.existsSync(item)) continue;

        const stats = fs.statSync(item);

        if (stats.isDirectory()) {
          // ディレクトリ内に画像があるかチェック
          if (await hasImages(item)) {
            await processBook(item, 'folder', mode, options);
            booksFound++;
          }
        } else if (item.toLowerCase().endsWith('.zip')) {
          // ZIPファイル
          await processBook(item, 'zip', mode, options);
          booksFound++;
        }
      } catch (error) {
        console.error(`エラー: ${item}`, error);
      }
    }
    return booksFound;
  } catch (error) {
    console.error(`ディレクトリ読み込みエラー: ${dirPath}`, error);
    return 0;
  }
}

/**
 * データベースのクリーンアップ（Syncモード用）
 * 指定されたルートパスの配下にあるが、実体が存在しない本を削除
 */
async function cleanupDatabase(rootPaths: string[]) {
  console.log('データベースのクリーンアップを開始...');
  const allBooks = await getAllBooks();

  for (const book of allBooks) {
    if (shouldCancel) break;

    // この本がスキャン対象パスのいずれかの配下にあるか確認
    const isTarget = rootPaths.some(root => book.path.startsWith(root));
    if (!isTarget) continue;

    // 実体が存在するか確認
    if (!fs.existsSync(book.path)) {
      console.log(`削除（ファイル消失）: ${book.path}`);
      await deleteBook(book.id);
    }
  }
  console.log('クリーンアップ完了');
}


/**
 * スキャンをキャンセル
 */
export function cancelScan() {
  shouldCancel = true;
}

/**
 * 本を処理してデータベースに追加・更新
 */
async function processBook(
  bookPath: string,
  type: 'folder' | 'zip',
  mode: 'add' | 'sync',
  options: MetadataExtractionOptions
) {
  // 既に存在するかチェック
  const existing = await getBookByPath(bookPath);

  if (existing) {
    // Syncモードで、タイプが変更されている場合は更新
    if (mode === 'sync' && existing.type !== type) {
      console.log(`タイプ更新: ${bookPath} (${existing.type} -> ${type})`);

      const pageCount = await getPageCount(bookPath, type);

      // サムネイル再生成
      let thumbnail = existing.thumbnail; // 文字列ならBufferに戻す等の処理が必要だが、モデル上はBuffer|null
      try {
        // nullでなければBufferとして扱う（モデル定義依存）
        // ここでは単純に再生成を試みる
        const newThumb = await generateThumbnail(bookPath, type, 0);
        if (newThumb) thumbnail = newThumb; // バッファ
      } catch (e) { }

      await updateBook(existing.id, {
        type,
        page_count: pageCount,
        thumbnail: thumbnail as any,
      });
    }
    return;
  }

  // 新規追加
  const metadata = options.enabled
    ? extractMetadataFromPath(bookPath)
    : {};

  const pageCount = await getPageCount(bookPath, type);

  let thumbnail: Buffer | undefined;
  try {
    thumbnail = await generateThumbnail(bookPath, type, 0);
  } catch (error) {
    console.error('サムネイル生成エラー:', error);
  }

  await createBook({
    path: bookPath,
    type,
    title: metadata.title || path.basename(bookPath, path.extname(bookPath)),
    series: metadata.series,
    author: metadata.author,
    circle: metadata.circle,
    page_count: pageCount,
    thumbnail,
  });

  console.log(`追加: ${bookPath}`);
}

/**
 * ディレクトリ内の全てのアイテムを再帰的に取得
 */
async function getAllItems(dirPath: string): Promise<string[]> {
  const items: string[] = [];
  // 再帰制限やパフォーマンス考慮をしていない簡易実装のため注意
  async function traverse(currentPath: string) {
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          items.push(fullPath);
          await traverse(fullPath);
        } else if (entry.isFile()) {
          items.push(fullPath);
        }
      }
    } catch (error) {
      // アクセス権エラーなどは無視
    }
  }

  await traverse(dirPath);
  return items;
}

/**
 * ディレクトリに画像が含まれているかチェック
 */
async function hasImages(dirPath: string): Promise<boolean> {
  try {
    const entries = fs.readdirSync(dirPath);
    return entries.some(entry => {
      const ext = path.extname(entry).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    });
  } catch (error) {
    return false;
  }
}

/**
 * ページ数を取得
 */
async function getPageCount(bookPath: string, type: 'folder' | 'zip'): Promise<number> {
  if (type === 'folder') {
    const entries = fs.readdirSync(bookPath);
    return entries.filter(entry => {
      const ext = path.extname(entry).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    }).length;
  } else {
    // ZIP内の画像数をカウント
    return new Promise((resolve) => {
      yauzl.open(bookPath, { lazyEntries: true }, (err: any, zipfile: any) => {
        if (err) {
          resolve(0); // エラーなら0ページとする
          return;
        }

        let count = 0;
        zipfile.readEntry();
        zipfile.on('entry', (entry: any) => {
          const ext = path.extname(entry.fileName).toLowerCase();
          if (IMAGE_EXTENSIONS.includes(ext)) {
            count++;
          }
          zipfile.readEntry();
        });

        zipfile.on('end', () => {
          resolve(count);
        });

        zipfile.on('error', () => resolve(0));
      });
    });
  }
}

/**
 * 進捗を送信
 */
function sendProgress(window: BrowserWindow | null, progress: ScanProgress) {
  if (window && !window.isDestroyed()) {
    window.webContents.send('scanner:progress', progress);
  }
}
