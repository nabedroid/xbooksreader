import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '@/renderer/store/useBookStore';
import { useTabStore } from '@/renderer/store/useTabStore';
import { useSettingsStore } from '@/renderer/store/useSettingsStore';
import SearchPanel from '@/renderer/components/panels/SearchPanel';
import ThumbnailGrid from '@/renderer/components/panels/ThumbnailGrid';
import type { SearchFilter } from '@/types';
import styles from './BookshelfScreen.module.css';

export default function BookshelfScreen() {
  const { books, isLoading, loadBooks, searchBooks, searchFilter, scrollPosition, setScrollPosition } = useBookStore();
  const { gridSize, setGridSize } = useSettingsStore();
  const { openTab } = useTabStore();
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);

  const sortBy = searchFilter.sortBy || 'created_at';
  const sortOrder = searchFilter.sortOrder || 'desc';

  useEffect(() => {
    // データがない場合のみ初期読み込みを行う
    if (books.length === 0) {
      loadBooks();
    }
  }, [loadBooks]);

  // スクロール位置の復元
  useEffect(() => {
    if (!isLoading && mainRef.current && scrollPosition > 0) {
      // DOMのレンダリングを待つために少し遅延させる（必要に応じて）
      requestAnimationFrame(() => {
        if (mainRef.current) {
          mainRef.current.scrollTop = scrollPosition;
        }
      });
    }
  }, [isLoading]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setScrollPosition(e.currentTarget.scrollTop);
  };

  const handleBookClick = (book: any) => {
    // 閲覧回数を加算
    window.electronAPI.books.incrementReadCount(book.id);
    openTab(book);
    navigate(`/book/${book.id}`);
  };

  const handleSearch = (filter: SearchFilter) => {
    searchBooks({ ...filter, sortBy, sortOrder });
  };

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      // 同じ項目なら順序を反転
      const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      searchBooks({ ...searchFilter, sortBy: newSortBy, sortOrder: nextOrder });
    } else {
      searchBooks({ ...searchFilter, sortBy: newSortBy, sortOrder: 'desc' });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>本棚</h1>
        <div className={styles.headerRight}>
          <div className={styles.sizeControls}>
            <button
              className={gridSize === 'small' ? styles.active : ''}
              onClick={() => setGridSize('small')}
              title="小"
            >小</button>
            <button
              className={gridSize === 'medium' ? styles.active : ''}
              onClick={() => setGridSize('medium')}
              title="中"
            >中</button>
            <button
              className={gridSize === 'large' ? styles.active : ''}
              onClick={() => setGridSize('large')}
              title="大"
            >大</button>
          </div>
          <div className={styles.sortControls}>
            <label>並び替え:</label>
            <select value={sortBy} onChange={(e) => handleSort(e.target.value as any)}>
              <option value="created_at">追加日時</option>
              <option value="updated_at">更新日時</option>
              <option value="last_read_at">最終閲覧</option>
              <option value="read_count">閲覧回数</option>
              <option value="title">タイトル</option>
              <option value="rating">評価</option>
            </select>
            <button onClick={() => {
              const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
              searchBooks({ ...searchFilter, sortBy, sortOrder: nextOrder });
            }}>
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          <div className={styles.stats}>
            {books.length}冊
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <SearchPanel
            onSearch={handleSearch}
            onClear={() => {
              useBookStore.getState().setSearchFilter({
                sortBy: 'created_at',
                sortOrder: 'desc',
              });
              loadBooks();
            }}
          />
        </aside>

        <main
          className={styles.main}
          ref={mainRef}
          onScroll={handleScroll}
        >
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>読み込み中...</p>
            </div>
          ) : (
            <ThumbnailGrid
              books={books}
              onBookClick={handleBookClick}
              gridSize={gridSize}
            />
          )}
        </main>
      </div>
    </div>
  );
}
