-- 評価の制約を0-10に更新
-- バージョン: 004

PRAGMA foreign_keys=off;

CREATE TABLE IF NOT EXISTS books_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('folder', 'zip')),
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
    characters TEXT
);

INSERT INTO books_new (
    id, path, type, title, series, author, circle, rating, favorite,
    thumbnail, page_count, last_read_page, last_read_at, created_at, updated_at,
    original_work, read_count, characters
) SELECT
    id, path, type, title, series, author, circle, rating, favorite,
    thumbnail, page_count, last_read_page, last_read_at, created_at, updated_at,
    original_work, read_count, characters
FROM books;

DROP TABLE books;

ALTER TABLE books_new RENAME TO books;

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

PRAGMA foreign_keys=on;

INSERT OR REPLACE INTO schema_version (version) VALUES (4);
