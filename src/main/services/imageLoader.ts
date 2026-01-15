/**
 * 画像ローダーサービス
 * フォルダまたはZIPから画像を読み込む
 */
import fs from 'fs';
import path from 'path';
import yauzl from 'yauzl';
import { getBookById } from '../database/models/Book';

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];

// メモリキャッシュ（最大100MB）
const imageCache = new Map<string, Buffer>();
const MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
let currentCacheSize = 0;

/**
 * 画像を読み込む
 */
export async function loadImage(bookId: number, pageNumber: number): Promise<Buffer> {
  const book = await getBookById(bookId);
  if (!book) {
    throw new Error('本が見つかりません');
  }

  const cacheKey = `${bookId}:${pageNumber}`;

  // キャッシュをチェック
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  // 画像を読み込む
  const buffer = book.type === 'folder'
    ? await loadImageFromFolder(book.path, pageNumber)
    : await loadImageFromZip(book.path, pageNumber);

  // キャッシュに追加
  addToCache(cacheKey, buffer);

  return buffer;
}

/**
 * 本のページリストを取得
 */
export async function getBookPages(bookId: number): Promise<string[]> {
  const book = await getBookById(bookId);
  if (!book) {
    throw new Error('本が見つかりません');
  }

  return getPageListFromPath(book.path, book.type as 'folder' | 'zip');
}

/**
 * パスから画像を読み込む（DB未登録用）
 */
export async function loadImageFromPath(fsPath: string, type: 'folder' | 'zip', pageNumber: number): Promise<Buffer> {
  return type === 'folder'
    ? await loadImageFromFolder(fsPath, pageNumber)
    : await loadImageFromZip(fsPath, pageNumber);
}

/**
 * パスからページリストを取得（DB未登録用）
 */
export async function getPageListFromPath(fsPath: string, type: 'folder' | 'zip'): Promise<string[]> {
  return type === 'folder'
    ? getPageListFromFolder(fsPath)
    : getPageListFromZip(fsPath);
}

/**
 * フォルダから画像を読み込む
 */
async function loadImageFromFolder(folderPath: string, pageNumber: number): Promise<Buffer> {
  const files = getPageListFromFolder(folderPath);

  if (pageNumber < 0 || pageNumber >= files.length) {
    throw new Error('ページ番号が範囲外です');
  }

  const filePath = path.join(folderPath, files[pageNumber]);
  return fs.readFileSync(filePath);
}

/**
 * フォルダからページリストを取得
 */
function getPageListFromFolder(folderPath: string): string[] {
  return fs.readdirSync(folderPath)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    })
    .sort();
}

/**
 * ZIPから画像を読み込む
 */
async function loadImageFromZip(zipPath: string, pageNumber: number): Promise<Buffer> {

  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err: any, zipfile: any) => {
      if (err) {
        reject(err);
        return;
      }

      const imageEntries: any[] = [];

      zipfile.readEntry();
      zipfile.on('entry', (entry: any) => {
        const ext = path.extname(entry.fileName).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
          imageEntries.push(entry);
        }
        zipfile.readEntry();
      });

      zipfile.on('end', () => {
        if (imageEntries.length === 0) {
          reject(new Error('ZIP内に画像が見つかりません'));
          return;
        }

        imageEntries.sort((a, b) => a.fileName.localeCompare(b.fileName));

        if (pageNumber < 0 || pageNumber >= imageEntries.length) {
          reject(new Error('ページ番号が範囲外です'));
          return;
        }

        const targetEntry = imageEntries[pageNumber];

        yauzl.open(zipPath, { lazyEntries: true }, (err2: any, zipfile2: any) => {
          if (err2) {
            reject(err2);
            return;
          }

          zipfile2.readEntry();
          zipfile2.on('entry', (entry: any) => {
            if (entry.fileName === targetEntry.fileName) {
              zipfile2.openReadStream(entry, (err3: any, readStream: any) => {
                if (err3) {
                  reject(err3);
                  return;
                }

                const chunks: Buffer[] = [];
                readStream.on('data', (chunk: Buffer) => chunks.push(chunk));
                readStream.on('end', () => resolve(Buffer.concat(chunks)));
                readStream.on('error', reject);
              });
            } else {
              zipfile2.readEntry();
            }
          });
        });
      });

      zipfile.on('error', reject);
    });
  });
}

/**
 * ZIPからページリストを取得
 */
async function getPageListFromZip(zipPath: string): Promise<string[]> {

  return new Promise((resolve, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (err: any, zipfile: any) => {
      if (err) {
        reject(err);
        return;
      }

      const imageFiles: string[] = [];

      zipfile.readEntry();
      zipfile.on('entry', (entry: any) => {
        const ext = path.extname(entry.fileName).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
          imageFiles.push(entry.fileName);
        }
        zipfile.readEntry();
      });

      zipfile.on('end', () => {
        resolve(imageFiles.sort());
      });

      zipfile.on('error', reject);
    });
  });
}

/**
 * キャッシュに追加
 */
function addToCache(key: string, buffer: Buffer) {
  const size = buffer.length;

  // キャッシュサイズを超える場合は古いエントリを削除
  while (currentCacheSize + size > MAX_CACHE_SIZE && imageCache.size > 0) {
    const firstKey = imageCache.keys().next().value;
    if (firstKey !== undefined) {
      const firstBuffer = imageCache.get(firstKey)!;
      currentCacheSize -= firstBuffer.length;
      imageCache.delete(firstKey);
    }
  }

  imageCache.set(key, buffer);
  currentCacheSize += size;
}

/**
 * キャッシュをクリア
 */
export function clearCache() {
  imageCache.clear();
  currentCacheSize = 0;
}
