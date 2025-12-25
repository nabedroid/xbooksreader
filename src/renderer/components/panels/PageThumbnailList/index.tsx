/**
 * ページサムネイル一覧コンポーネント
 */
import { useState, useEffect, useRef } from 'react';
import styles from './PageThumbnailList.module.css';

interface PageThumbnailListProps {
  bookId: number;
  totalPages: number;
  currentPage: number;
  onPageClick: (page: number) => void;
}

export default function PageThumbnailList({
  bookId,
  totalPages,
  currentPage,
  onPageClick,
}: PageThumbnailListProps) {
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({});
  const isMounted = useRef(true);
  const loadingPages = useRef(new Set<number>());

  useEffect(() => {
    isMounted.current = true;
    loadThumbnails();
    return () => {
      isMounted.current = false;
    };
  }, [bookId, totalPages]);

  const loadThumbnails = async () => {
    // ページ数が多い場合は一度にロードするのではなく、順次ロード
    // ただし、レンダリングされている範囲を優先したいが、まずは単純に
    for (let i = 0; i < totalPages; i++) {
      if (!isMounted.current) break;
      if (thumbnails[i]) continue;
      if (loadingPages.current.has(i)) continue;

      loadingPages.current.add(i);
      try {
        const base64 = await window.electronAPI.images.getThumbnail(bookId, i);
        if (isMounted.current) {
          setThumbnails(prev => ({ ...prev, [i]: `data:image/jpeg;base64,${base64}` }));
        }
      } catch (error) {
        console.error(`サムネイル生成エラー (ページ ${i}):`, error);
      } finally {
        loadingPages.current.delete(i);
      }

      // メインスレッドをブロックしないように少し待機
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>ページ一覧</h3>
      <div className={styles.list}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`${styles.item} ${currentPage === index ? styles.active : ''}`}
            onClick={() => onPageClick(index)}
          >
            <div className={styles.thumbnailWrapper}>
              {thumbnails[index] ? (
                <img src={thumbnails[index]} alt={`Page ${index + 1}`} loading="lazy" />
              ) : (
                <div className={styles.placeholder}></div>
              )}
            </div>
            <span className={styles.pageNumber}>{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
