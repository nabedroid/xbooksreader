/**
 * メタデータ抽出サービス
 * ファイルパスからメタデータを抽出
 */
import path from 'path';

export interface ExtractedMetadata {
  title?: string;
  series?: string;
  characters?: string[]; // 複数形に合わせる
  author?: string;
  circle?: string;
}

/**
 * パスからメタデータを抽出
 * @param fullPath 本のフルパス（フォルダまたはZIP）
 * @param baseDir スキャン対象のベースディレクトリ
 */
export function extractMetadataFromPath(fullPath: string, baseDir: string): ExtractedMetadata {
  const relativePath = path.relative(baseDir, fullPath);
  const parts = relativePath.split(/[/\\]/);
  const metadata: ExtractedMetadata = {};

  // リーフフォルダ名（本のタイトル候補）
  const leafName = parts[parts.length - 1];
  const leafTitle = path.basename(leafName, path.extname(leafName));
  metadata.title = leafTitle;

  // 階層に基づいた割り当て
  if (parts.length >= 3) {
    // 3階層以上: [シリーズ] / [キャラクター] / ... / [タイトル]
    metadata.series = parts[0];
    metadata.characters = [parts[1]];
  } else if (parts.length === 2) {
    // 2階層: [シリーズ] / [タイトル]
    metadata.series = parts[0];
  }
  // 1階層の場合はファイル名のみがタイトルになる（既に設定済み）

  // リーフ名称からサークル・作者をパース（既存のメタデータよりも優先または補完）
  // タイトルからサークル名を抽出（[サークル名] パターン）
  const circleMatch = metadata.title.match(/\[([^\]]+)\]/);
  if (circleMatch) {
    metadata.circle = circleMatch[1];
    // サークル名をタイトルからタグ付け等に使う場合は残すが、表示上タイトルから消すかは要件次第
    // 既存ロジックは消しているので踏襲
    metadata.title = metadata.title.replace(/\[([^\]]+)\]\s*/, '').trim();
  }

  // タイトルから作者名を抽出（(作者名) パターン）
  const authorMatch = metadata.title.match(/\(([^)]+)\)/);
  if (authorMatch) {
    metadata.author = authorMatch[1];
    metadata.title = metadata.title.replace(/\(([^)]+)\)\s*/, '').trim();
  }

  return metadata;
}
