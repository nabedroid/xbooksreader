/**
 * 画像変換サービス
 * フォルダ内の画像を形式変換し、オプションでZIP圧縮する
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import archiver from 'archiver';
import { BrowserWindow } from 'electron';
import { dbQuery } from '../database/db';

export interface ConvertOptions {
  targetPath: string;
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
  recursive: boolean;
  zip: boolean;
  deleteOriginal: boolean;
}

export interface ConvertProgress {
  total: number;
  current: number;
  message: string;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

/**
 * 画像変換を実行
 */
export async function convertImages(
  options: ConvertOptions,
  window?: BrowserWindow
): Promise<{ success: number; failed: number }> {
  // Windowsでのファイルロック回避のためキャッシュを無効化
  sharp.cache(false);

  const { targetPath, recursive } = options;
  const stats = { success: 0, failed: 0 };

  // 対象フォルダのリストアップ
  const directories = recursive ? getAllDirectories(targetPath) : [targetPath];

  let totalImages = 0;
  // 進捗計算用に画像数をカウント（概算）
  for (const dir of directories) {
    const files = fs.readdirSync(dir);
    totalImages += files.filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase())).length;
  }

  let processedImages = 0;

  const updateProgress = (message: string) => {
    if (window) {
      window.webContents.send('convert:progress', {
        total: totalImages,
        current: processedImages,
        message
      } as ConvertProgress);
    }
  };

  for (const dir of directories) {
    updateProgress(`処理中: ${dir}`);

    // 画像ファイルを取得
    const files = fs.readdirSync(dir).filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));
    if (files.length === 0) continue;

    // 1. 画像変換処理
    const convertedFiles: string[] = [];

    for (const file of files) {
      const filePath = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();
      const basename = path.basename(file, ext);
      const newExt = options.format === 'jpeg' ? '.jpg' : `.${options.format}`;
      const newFilePath = path.join(dir, `${basename}${newExt}`);

      // 拡張子が同じなら変換をスキップ
      if (ext === newExt) {
        convertedFiles.push(filePath);
        stats.success++;
        processedImages++;
        updateProgress(`スキップ（同形式）: ${filePath}`);
        continue;
      }

      // 変換後のファイルが既に存在する場合はスキップ
      if (fs.existsSync(newFilePath)) {
        convertedFiles.push(newFilePath);
        stats.success++;
        processedImages++;
        updateProgress(`スキップ（変換済）: ${newFilePath}`);
        continue;
      }

      try {
        updateProgress(`変換中: ${filePath}`);

        // sharpで変換
        // 一時ファイルに書き出してからリネーム（同名ファイル対策）
        const tempPath = path.join(dir, `${basename}_temp_${Date.now()}${newExt}`);
        const pipeline = sharp(filePath);
        if (options.format === 'jpeg') {
          pipeline.jpeg({ quality: options.quality });
        } else if (options.format === 'png') {
          pipeline.png({ quality: options.quality });
        } else if (options.format === 'webp') {
          pipeline.webp({ quality: options.quality });
        }

        await pipeline.toFile(tempPath);

        // 成功したら置き換え or 追加
        // deleteOriginal=true かつ 拡張子が違うなら元のファイルを消す
        if (options.deleteOriginal && ext !== newExt) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error(`Failed to delete original: ${filePath}`, e);
          }
        }

        // リネーム
        try {
          if (fs.existsSync(newFilePath)) fs.unlinkSync(newFilePath);
          fs.renameSync(tempPath, newFilePath);
          convertedFiles.push(newFilePath);
          stats.success++;
        } catch (e) {
          console.error('Rename failed', e);
          // 失敗したらtemp消す
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          throw e;
        }

      } catch (error) {
        console.error(`Failed to convert ${file}:`, error);
        stats.failed++;
      } finally {
        processedImages++;
        updateProgress(`変換完了: ${filePath}`);
      }
    }

    // 2. ZIP圧縮処理
    if (options.zip && convertedFiles.length > 0) {
      updateProgress(`圧縮処理待機: ${dir}`);
      try {
        const zipPath = `${dir}.zip`; // フォルダ名.zip

        // ZIPが既に存在する場合はスキップ
        if (fs.existsSync(zipPath)) {
          updateProgress(`ZIPスキップ（存在済）: ${zipPath}`);
          // ZIPスキップ時は元ファイル削除もしない（安全のため）
        } else {
          updateProgress(`圧縮中: ${dir}`);
          await createZip(dir, zipPath);

          // 元フォルダ削除 (ZIP作成成功時のみ)
          if (options.deleteOriginal) {
            // ディレクトリごと削除には fs.rmSync({ recursive: true }) が必要
            try {
              fs.rmSync(dir, { recursive: true, force: true });
            } catch (e) {
              console.error(`Failed to delete dir: ${dir}`, e);
            }
          }
          // 3. DB更新 (ZIP作成時のみ更新)
          await updateBookDatabase(dir, zipPath);
        }

      } catch (error) {
        console.error(`Failed to zip ${dir}:`, error);
        // ZIP失敗時はカウントしないがログは残す
      }
    }
  }

  updateProgress('完了');
  return stats;
}

/**
 * サブディレクトリを再帰的に取得
 */
function getAllDirectories(dirPath: string): string[] {
  let dirs: string[] = [];
  try {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        dirs = dirs.concat(getAllDirectories(fullPath));
      }
    }

    // 画像が含まれるフォルダなら自分自身も追加（画像変換の対象とするため）
    // ルートフォルダにも画像があるかもしれない
    if (dirs.length === 0 || hasImage(dirPath)) {
      dirs.push(dirPath);
    }
  } catch (e) {
    console.error(e);
  }
  return dirs;
}

function hasImage(dirPath: string): boolean {
  const files = fs.readdirSync(dirPath);
  return files.some(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));
}

/**
 * ZIPファイルを作成
 */
function createZip(sourceDir: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // 最高圧縮率
    });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false); // false: フォルダ名を含めない（中身をルートに）
    archive.finalize();
  });
}


/**
 * DBのパスとタイプを更新
 */
async function updateBookDatabase(oldPath: string, newPath: string) {
  // パスが一致する本を検索
  // フォルダパスなので、完全一致または前方一致？
  // 本として登録されているのは directories のどれかなので、完全一致のはず。

  // パスの区切り文字を統一するなど正規化が必要かもしれないが、
  // ここでは単純に一致検索する

  try {
    await dbQuery.run(`
            UPDATE books
            SET path = ?, type = 'zip'
            WHERE path = ?
        `, [newPath, oldPath]);
  } catch (e) {
    console.error('DB Update failed', e);
  }
}
