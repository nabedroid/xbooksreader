/**
 * メタデータ抽出サービス
 * ファイルパスからメタデータを抽出
 */
import path from 'path';

export interface ExtractedMetadata {
  title?: string;
  series?: string;
  character?: string;
  author?: string;
  circle?: string;
}

/**
 * パスからメタデータを抽出
 * パターン: シリーズ名/キャラクター名/本のタイトル
 */
export function extractMetadataFromPath(filePath: string): ExtractedMetadata {
  const parts = filePath.split(/[/\\]/);
  const metadata: ExtractedMetadata = {};

  if (parts.length >= 3) {
    // 最後から3番目: シリーズ名
    metadata.series = parts[parts.length - 3];

    // 最後から2番目: キャラクター名（タグとして使用可能）
    metadata.character = parts[parts.length - 2];

    // 最後: ファイル名からタイトルを抽出
    const fileName = parts[parts.length - 1];
    metadata.title = path.basename(fileName, path.extname(fileName));

    // タイトルからサークル名を抽出（[サークル名] パターン）
    const circleMatch = metadata.title.match(/\[([^\]]+)\]/);
    if (circleMatch) {
      metadata.circle = circleMatch[1];
      // サークル名をタイトルから除去
      metadata.title = metadata.title.replace(/\[([^\]]+)\]\s*/, '').trim();
    }

    // タイトルから作者名を抽出（(作者名) パターン）
    const authorMatch = metadata.title.match(/\(([^)]+)\)/);
    if (authorMatch) {
      metadata.author = authorMatch[1];
      // 作者名をタイトルから除去
      metadata.title = metadata.title.replace(/\(([^)]+)\)\s*/, '').trim();
    }
  } else {
    // パスが短い場合はファイル名のみ使用
    const fileName = parts[parts.length - 1];
    metadata.title = path.basename(fileName, path.extname(fileName));
  }

  return metadata;
}
