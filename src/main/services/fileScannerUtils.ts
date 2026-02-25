import fs from 'fs';
import path from 'path';

export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];

/**
 * ディレクトリ内に画像のみ（隠しファイルは無視）が含まれているかチェック
 * txtとjpgが混在するフォルダなどは対象外となる
 */
export async function hasImagesOnly(dirPath: string): Promise<boolean> {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    let hasImage = false;

    // 無視するファイル名（小文字で定義）
    const ignoredFiles = ['thumbs.db', 'desktop.ini', '.ds_store'];

    for (const entry of entries) {
      if (!entry.isFile()) continue; // ディレクトリ等は無視（今回は直下のファイルのみが対象）

      const fileName = entry.name.toLowerCase();
      if (ignoredFiles.includes(fileName) || fileName.startsWith('.')) {
        continue; // 隠しファイルやシステムファイルは無視
      }

      const ext = path.extname(fileName);
      if (IMAGE_EXTENSIONS.includes(ext)) {
        hasImage = true;
      } else {
        // 画像でも無視対象でもないファイルが見つかったら、画像のみのフォルダではない
        return false;
      }
    }

    return hasImage;
  } catch (error) {
    return false;
  }
}
