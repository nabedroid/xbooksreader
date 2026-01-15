-- booksテーブルのpathカラムをNULL許容にする（CAS移行用）
-- バージョン: 007

PRAGMA foreign_keys=OFF;

-- 1. 新しいテーブルを作成（pathをNULL許容、UNIQUE制約を削除）
CREATE TABLE books_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT,                                      -- NULL許容、UNIQUEなし
    type TEXT CHECK(type IN ('folder', 'zip')),
    title TEXT,
    series TEXT,
    author TEXT,
    circle TEXT,
    rating INTEGER DEFAULT 0 CHECK(rating >= 0 AND rating <= 10),
    favorite BOOLEAN DEFAULT 0,
    thumbnail BLOB,
    page_count INTEGER,
    last_read_page INTEGER DEFAULT 0,
    last_read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    original_work TEXT,
    read_count INTEGER DEFAULT 0,
    characters TEXT,
    phash TEXT,
    file_size INTEGER
);

-- 2. データを移行
-- すべての既存カラムを維持
INSERT INTO books_new (
    id, path, type, title, series, author, circle, rating, favorite,
    thumbnail, page_count, last_read_page, last_read_at, created_at, updated_at,
    original_work, read_count, characters, phash, file_size
) SELECT 
    id, path, type, title, series, author, circle, rating, favorite,
    thumbnail, page_count, last_read_page, last_read_at, created_at, updated_at,
    original_work, read_count, characters, phash, file_size
FROM books;

-- 3. 古いテーブルを削除してリネーム
DROP TABLE books;
ALTER TABLE books_new RENAME TO books;

-- 4. インデックスを再作成
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_series ON books(series);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
CREATE INDEX IF NOT EXISTS idx_books_circle ON books(circle);
CREATE INDEX IF NOT EXISTS idx_books_rating ON books(rating);
CREATE INDEX IF NOT EXISTS idx_books_favorite ON books(favorite);
CREATE INDEX IF NOT EXISTS idx_books_last_read_at ON books(last_read_at);
CREATE INDEX IF NOT EXISTS idx_books_original_work ON books(original_work);
CREATE INDEX IF NOT EXISTS idx_books_read_count ON books(read_count);
CREATE INDEX IF NOT EXISTS idx_books_characters ON books(characters);
CREATE INDEX IF NOT EXISTS idx_books_phash_page_count ON books(phash, page_count);

-- 5. schema_versionを更新
INSERT OR REPLACE INTO schema_version (version) VALUES (7);

PRAGMA foreign_keys=ON;
