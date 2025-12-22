/**
 * バックアップ/エクスポートサービス
 */
import fs from 'fs';
import { getDatabase, dbQuery, initDatabase } from '../database/db';
import { getAllBooks, getBookByPath, updateBook, createBook } from '../database/models/Book';
import { getBookTags, setBookTags } from '../database/models/Tag';
import { getBookBookmarks, createBookmark } from '../database/models/Bookmark';

/**
 * メタデータをJSON形式でエクスポート
 */
export async function exportMetadata(exportPath: string): Promise<void> {
  const books = await getAllBooks();

  const booksWithMetadata = await Promise.all(books.map(async (book) => {
    const tags = await getBookTags(book.id);
    const bookmarks = await getBookBookmarks(book.id);

    return {
      path: book.path,
      type: book.type,
      title: book.title,
      series: book.series,
      author: book.author,
      circle: book.circle,
      rating: book.rating,
      favorite: book.favorite,
      tags: tags.map(tag => tag.name),
      bookmarks: bookmarks.map(bookmark => ({
        page: bookmark.page_number,
        note: bookmark.note,
      })),
      last_read_page: book.last_read_page,
      last_read_at: book.last_read_at,
    };
  }));

  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    books: booksWithMetadata,
  };

  fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2), 'utf-8');
  console.log(`メタデータをエクスポート: ${exportPath}`);
}

/**
 * JSON形式からメタデータをインポート
 */
export async function importMetadata(importPath: string): Promise<number> {
  const data = JSON.parse(fs.readFileSync(importPath, 'utf-8'));

  if (data.version !== '1.0') {
    throw new Error('サポートされていないバージョンです');
  }

  let importedCount = 0;

  for (const bookData of data.books) {
    try {
      // 既存の本をチェック
      let book = await getBookByPath(bookData.path);

      if (book) {
        // 更新
        book = await updateBook(book.id, {
          title: bookData.title,
          series: bookData.series,
          author: bookData.author,
          circle: bookData.circle,
          rating: bookData.rating,
          favorite: bookData.favorite,
          last_read_page: bookData.last_read_page,
          last_read_at: bookData.last_read_at,
        });
      } else {
        // 新規作成（パスが存在する場合のみ）
        if (!fs.existsSync(bookData.path)) {
          console.warn(`パスが存在しません: ${bookData.path}`);
          continue;
        }

        book = await createBook({
          path: bookData.path,
          type: bookData.type,
          title: bookData.title,
          series: bookData.series,
          author: bookData.author,
          circle: bookData.circle,
          rating: bookData.rating,
          favorite: bookData.favorite,
        });
      }

      // タグを設定
      if (bookData.tags && bookData.tags.length > 0) {
        await setBookTags(book!.id, bookData.tags);
      }

      // しおりを作成
      if (bookData.bookmarks && bookData.bookmarks.length > 0) {
        for (const bookmark of bookData.bookmarks) {
          await createBookmark({
            book_id: book!.id,
            page_number: bookmark.page,
            note: bookmark.note,
          });
        }
      }

      importedCount++;
    } catch (error) {
      console.error(`インポートエラー: ${bookData.path}`, error);
    }
  }

  console.log(`${importedCount}冊の本をインポート`);
  return importedCount;
}

/**
 * データベース全体をバックアップ
 */
export async function createBackup(backupPath: string): Promise<void> {
  const db = getDatabase();

  // sqlite3では filename プロパティからパスを取得（メモリDBの場合は ':memory:'）
  const dbPath = (db as any).filename;

  // ファイルをコピー
  fs.copyFileSync(dbPath, backupPath);
  console.log(`データベースをバックアップ: ${backupPath}`);
}

/**
 * バックアップからデータベースを復元
 */
export async function restoreBackup(backupPath: string): Promise<void> {
  const db = getDatabase();
  const dbPath = (db as any).filename;

  // データベースを閉じる
  return new Promise((resolve, reject) => {
    db.close(async (err) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        // バックアップファイルで上書き
        fs.copyFileSync(backupPath, dbPath);
        console.log(`データベースを復元: ${backupPath}`);

        // データベースを再度開く
        await initDatabase();
        resolve();
      } catch (copyErr) {
        reject(copyErr);
      }
    });
  });
}
