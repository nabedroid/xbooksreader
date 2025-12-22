/**
 * 本（Book）モデル
 */
import { dbQuery } from '../db';
import type { Book, BookInput, SearchFilter } from '@/types';

/**
 * 本を作成
 */
export async function createBook(input: BookInput): Promise<Book> {
  const result = await dbQuery.run(`
    INSERT INTO books (path, type, title, series, author, circle, original_work, characters, rating, favorite, thumbnail, page_count)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    input.path,
    input.type,
    input.title || null,
    input.series || null,
    input.author || null,
    input.circle || null,
    input.original_work || null,
    input.characters || null,
    input.rating || 0,
    input.favorite ? 1 : 0,
    input.thumbnail || null,
    input.page_count || null
  ]);

  const book = await getBookById(result.lastID);
  return book!;
}

/**
 * DBの結果をBook型に変換
 */
function mapBook(row: any): Book {
  return {
    ...row,
    favorite: row.favorite === 1,
    thumbnail: row.thumbnail ? Buffer.from(row.thumbnail).toString('base64') : null,
  };
}

/**
 * IDで本を取得
 */
export async function getBookById(id: number): Promise<Book | null> {
  const row = await dbQuery.get<any>('SELECT * FROM books WHERE id = ?', [id]);
  return row ? mapBook(row) : null;
}

/**
 * パスで本を取得
 */
export async function getBookByPath(path: string): Promise<Book | null> {
  const row = await dbQuery.get<any>('SELECT * FROM books WHERE path = ?', [path]);
  return row ? mapBook(row) : null;
}

/**
 * 本を更新
 */
export async function updateBook(id: number, input: Partial<BookInput>): Promise<Book | null> {
  const fields: string[] = [];
  const values: any[] = [];

  if (input.title !== undefined) {
    fields.push('title = ?');
    values.push(input.title);
  }
  if (input.series !== undefined) {
    fields.push('series = ?');
    values.push(input.series);
  }
  if (input.author !== undefined) {
    fields.push('author = ?');
    values.push(input.author);
  }
  if (input.circle !== undefined) {
    fields.push('circle = ?');
    values.push(input.circle);
  }
  if (input.original_work !== undefined) {
    fields.push('original_work = ?');
    values.push(input.original_work);
  }
  if (input.characters !== undefined) {
    fields.push('characters = ?');
    values.push(input.characters);
  }
  if (input.rating !== undefined) {
    fields.push('rating = ?');
    values.push(input.rating);
  }
  if (input.favorite !== undefined) {
    fields.push('favorite = ?');
    values.push(input.favorite ? 1 : 0);
  }
  if (input.thumbnail !== undefined) {
    fields.push('thumbnail = ?');
    values.push(input.thumbnail);
  }
  if (input.page_count !== undefined) {
    fields.push('page_count = ?');
    values.push(input.page_count);
  }
  if (input.last_read_page !== undefined) {
    fields.push('last_read_page = ?');
    values.push(input.last_read_page);
  }
  if (input.last_read_at !== undefined) {
    fields.push('last_read_at = ?');
    values.push(input.last_read_at);
  }

  if (fields.length === 0) {
    return getBookById(id);
  }

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  await dbQuery.run(`
    UPDATE books SET ${fields.join(', ')} WHERE id = ?
  `, values);

  return getBookById(id);
}

/**
 * 本を削除
 */
export async function deleteBook(id: number): Promise<boolean> {
  const result = await dbQuery.run('DELETE FROM books WHERE id = ?', [id]);
  return result.changes > 0;
}

/**
 * 本を検索
 */
export async function searchBooks(filter: SearchFilter = {}): Promise<Book[]> {
  let query = 'SELECT * FROM books WHERE 1=1';
  const params: any[] = [];

  // テキスト検索
  if (filter.query) {
    query += ' AND (title LIKE ? OR series LIKE ? OR author LIKE ? OR circle LIKE ? OR original_work LIKE ? OR characters LIKE ?)';
    const searchTerm = `%${filter.query}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  // シリーズフィルター
  if (filter.series) {
    query += ' AND series LIKE ?';
    params.push(`%${filter.series}%`);
  }

  // 作者フィルター
  if (filter.author) {
    query += ' AND author LIKE ?';
    params.push(`%${filter.author}%`);
  }

  // サークルフィルター
  if (filter.circle) {
    query += ' AND circle LIKE ?';
    params.push(`%${filter.circle}%`);
  }

  // 原作フィルター
  if (filter.original_work) {
    query += ' AND original_work LIKE ?';
    params.push(`%${filter.original_work}%`);
  }

  // キャラクターフィルター
  if (filter.characters) {
    query += ' AND characters LIKE ?';
    params.push(`%${filter.characters}%`);
  }

  // 評価フィルター
  if (filter.rating !== undefined) {
    if (filter.rating === 0) {
      query += ' AND rating = 0';
    } else {
      query += ' AND rating >= ?';
      params.push(filter.rating);
    }
  }

  // お気に入りフィルター
  if (filter.favorite !== undefined) {
    query += ' AND favorite = ?';
    params.push(filter.favorite ? 1 : 0);
  }

  // タグフィルター (AND検索)
  if (filter.tags && filter.tags.length > 0) {
    query += ` AND id IN (
      SELECT book_id FROM book_tags
      WHERE tag_id IN (SELECT id FROM tags WHERE name IN (${filter.tags.map(() => '?').join(', ')}))
      GROUP BY book_id
      HAVING COUNT(DISTINCT tag_id) = ?
    )`;
    params.push(...filter.tags, filter.tags.length);
  }

  // ソート
  const sortBy = filter.sortBy || 'created_at';
  const sortOrder = filter.sortOrder || 'desc';
  query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

  // ページネーション
  if (filter.limit) {
    query += ' LIMIT ?';
    params.push(filter.limit);
  }
  if (filter.offset) {
    query += ' OFFSET ?';
    params.push(filter.offset);
  }

  const rows = await dbQuery.all<any>(query, params);
  return rows.map(mapBook);
}

/**
 * 全ての本を取得
 */
export async function getAllBooks(): Promise<Book[]> {
  const rows = await dbQuery.all<any>('SELECT * FROM books ORDER BY created_at DESC');
  return rows.map(mapBook);
}

/**
 * 本の総数を取得
 */
export async function getBooksCount(filter: SearchFilter = {}): Promise<number> {
  let query = 'SELECT COUNT(*) as count FROM books WHERE 1=1';
  const params: any[] = [];

  if (filter.query) {
    query += ' AND (title LIKE ? OR series LIKE ? OR author LIKE ? OR circle LIKE ? OR original_work LIKE ? OR characters LIKE ?)';
    const searchTerm = `%${filter.query}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (filter.series) {
    query += ' AND series LIKE ?';
    params.push(`%${filter.series}%`);
  }

  if (filter.author) {
    query += ' AND author LIKE ?';
    params.push(`%${filter.author}%`);
  }

  if (filter.circle) {
    query += ' AND circle LIKE ?';
    params.push(`%${filter.circle}%`);
  }

  if (filter.original_work) {
    query += ' AND original_work LIKE ?';
    params.push(`%${filter.original_work}%`);
  }

  if (filter.characters) {
    query += ' AND characters LIKE ?';
    params.push(`%${filter.characters}%`);
  }

  if (filter.rating !== undefined) {
    if (filter.rating === 0) {
      query += ' AND rating = 0';
    } else {
      query += ' AND rating >= ?';
      params.push(filter.rating);
    }
  }

  if (filter.favorite !== undefined) {
    query += ' AND favorite = ?';
    params.push(filter.favorite ? 1 : 0);
  }

  const result = await dbQuery.get<{ count: number }>(query, params);
  return result ? result.count : 0;
}

/**
 * 閲覧回数を加算
 */
export async function incrementReadCount(id: number): Promise<void> {
  await dbQuery.run('UPDATE books SET read_count = read_count + 1 WHERE id = ?', [id]);
}

/**
 * 指定したフィールドのユニークなリストを取得
 */
export async function getMetadataList(field: 'series' | 'author' | 'circle' | 'original_work' | 'characters'): Promise<string[]> {
  const rows = await dbQuery.all<any>(`
    SELECT DISTINCT ${field} FROM books 
    WHERE ${field} IS NOT NULL AND ${field} != '' 
  `);

  const resultSet = new Set<string>();
  rows.forEach(row => {
    const value = row[field];
    if (value) {
      value.split(',').forEach((v: string) => {
        const trimmed = v.trim();
        if (trimmed) resultSet.add(trimmed);
      });
    }
  });

  return Array.from(resultSet).sort();
}
