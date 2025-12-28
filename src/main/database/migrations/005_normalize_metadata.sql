-- メタデータ項目の正規化
-- バージョン: 005

PRAGMA foreign_keys=OFF;

-- メタデータマスターテーブル
CREATE TABLE IF NOT EXISTS metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'series', 'author', 'circle', 'original_work', 'characters'
    name TEXT NOT NULL,
    UNIQUE(type, name)
);

-- 本とメタデータの関連テーブル
CREATE TABLE IF NOT EXISTS book_metadata (
    book_id INTEGER NOT NULL,
    metadata_id INTEGER NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (metadata_id) REFERENCES metadata(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, metadata_id)
);

-- 検索を高速化するためのインデックス
CREATE INDEX IF NOT EXISTS idx_metadata_type_name ON metadata(type, name);
CREATE INDEX IF NOT EXISTS idx_book_metadata_book ON book_metadata(book_id);
CREATE INDEX IF NOT EXISTS idx_book_metadata_item ON book_metadata(metadata_id);

INSERT OR REPLACE INTO schema_version (version) VALUES (5);

PRAGMA foreign_keys=ON;
