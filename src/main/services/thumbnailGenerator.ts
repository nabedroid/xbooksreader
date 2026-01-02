/**
 * サムネイル生成サービス
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const THUMBNAIL_WIDTH = 200;
const THUMBNAIL_HEIGHT = 300;

/**
 * サムネイルを生成
 */
export async function generateThumbnail(
  bookPath: string,
  type: 'folder' | 'zip',
  pageNumber: number = 0
): Promise<Buffer> {
  const imageBuffer = await loadImage(bookPath, type, pageNumber);

  // sharpでサムネイルを生成
  return sharp(imageBuffer)
    .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFormat('jpeg', { quality: 85 })
    .toBuffer();
}

/**
 * 画像を読み込む
 */
async function loadImage(
  bookPath: string,
  type: 'folder' | 'zip',
  pageNumber: number
): Promise<Buffer> {
  if (type === 'folder') {
    return loadImageFromFolder(bookPath, pageNumber);
  } else {
    return loadImageFromZip(bookPath, pageNumber);
  }
}

/**
 * フォルダから画像を読み込む
 */
async function loadImageFromFolder(folderPath: string, pageNumber: number): Promise<Buffer> {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];

  const files = fs.readdirSync(folderPath)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .sort(); // ファイル名でソート

  if (files.length === 0) {
    throw new Error('画像が見つかりません');
  }

  const targetFile = files[Math.min(pageNumber, files.length - 1)];
  const filePath = path.join(folderPath, targetFile);

  return fs.readFileSync(filePath);
}

/**
 * ZIPファイルから画像を読み込む
 */
async function loadImageFromZip(zipPath: string, pageNumber: number): Promise<Buffer> {
  const yauzl = require('yauzl');
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];

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
        if (imageExtensions.includes(ext)) {
          imageEntries.push(entry);
        }
        zipfile.readEntry();
      });

      zipfile.on('end', () => {
        if (imageEntries.length === 0) {
          reject(new Error('ZIP内に画像が見つかりません'));
          return;
        }

        // ファイル名でソート
        imageEntries.sort((a, b) => a.fileName.localeCompare(b.fileName));

        const targetEntry = imageEntries[Math.min(pageNumber, imageEntries.length - 1)];

        // エントリを再度開いて読み込む
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
                readStream.on('end', () => {
                  resolve(Buffer.concat(chunks));
                });
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
