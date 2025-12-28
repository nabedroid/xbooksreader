/**
 * 共通型定義
 */

/**
 * 本の型
 */
export interface Book {
  id: number;
  path: string;
  type: 'folder' | 'zip';
  title: string | null;
  series: string[];
  author: string[];
  circle: string[];
  original_work: string[];
  characters: string[];
  rating: number;
  favorite: boolean;
  thumbnail: string | null;
  page_count: number | null;
  read_count: number;
  last_read_page: number;
  last_read_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 本の作成/更新用の型
 */
export interface BookInput {
  path: string;
  type: 'folder' | 'zip';
  title?: string;
  series?: string | string[];
  author?: string | string[];
  circle?: string | string[];
  original_work?: string | string[];
  characters?: string | string[];
  rating?: number;
  favorite?: boolean;
  thumbnail?: Buffer;
  page_count?: number;
  last_read_page?: number;
  last_read_at?: string;
}

/**
 * タグの型
 */
export interface Tag {
  id: number;
  name: string;
}

/**
 * しおりの型
 */
export interface Bookmark {
  id: number;
  book_id: number;
  page_number: number;
  note: string | null;
  created_at: string;
}

/**
 * しおりの作成用の型
 */
export interface BookmarkInput {
  book_id: number;
  page_number: number;
  note?: string;
}

/**
 * 検索フィルター
 */
export interface SearchFilter {
  query?: string;
  series?: string;
  author?: string;
  circle?: string;
  original_work?: string;
  characters?: string;
  tags?: string[];
  rating?: number;
  favorite?: boolean;
  sortBy?: 'title' | 'created_at' | 'updated_at' | 'last_read_at' | 'rating' | 'read_count';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * スキャン進捗情報
 */
export interface ScanProgress {
  current: number;
  total: number;
  currentPath: string;
  status: 'scanning' | 'processing' | 'completed' | 'error';
}

/**
 * メタデータ抽出オプション
 */
export interface MetadataExtractionOptions {
  enabled: boolean;
  pathPattern?: 'series/character/title' | 'custom';
}

/**
 * Webから取得した本の情報
 */
export interface ScrapedBook {
  title: string;
  circle?: string;
  author?: string;
  tags: string[];
  description?: string;
  imageUrl?: string;
  siteName: 'DLsite' | 'FANZA';
  url: string;
}
