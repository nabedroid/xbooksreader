-- Phase 2: CAS Architecture Migration

-- 1. booksテーブルにコンテンツ識別用カラムを追加
-- page_countは既存なので追加しない
ALTER TABLE books ADD COLUMN phash TEXT;
ALTER TABLE books ADD COLUMN file_size INTEGER;

-- phashとpage_countで検索するためのインデックス
CREATE INDEX IF NOT EXISTS idx_books_phash_page_count ON books(phash, page_count);

-- 2. book_locationsテーブルを作成
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

-- statusでの検索用インデックス
CREATE INDEX IF NOT EXISTS idx_book_locations_status ON book_locations(status);
-- volume_idでの検索用インデックス
CREATE INDEX IF NOT EXISTS idx_book_locations_volume_id ON book_locations(volume_id);

-- 3. schema_versionを更新
INSERT OR REPLACE INTO schema_version (version) VALUES (6);
