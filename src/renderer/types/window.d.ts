/**
 * Window APIの型定義
 */
import type { Book, BookInput, Tag, Bookmark, BookmarkInput, SearchFilter, ScanProgress, MetadataExtractionOptions, ScrapedBook } from '@/types';

declare global {
  interface Window {
    electronAPI: {
      // 本の操作
      books: {
        getAll: () => Promise<Book[]>;
        getById: (id: number) => Promise<Book | null>;
        search: (filter: SearchFilter) => Promise<Book[]>;
        create: (book: BookInput) => Promise<Book>;
        update: (id: number, book: Partial<BookInput>) => Promise<Book>;
        delete: (id: number) => Promise<boolean>;
        updatePath: (oldPath: string, newPath: string, dryRun: boolean) => Promise<number>;
        incrementReadCount: (id: number) => Promise<void>;
        getMetadataList: (field: 'series' | 'author' | 'circle' | 'original_work' | 'characters') => Promise<string[]>;
        getCount: (filter: SearchFilter) => Promise<number>;
        deleteOrphans: (basePaths: string[]) => Promise<{ orphanBooks: number; orphanLocations: number }>;
      };

      organizer: {
        preview: (template: string) => Promise<{
          items: any[];
          total: number;
          conflicts: number;
          errors: number;
          notConnectedPorts: string[];
        }>;
        execute: (items: any[]) => Promise<{ success: number; failed: number }>;
      };

      // タグの操作
      tags: {
        getAll: () => Promise<Tag[]>;
        getBookTags: (bookId: number) => Promise<Tag[]>;
        setBookTags: (bookId: number, tags: string[]) => Promise<void>;
        addToBook: (bookId: number, tag: string) => Promise<void>;
        removeFromBook: (bookId: number, tag: string) => Promise<void>;
      };

      // しおりの操作
      bookmarks: {
        getBookBookmarks: (bookId: number) => Promise<Bookmark[]>;
        create: (bookmark: BookmarkInput) => Promise<Bookmark>;
        update: (id: number, note: string) => Promise<Bookmark>;
        delete: (id: number) => Promise<boolean>;
      };

      // スキャン操作
      scanner: {
        start: (paths: string[], mode: 'add' | 'sync', options: MetadataExtractionOptions) => Promise<number>;
        cancel: () => Promise<void>;
        smartScan: (paths: string[]) => Promise<{ added: number; updated: number; removed: number }>;
        onProgress: (callback: (progress: ScanProgress) => void) => void;
      };

      // 画像読み込み
      images: {
        load: (bookId: number, pageNumber: number) => Promise<string>; // Base64
        getThumbnail: (bookId: number, pageNumber: number) => Promise<string>; // Base64
        getPages: (bookId: number) => Promise<string[]>;
        convert: (options: any) => Promise<any>;
        onProgress: (callback: (progress: any) => void) => void;
      };

      // バックアップ/エクスポート
      backup: {
        exportMetadata: (path: string) => Promise<void>;
        importMetadata: (path: string) => Promise<number>;
        createBackup: (path: string) => Promise<void>;
        restoreBackup: (path: string) => Promise<void>;
      };

      // メタデータWeb取得
      metadata: {
        search: (query: string) => Promise<ScrapedBook[]>;
      };

      // ユーティリティ
      utils: {
        selectDirectory: () => Promise<string | null>;
        onMenuNavigate: (callback: (path: string) => void) => () => void;
        onMenuAction: (callback: (action: string) => void) => () => void;
        onMenuPathReplace: (callback: () => void) => () => void;
        onMenuImageConvert: (callback: () => void) => () => void;
        showConfirm: (message: string) => Promise<boolean>;
        showAlert: (message: string) => Promise<void>;
      };
    };
  }
}

export { };
