-- メタデータ拡張（キャラクター項目追加）
-- バージョン: 003

ALTER TABLE books ADD COLUMN characters TEXT;

CREATE INDEX IF NOT EXISTS idx_books_characters ON books(characters);

-- バージョン更新
INSERT OR REPLACE INTO schema_version (version) VALUES (3);
