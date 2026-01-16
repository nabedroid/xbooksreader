-- xBooksReader データベーススキーマ
-- 最新のテーブル定義を統合した初期化スクリプト

-- 本（Books）テーブル
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT,                                      -- フォルダまたはZIPへの絶対パス（NULL許容）
    type TEXT CHECK(type IN ('folder', 'zip')),     -- 'folder' または 'zip'
    title TEXT,                                     -- タイトル
    series TEXT,                                    -- シリーズ名（正規化前との互換性用）
    author TEXT,                                    -- 作者（正規化前との互換性用）
    circle TEXT,                                    -- サークル名（正規化前との互換性用）
    rating INTEGER DEFAULT 0 CHECK(rating >= 0 AND rating <= 10), -- 評価（0-10星）
    favorite BOOLEAN DEFAULT 0,                     -- お気に入り
    thumbnail BLOB,                                 -- サムネイルバイナリ
    page_count INTEGER,                             -- ページ数
    last_read_page INTEGER DEFAULT 0,               -- 最後に読読んだページ
    last_read_at DATETIME,                          -- 最終閲覧日時
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    original_work TEXT,                             -- 原作（正規化前との互換性用）
    read_count INTEGER DEFAULT 0,                   -- 閲覧回数
    characters TEXT,                                -- キャラクター（正規化前との互換性用）
    phash TEXT,                                     -- 知覚ハッシュ（重複検知用）
    file_size INTEGER                               -- ファイルサイズ
);

-- タグマスターテーブル
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- 本とタグの関連
CREATE TABLE IF NOT EXISTS book_tags (
    book_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, tag_id)
);

-- しおりテーブル
CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    page_number INTEGER NOT NULL,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- メタデータマスター
CREATE TABLE IF NOT EXISTS metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'series', 'author', 'circle', 'original_work', 'characters'
    name TEXT NOT NULL,
    UNIQUE(type, name)
);

-- 本とメタデータの関連
CREATE TABLE IF NOT EXISTS book_metadata (
    book_id INTEGER NOT NULL,
    metadata_id INTEGER NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (metadata_id) REFERENCES metadata(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, metadata_id)
);

-- 本のロケーション（CAS対応）
CREATE TABLE IF NOT EXISTS book_locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL,
  volume_id TEXT NOT NULL,
  base_path TEXT NOT NULL,
  relative_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'offline', 'missing'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating);
CREATE INDEX IF NOT EXISTS idx_books_favorite ON books(favorite);
CREATE INDEX IF NOT EXISTS idx_books_last_read_at ON books(last_read_at);
CREATE INDEX IF NOT EXISTS idx_books_phash_page_count ON books(phash, page_count);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_bookmarks_book ON bookmarks(book_id);
CREATE INDEX IF NOT EXISTS idx_metadata_type_name ON metadata(type, name);
CREATE INDEX IF NOT EXISTS idx_book_metadata_book ON book_metadata(book_id);
CREATE INDEX IF NOT EXISTS idx_book_metadata_item ON book_metadata(metadata_id);
CREATE INDEX IF NOT EXISTS idx_book_locations_status ON book_locations(status);
CREATE INDEX IF NOT EXISTS idx_book_locations_volume_id ON book_locations(volume_id);

-- バージョン記録
PRAGMA user_version = 1;
