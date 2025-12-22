-- メタデータ拡張
-- バージョン: 002

ALTER TABLE books ADD COLUMN original_work TEXT;
ALTER TABLE books ADD COLUMN read_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_books_original_work ON books(original_work);
CREATE INDEX IF NOT EXISTS idx_books_read_count ON books(read_count);

-- バージョン更新
INSERT OR REPLACE INTO schema_version (version) VALUES (2);
