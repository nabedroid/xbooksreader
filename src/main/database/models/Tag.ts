/**
 * タグ（Tag）モデル
 */
import { dbQuery } from '../db';
import type { Tag } from '@/types';

/**
 * タグを作成または取得
 */
export async function getOrCreateTag(name: string): Promise<Tag> {
  // 既存のタグを検索
  const tag = await dbQuery.get<Tag>('SELECT * FROM tags WHERE name = ?', [name]);

  if (tag) {
    return tag;
  }

  // 新しいタグを作成
  const result = await dbQuery.run('INSERT INTO tags (name) VALUES (?)', [name]);
  return {
    id: result.lastID,
    name,
  };
}

/**
 * 本にタグを追加
 */
export async function addTagToBook(bookId: number, tagName: string): Promise<void> {
  const tag = await getOrCreateTag(tagName);
  await dbQuery.run('INSERT OR IGNORE INTO book_tags (book_id, tag_id) VALUES (?, ?)', [bookId, tag.id]);
}

/**
 * 本からタグを削除
 */
export async function removeTagFromBook(bookId: number, tagName: string): Promise<void> {
  await dbQuery.run(`
    DELETE FROM book_tags
    WHERE book_id = ? AND tag_id = (SELECT id FROM tags WHERE name = ?)
  `, [bookId, tagName]);
}

/**
 * 本のタグを取得
 */
export async function getBookTags(bookId: number): Promise<Tag[]> {
  return dbQuery.all<Tag>(`
    SELECT t.* FROM tags t
    INNER JOIN book_tags bt ON t.id = bt.tag_id
    WHERE bt.book_id = ?
  `, [bookId]);
}

/**
 * 本のタグを設定（既存のタグを全て置き換え）
 */
export async function setBookTags(bookId: number, tagNames: string[]): Promise<void> {
  // 既存のタグを削除
  await dbQuery.run('DELETE FROM book_tags WHERE book_id = ?', [bookId]);

  // 新しいタグを追加
  for (const tagName of tagNames) {
    await addTagToBook(bookId, tagName);
  }
}

/**
 * 全てのタグを取得
 */
export async function getAllTags(): Promise<Tag[]> {
  return dbQuery.all<Tag>('SELECT * FROM tags ORDER BY name');
}

/**
 * タグを削除（どの本にも使用されていない場合のみ）
 */
export async function deleteUnusedTags(): Promise<number> {
  const result = await dbQuery.run(`
    DELETE FROM tags
    WHERE id NOT IN (SELECT DISTINCT tag_id FROM book_tags)
  `);

  return result.changes;
}
