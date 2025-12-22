/**
 * ファイルスキャナーサービス
 * フォルダを再帰的にスキャンして本（画像を含むフォルダまたはZIPファイル）を検出
 */
import fs from 'fs';
import path from 'path';
import { BrowserWindow } from 'electron';
import yauzl from 'yauzl';
import { createBook, getBookByPath } from '../database/models/Book';
import { generateThumbnail } from './thumbnailGenerator';
import { extractMetadataFromPath } from './metadataExtractor';
import type { MetadataExtractionOptions, ScanProgress } from '@/types';

// サポートする画像拡張子
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];

// スキャン状態
let isScanning = false;
let shouldCancel = false;

/**
 * ディレクトリをスキャンして本を検出
 */
export async function scanDirectory(
  dirPath: string,
  options: MetadataExtractionOptions,
  window: BrowserWindow | null
): Promise<number> {
  if (isScanning) {
    throw new Error('スキャンは既に実行中です');
  }

  isScanning = true;
  shouldCancel = false;
  let booksFound = 0;

  try {
    console.log(`スキャン開始: ${dirPath}`);

    // 全てのファイルとディレクトリを再帰的に取得
    const items = await getAllItems(dirPath);
    const total = items.length;

    for (let i = 0; i < items.length; i++) {
      if (shouldCancel) {
        console.log('スキャンがキャンセルされました');
        break;
      }

      const item = items[i];

      // 進捗を送信
      sendProgress(window, {
        current: i + 1,
        total,
        currentPath: item,
        status: 'scanning',
      });

      try {
        const stats = fs.statSync(item);

        if (stats.isDirectory()) {
          // ディレクトリ内に画像があるかチェック
          if (await hasImages(item)) {
            await processBook(item, 'folder', options);
            booksFound++;
          }
        } else if (item.toLowerCase().endsWith('.zip')) {
          // ZIPファイル
          await processBook(item, 'zip', options);
          booksFound++;
        }
      } catch (error) {
        console.error(`エラー: ${item}`, error);
      }
    }

    // 完了を送信
    sendProgress(window, {
      current: total,
      total,
      currentPath: '',
      status: 'completed',
    });

    console.log(`スキャン完了: ${booksFound}冊の本を検出`);
    return booksFound;
  } finally {
    isScanning = false;
    shouldCancel = false;
  }
}

/**
 * スキャンをキャンセル
 */
export function cancelScan() {
  shouldCancel = true;
}

/**
 * 本を処理してデータベースに追加
 */
async function processBook(
  bookPath: string,
  type: 'folder' | 'zip',
  options: MetadataExtractionOptions
) {
  // 既に存在するかチェック
  const existing = await getBookByPath(bookPath);
  if (existing) {
    console.log(`既に存在: ${bookPath}`);
    return;
  }

  // メタデータを抽出
  const metadata = options.enabled
    ? extractMetadataFromPath(bookPath)
    : {};

  // ページ数を取得
  const pageCount = await getPageCount(bookPath, type);

  // サムネイルを生成（最初の画像から）
  let thumbnail: Buffer | undefined;
  try {
    thumbnail = await generateThumbnail(bookPath, type, 0);
  } catch (error) {
    console.error('サムネイル生成エラー:', error);
  }

  // データベースに追加
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

  console.log(`追加: ${bookPath} (${pageCount}ページ)`);
}

/**
 * ディレクトリ内の全てのアイテムを再帰的に取得
 */
async function getAllItems(dirPath: string): Promise<string[]> {
  const items: string[] = [];

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
      console.error(`ディレクトリ読み込みエラー: ${currentPath}`, error);
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
    // ZIP内の画像数をカウント（yauzlを使用）
    return new Promise((resolve, reject) => {
      yauzl.open(bookPath, { lazyEntries: true }, (err: any, zipfile: any) => {
        if (err) {
          reject(err);
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

        zipfile.on('error', reject);
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
