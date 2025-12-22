/**
 * ミニ本棚コンポーネント（サイドバー用）
 */
import { useState, useEffect } from 'react';
import { useBookStore } from '@/renderer/store/useBookStore';
import { useTabStore } from '@/renderer/store/useTabStore';
import { useNavigate } from 'react-router-dom';
import type { Book } from '@/types';
import styles from './MiniBookshelf.module.css';

export default function MiniBookshelf() {
  const { books, searchBooks, loadBooks } = useBookStore();
  const { openTab } = useTabStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query.trim() === '') {
      loadBooks();
    } else {
      const timer = setTimeout(() => {
        searchBooks({ query });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const handleBookClick = (book: Book) => {
    openTab(book);
    navigate(`/book/${book.id}`);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>本棚</h3>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="本を検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className={styles.list}>
        {books.length === 0 ? (
          <p className={styles.empty}>見つかりませんでした</p>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className={styles.item}
              onClick={() => handleBookClick(book)}
            >
              <div className={styles.info}>
                <div className={styles.title}>{book.title || '無題'}</div>
                <div className={styles.author}>{book.author || '不明'}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
