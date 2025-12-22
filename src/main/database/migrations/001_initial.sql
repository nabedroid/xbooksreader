-- 初期スキーマ作成
-- バージョン: 001

-- 本テーブル
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,              -- フォルダまたはZIPへの絶対パス
    type TEXT NOT NULL CHECK(type IN ('folder', 'zip')),  -- 'folder' または 'zip'
    title TEXT,                             -- タイトル
    series TEXT,                            -- シリーズ名
    author TEXT,                            -- 作者
    circle TEXT,                            -- サークル名
    rating INTEGER DEFAULT 0 CHECK(rating >= 0 AND rating <= 5),  -- 評価（0-5星）
    favorite BOOLEAN DEFAULT 0,             -- お気に入り
    thumbnail BLOB,                         -- Base64エンコードされたサムネイル
    page_count INTEGER,                     -- ページ数
    last_read_page INTEGER DEFAULT 0,       -- 最後に読んだページ
    last_read_at DATETIME,                  -- 最終閲覧日時
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- タグテーブル（多対多）
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- 本とタグの関連テーブル
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

-- パフォーマンス向上のためのインデックス
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_series ON books(series);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_circle ON books(circle);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating);
CREATE INDEX IF NOT EXISTS idx_books_favorite ON books(favorite);
CREATE INDEX IF NOT EXISTS idx_books_last_read_at ON books(last_read_at);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_bookmarks_book ON bookmarks(book_id);

-- マイグレーションバージョン管理テーブル
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初期バージョンを記録
INSERT OR IGNORE INTO schema_version (version) VALUES (1);
