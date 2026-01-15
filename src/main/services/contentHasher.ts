import sharp from 'sharp';
import { loadImageFromPath, getPageListFromPath } from './imageLoader';

/**
 * 本のコンテンツ識別子
 */
export interface ContentIdentity {
  phash: string;      // pHash
  pageCount: number;  // ページ数
  fileSize: number;   // ファイルサイズ（概算）
  thumbnail: Buffer;  // サムネイルデータ
}

/**
 * 本のコンテンツIDを計算する
 * @param fsPath ファイルパス（フォルダ or ZIP）
 */
export async function calculateContentIdentity(fsPath: string): Promise<ContentIdentity> {
  const type = fsPath.toLowerCase().endsWith('.zip') ? 'zip' : 'folder';

  // 1. ページリスト取得（ページ数）
  const pages = await getPageListFromPath(fsPath, type);
  const pageCount = pages.length;
  if (pageCount === 0) {
    throw new Error('画像が含まれていません');
  }

  // 2. 先頭ページの画像データを取得
  const imageBuffer = await loadImageFromPath(fsPath, type, 0);

  // 3. pHash計算
  const phash = await calculatePHash(imageBuffer);

  // 4. サムネイル生成
  const thumbnail = await sharp(imageBuffer)
    .resize(200, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFormat('jpeg', { quality: 85 })
    .toBuffer();

  return {
    phash,
    pageCount,
    fileSize: 0,
    thumbnail
  };
}

/**
 * 画像バッファからpHash (Average Hash) を計算
 * sharpのみで実装
 */
async function calculatePHash(buffer: Buffer): Promise<string> {
  const size = 8; // 8x8 = 64bit hash

  // 1. リサイズ & グレースケール & RAWデータ取得
  const { data } = await sharp(buffer)
    .resize(size, size, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 2. 平均値を計算
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  const avg = sum / data.length;

  // 3. 各ピクセルを平均と比較してビット列を生成
  let hash = '';
  for (let i = 0; i < data.length; i++) {
    hash += data[i] >= avg ? '1' : '0';
  }

  // 4. 2進数を16進数に変換
  return BigInt('0b' + hash).toString(16).padStart(size * size / 4, '0');
}
