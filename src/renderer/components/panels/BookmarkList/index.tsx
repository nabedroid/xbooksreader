/**
 * しおりリストコンポーネント
 */
import { useState, useEffect } from 'react';
import type { Bookmark } from '@/types';
import styles from './BookmarkList.module.css';

interface BookmarkListProps {
  bookId: number;
  currentPage: number;
  onBookmarkClick: (page: number) => void;
}

export default function BookmarkList({ bookId, currentPage, onBookmarkClick }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    loadBookmarks();
  }, [bookId]);

  const loadBookmarks = async () => {
    try {
      const data = await window.electronAPI.bookmarks.getBookBookmarks(bookId);
      setBookmarks(data);
    } catch (error) {
      console.error('しおり読み込みエラー:', error);
    }
  };

  const handleAddBookmark = async () => {
    try {
      await window.electronAPI.bookmarks.create({
        book_id: bookId,
        page_number: currentPage,
        note: newNote || undefined,
      });
      setNewNote('');
      loadBookmarks();
    } catch (error) {
      console.error('しおり追加エラー:', error);
    }
  };

  const handleDeleteBookmark = async (id: number) => {
    try {
      await window.electronAPI.bookmarks.delete(id);
      loadBookmarks();
    } catch (error) {
      console.error('しおり削除エラー:', error);
    }
  };

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>しおり</h3>

      <div className={styles.addForm}>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="メモ（任意）"
        />
        <button onClick={handleAddBookmark}>しおりをはさむ</button>
      </div>

      <div className={styles.list}>
        {bookmarks.length === 0 ? (
          <p className={styles.empty}>しおりがありません</p>
        ) : (
          bookmarks.map((bookmark) => (
            <div key={bookmark.id} className={styles.item}>
              <div
                className={styles.info}
                onClick={() => onBookmarkClick(bookmark.page_number)}
              >
                <span className={styles.page}>ページ {bookmark.page_number + 1}</span>
                {bookmark.note && (
                  <span className={styles.note}>{bookmark.note}</span>
                )}
              </div>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteBookmark(bookmark.id)}
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
