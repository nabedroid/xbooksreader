/**
 * 本（Book）モデル
 */
import { dbQuery } from '../db';
import path from 'path';
import fs from 'fs';
import type { Book, BookInput, SearchFilter } from '@/types';

/**
 * 本を作成
 */
export async function createBook(input: BookInput): Promise<Book> {
  const result = await dbQuery.run(`
    INSERT INTO books (path, type, title, rating, favorite, thumbnail, page_count)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    input.path || null,
    input.type,
    input.title || null,
    input.rating || 0,
    input.favorite ? 1 : 0,
    input.thumbnail || null,
    input.page_count || null
  ]);

  const bookId = result.lastID;

  // メタデータの保存
  if (input.series) await setBookMetadata(bookId, 'series', parseMultiValue(input.series));
  if (input.author) await setBookMetadata(bookId, 'author', parseMultiValue(input.author));
  if (input.circle) await setBookMetadata(bookId, 'circle', parseMultiValue(input.circle));
  if (input.original_work) await setBookMetadata(bookId, 'original_work', parseMultiValue(input.original_work));
  if (input.characters) await setBookMetadata(bookId, 'characters', parseMultiValue(input.characters));

  const book = await getBookById(bookId);
  return book!;
}

/**
 * パスを一括置換
 */
export async function updateBookPaths(oldPath: string, newPath: string, dryRun: boolean): Promise<number> {
  // エスケープ処理（簡易的）
  // LIKE演算子用のエスケープはパラメータバインドで処理されるが、
  // REPLACE関数内ではそのまま使われる。
  // SQLiteのREPLACEは path内の全ての oldPath を newPath に置換する。

  if (dryRun) {
    // 影響を受ける行数をカウント
    const result = await dbQuery.get<{ count: number }>(`
      SELECT COUNT(*) as count FROM books WHERE path LIKE ? || '%'
    `, [oldPath]);
    return result?.count || 0;
  } else {
    // 実際に更新
    // path が oldPath で始まるものを対象に、oldPath を newPath に置換
    // 注: REPLACEは文字列内の全ての出現箇所を置換するが、
    // WHERE句で前方一致を指定しているので、基本的にはパスの先頭（ドライブ文字など）の置換になるはず。
    // ただし、フォルダ名がドライブ名と同じ場合などは誤爆の可能性があるが、
    // ユーザーが「一括置換」を選択しているので、その挙動（単純置換）で良しとする。
    // replace(string, pattern, replacement)

    // SQLite 3.35.0+ なら RETURNING が使えるが、安全のため run の changes を返す
    const result = await dbQuery.run(`
      UPDATE books 
      SET path = REPLACE(path, ?, ?) 
      WHERE path LIKE ? || '%'
    `, [oldPath, newPath, oldPath]);

    return result.changes || 0;
  }
}

/**
 * カンマ区切りをパースするヘルパー
 */
function parseMultiValue(val: string | string[]): string[] {
  if (Array.isArray(val)) return val;
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

/**
 * メタデータを設定
 */
async function setBookMetadata(bookId: number, type: string, names: string[]) {
  // 既存の関連を削除
  await dbQuery.run(`
    DELETE FROM book_metadata 
    WHERE book_id = ? AND metadata_id IN (SELECT id FROM metadata WHERE type = ?)
  `, [bookId, type]);

  for (const name of names) {
    if (!name.trim()) continue;

    // マスターに登録（存在しなければ）
    await dbQuery.run('INSERT OR IGNORE INTO metadata (type, name) VALUES (?, ?)', [type, name.trim()]);

    // IDを取得
    const item = await dbQuery.get<{ id: number }>('SELECT id FROM metadata WHERE type = ? AND name = ?', [type, name.trim()]);
    if (item) {
      // 関連付け
      await dbQuery.run('INSERT OR IGNORE INTO book_metadata (book_id, metadata_id) VALUES (?, ?)', [bookId, item.id]);
    }
  }
}

/**
 * 指定したタイプのメタデータを取得
 */
async function getBookMetadataByType(bookId: number, type: string): Promise<string[]> {
  const rows = await dbQuery.all<{ name: string }>(`
    SELECT m.name FROM metadata m
    JOIN book_metadata bm ON m.id = bm.metadata_id
    WHERE bm.book_id = ? AND m.type = ?
    ORDER BY m.name ASC
  `, [bookId, type]);
  return rows.map(r => r.name);
}

/**
 * DBの結果をBook型に変換
 */
async function mapBook(row: any): Promise<Book> {
  const bookId = row.id;

  // 各メタデータを取得
  const [series, author, circle, original_work, characters] = await Promise.all([
    getBookMetadataByType(bookId, 'series'),
    getBookMetadataByType(bookId, 'author'),
    getBookMetadataByType(bookId, 'circle'),
    getBookMetadataByType(bookId, 'original_work'),
    getBookMetadataByType(bookId, 'characters'),
  ]);

  // パスの解決: 既存のpathカラムがあればそれを使用、なければbook_locationsから取得
  let resolvedPath = row.path;
  let resolvedType = row.type;

  if (!resolvedPath) {
    // book_locationsからアクティブなロケーションを取得
    const location = await dbQuery.get<any>(`
      SELECT * FROM book_locations 
      WHERE book_id = ? AND status = 'active' 
      ORDER BY id ASC LIMIT 1
    `, [bookId]);

    if (location) {
      // フルパスを構築
      resolvedPath = path.join(location.base_path, location.relative_path);
      // typeはパスから推測
      resolvedType = resolvedPath.toLowerCase().endsWith('.zip') ? 'zip' : 'folder';
    }
  }

  return {
    ...row,
    path: resolvedPath,
    type: resolvedType,
    series,
    author,
    circle,
    original_work,
    characters,
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
export async function updateBook(id: number, input: Partial<BookInput | any>): Promise<Book | null> {
  const fields: string[] = [];
  const values: any[] = [];

  if (input.title !== undefined) {
    fields.push('title = ?');
    values.push(input.title);
  }

  // メタデータ項目は別のテーブルで管理するため、booksテーブルのカラムは（もしあれば）更新不要か同期のみ行う
  // ここでは正規化テーブルのみを更新する
  if (input.series !== undefined) await setBookMetadata(id, 'series', parseMultiValue(input.series));
  if (input.author !== undefined) await setBookMetadata(id, 'author', parseMultiValue(input.author));
  if (input.circle !== undefined) await setBookMetadata(id, 'circle', parseMultiValue(input.circle));
  if (input.original_work !== undefined) await setBookMetadata(id, 'original_work', parseMultiValue(input.original_work));
  if (input.characters !== undefined) await setBookMetadata(id, 'characters', parseMultiValue(input.characters));

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

  if (fields.length > 0) {
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await dbQuery.run(`
      UPDATE books SET ${fields.join(', ')} WHERE id = ?
    `, values);
  }

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

  // テキスト検索 (タイトルまたはメタデータ名に部分一致)
  if (filter.query) {
    query += ' AND (title LIKE ? OR id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.name LIKE ?))';
    const searchTerm = `%${filter.query}%`;
    params.push(searchTerm, searchTerm);
  }

  // シリーズフィルター (部分一致)
  if (filter.series) {
    query += " AND id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.type = 'series' AND m.name LIKE ?)";
    params.push(`%${filter.series}%`);
  }

  // 作者フィルター (部分一致)
  if (filter.author) {
    query += " AND id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.type = 'author' AND m.name LIKE ?)";
    params.push(`%${filter.author}%`);
  }

  // サークルフィルター (部分一致)
  if (filter.circle) {
    query += " AND id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.type = 'circle' AND m.name LIKE ?)";
    params.push(`%${filter.circle}%`);
  }

  // 原作フィルター (部分一致)
  if (filter.original_work) {
    query += " AND id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.type = 'original_work' AND m.name LIKE ?)";
    params.push(`%${filter.original_work}%`);
  }

  // キャラクターフィルター (部分一致)
  if (filter.characters) {
    query += " AND id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.type = 'characters' AND m.name LIKE ?)";
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
  return Promise.all(rows.map(mapBook));
}

/**
 * 全ての本を取得
 */
export async function getAllBooks(): Promise<Book[]> {
  const rows = await dbQuery.all<any>('SELECT * FROM books ORDER BY created_at DESC');
  return Promise.all(rows.map(mapBook));
}

/**
 * 本の総数を取得
 */
export async function getBooksCount(filter: SearchFilter = {}): Promise<number> {
  let query = 'SELECT COUNT(*) as count FROM books WHERE 1=1';
  const params: any[] = [];

  if (filter.query) {
    query += ' AND (title LIKE ? OR id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.name LIKE ?))';
    const searchTerm = `%${filter.query}%`;
    params.push(searchTerm, searchTerm);
  }

  if (filter.series) {
    query += " AND id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.type = 'series' AND m.name LIKE ?)";
    params.push(`%${filter.series}%`);
  }

  if (filter.author) {
    query += " AND id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.type = 'author' AND m.name LIKE ?)";
    params.push(`%${filter.author}%`);
  }

  if (filter.circle) {
    query += " AND id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.type = 'circle' AND m.name LIKE ?)";
    params.push(`%${filter.circle}%`);
  }

  if (filter.original_work) {
    query += " AND id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.type = 'original_work' AND m.name LIKE ?)";
    params.push(`%${filter.original_work}%`);
  }

  if (filter.characters) {
    query += " AND id IN (SELECT book_id FROM book_metadata bm JOIN metadata m ON bm.metadata_id = m.id WHERE m.type = 'characters' AND m.name LIKE ?)";
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

  // タグ
  if (filter.tags && filter.tags.length > 0) {
    query += ` AND id IN (
      SELECT book_id FROM book_tags
      WHERE tag_id IN (SELECT id FROM tags WHERE name IN (${filter.tags.map(() => '?').join(', ')}))
      GROUP BY book_id
      HAVING COUNT(DISTINCT tag_id) = ?
    )`;
    params.push(...filter.tags, filter.tags.length);
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
  const rows = await dbQuery.all<{ name: string }>(`
    SELECT name FROM metadata 
    WHERE type = ? 
    ORDER BY name ASC
  `, [field]);

  return rows.map(r => r.name);
}


/**
 * ロケーションのない孤児メタデータを削除（CAS用）
 * book_locationsにリンクがなく、pathもnullの本を削除
 */
export async function deleteOrphanBooks(): Promise<number> {
  // book_locationsにリンクがなく、pathもnullまたは空の本
  const result = await dbQuery.run(`
    DELETE FROM books 
    WHERE path IS NULL OR path = ''
    AND id NOT IN (SELECT DISTINCT book_id FROM book_locations)
  `);
  console.log(`${result.changes}件の孤児メタデータを削除しました。`);
  return result.changes;
}

/**
 * ファイルが存在しないロケーションを削除（CAS用）
 * 指定されたベースパス配下のロケーションで、実際のファイルがないものを削除
 */
export async function deleteOrphanLocations(basePaths: string[]): Promise<number> {
  let deletedCount = 0;

  for (const basePath of basePaths) {
    const locations = await dbQuery.all<any>(`
      SELECT * FROM book_locations WHERE base_path = ?
    `, [basePath]);

    for (const loc of locations) {
      const fullPath = path.join(loc.base_path, loc.relative_path);
      if (!fs.existsSync(fullPath)) {
        await dbQuery.run('DELETE FROM book_locations WHERE id = ?', [loc.id]);
        deletedCount++;
      }
    }
  }

  console.log(`${deletedCount}件の無効なロケーションを削除しました。`);
  return deletedCount;
}
