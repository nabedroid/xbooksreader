/**
 * サムネイルグリッドコンポーネント
 */
import type { Book } from '@/types';
import styles from './ThumbnailGrid.module.css';

interface ThumbnailGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  selectedBookId?: number;
  gridSize?: 'small' | 'medium' | 'large';
}

export default function ThumbnailGrid({ books, onBookClick, selectedBookId, gridSize = 'large' }: ThumbnailGridProps) {
  const getThumbnailSrc = (book: Book) => {
    if (book.thumbnail) {
      return `data:image/jpeg;base64,${book.thumbnail}`;
    }
    return '/placeholder-book.png';
  };

  const renderStars = (rating: number) => {
    const r = Math.min(10, Math.max(0, rating));
    return '★'.repeat(r) + '☆'.repeat(Math.max(0, 10 - r));
  };

  return (
    <div className={`${styles.grid} ${styles[gridSize] || ''}`}>
      {books.length === 0 ? (
        <div className={styles.empty}>
          <p>本が見つかりませんでした</p>
        </div>
      ) : (
        books.map((book) => (
          <div
            key={book.id}
            className={`${styles.card} ${selectedBookId === book.id ? styles.selected : ''}`}
            onClick={() => onBookClick(book)}
          >
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
          </div>
        ))
      )}
    </div>
  );
}
