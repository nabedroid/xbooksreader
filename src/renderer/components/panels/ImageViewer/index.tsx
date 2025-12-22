/**
 * 画像ビューワーコンポーネント
 */
import { useState, useEffect } from 'react';
import styles from './ImageViewer.module.css';

interface ImageViewerProps {
  bookId: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  displayMode?: 'single' | 'spread' | 'scroll';
}

export default function ImageViewer({
  bookId,
  currentPage,
  totalPages,
  onPageChange,
}: ImageViewerProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isFitToScreen, setIsFitToScreen] = useState(true);

  useEffect(() => {
    loadImage();
  }, [bookId, currentPage]);

  const loadImage = async () => {
    setIsLoading(true);
    try {
      const base64 = await window.electronAPI.images.load(bookId, currentPage);
      setImageSrc(`data:image/jpeg;base64,${base64}`);
    } catch (error) {
      console.error('画像読み込みエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200));
    setIsFitToScreen(false);
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50));
    setIsFitToScreen(false);
  };

  const handleZoomReset = () => {
    setZoom(100);
    setIsFitToScreen(false);
  };

  const toggleFit = () => {
    setIsFitToScreen(!isFitToScreen);
    if (!isFitToScreen) {
      setZoom(100);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>読み込み中...</p>
          </div>
        ) : (
          <div
            className={`${styles.imageWrapper} ${isFitToScreen ? styles.fit : ''}`}
            style={isFitToScreen ? {} : { transform: `scale(${zoom / 100})` }}
          >
            <img src={imageSrc} alt={`Page ${currentPage + 1}`} />
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.navigation}>
          <button onClick={handlePrevPage} disabled={currentPage === 0}>
            ◀
          </button>
          <span className={styles.pageInfo}>
            {currentPage + 1} / {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
            ▶
          </button>
        </div>

        <div className={styles.zoom}>
          <button
            className={`${styles.fitButton} ${isFitToScreen ? styles.active : ''}`}
            onClick={toggleFit}
            title="画面に合わせる"
          >
            ⛶
          </button>
          <button onClick={handleZoomOut}>-</button>
          <span>{zoom}%</span>
          <button onClick={handleZoomIn}>+</button>
          <button onClick={handleZoomReset}>1:1</button>
        </div>
      </div>
    </div>
  );
}
