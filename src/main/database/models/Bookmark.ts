/**
 * しおり（Bookmark）モデル
 */
import { dbQuery } from '../db';
import type { Bookmark, BookmarkInput } from '@/types';

/**
 * しおりを作成
 */
export async function createBookmark(input: BookmarkInput): Promise<Bookmark> {
  const result = await dbQuery.run(`
    INSERT INTO bookmarks (book_id, page_number, note)
    VALUES (?, ?, ?)
  `, [input.book_id, input.page_number, input.note || null]);

  const bookmark = await getBookmarkById(result.lastID);
  return bookmark!;
}

/**
 * IDでしおりを取得
 */
export async function getBookmarkById(id: number): Promise<Bookmark | null> {
  return dbQuery.get<Bookmark>('SELECT * FROM bookmarks WHERE id = ?', [id]);
}

/**
 * 本のしおりを全て取得
 */
export async function getBookBookmarks(bookId: number): Promise<Bookmark[]> {
  return dbQuery.all<Bookmark>('SELECT * FROM bookmarks WHERE book_id = ? ORDER BY page_number', [bookId]);
}

/**
 * しおりを更新
 */
export async function updateBookmark(id: number, note: string): Promise<Bookmark | null> {
  await dbQuery.run('UPDATE bookmarks SET note = ? WHERE id = ?', [note, id]);
  return getBookmarkById(id);
}

/**
 * しおりを削除
 */
export async function deleteBookmark(id: number): Promise<boolean> {
  const result = await dbQuery.run('DELETE FROM bookmarks WHERE id = ?', [id]);
  return result.changes > 0;
}

/**
 * 本の特定ページのしおりを取得
 */
export async function getBookmarkByPage(bookId: number, pageNumber: number): Promise<Bookmark | null> {
  return dbQuery.get<Bookmark>('SELECT * FROM bookmarks WHERE book_id = ? AND page_number = ?', [bookId, pageNumber]);
}
