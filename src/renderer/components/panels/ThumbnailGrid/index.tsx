/**
 * サムネイルグリッドコンポーネント
 */
import { useState, useEffect, useRef, memo } from 'react';
import type { Book } from '@/types';
import { useBookStore } from '@/renderer/store/useBookStore';
import styles from './ThumbnailGrid.module.css';

interface ThumbnailGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  selectedBookId?: number;
  gridSize?: 'small' | 'medium' | 'large';
}

interface ThumbnailItemProps {
  book: Book;
  isSelected: boolean;
  onClick: () => void;
}

const ThumbnailItem = memo(({ book, isSelected, onClick }: ThumbnailItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '300px' }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const getThumbnailSrc = (b: Book) => {
    if (b.thumbnail) {
      return `data:image/jpeg;base64,${b.thumbnail}`;
    }
    return '/placeholder-book.png';
  };

  const renderStars = (rating: number) => {
    const r = Math.min(10, Math.max(0, rating));
    return '★'.repeat(r) + '☆'.repeat(Math.max(0, 10 - r));
  };

  return (
    <div
      ref={ref}
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      {isVisible ? (
        <>
          <div className={styles.thumbnail}>
            <img
              src={getThumbnailSrc(book)}
              alt={book.title || '無題'}
              loading="lazy"
            />
            {book.favorite && (
              <div className={styles.favorite}>❤️</div>
            )}
            {book.rating > 0 && (
              <div className={styles.rating}>{renderStars(book.rating)}</div>
            )}
          </div>
          <div className={styles.info}>
            <h4 className={styles.title}>{book.title || '無題'}</h4>
            {book.original_work && book.original_work.length > 0 && (
              <p className={styles.originalWork}>{book.original_work.join(', ')}</p>
            )}
            {book.author && book.author.length > 0 && (
              <p className={styles.author}>{book.author.join(', ')}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles.thumbnail} />
          <div className={styles.info} style={{ minHeight: '80px' }} />
        </>
      )}
    </div>
  );
});

ThumbnailItem.displayName = 'ThumbnailItem';

export default function ThumbnailGrid({ books, onBookClick, selectedBookId, gridSize = 'large' }: ThumbnailGridProps) {
  const { displayLimit, setDisplayLimit } = useBookStore();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayLimit(displayLimit + 100);
        }
      },
      { rootMargin: '200px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [displayLimit, setDisplayLimit]);

  const displayedBooks = books.slice(0, displayLimit);

  return (
    <>
      <div className={`${styles.grid} ${styles[gridSize] || ''}`}>
        {books.length === 0 ? (
          <div className={styles.empty}>
            <p>本が見つかりませんでした</p>
          </div>
        ) : (
          displayedBooks.map((book) => (
            <ThumbnailItem
              key={book.id}
              book={book}
              isSelected={selectedBookId === book.id}
              onClick={() => onBookClick(book)}
            />
          ))
        )}
      </div>
      {displayLimit < books.length && (
        <div ref={observerTarget} style={{ height: '20px', width: '100%' }} />
      )}
    </>
  );
}
