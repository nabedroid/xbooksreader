/**
 * 詳細表示画面（ビューワー画面）
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBookStore } from '@/renderer/store/useBookStore';
import { useTabStore } from '@/renderer/store/useTabStore';
import { useKeyboardShortcuts } from '@/renderer/hooks/useKeyboardShortcuts';
import ImageViewer from '@/renderer/components/panels/ImageViewer';
import MetadataEditor from '@/renderer/components/panels/MetadataEditor';
import BookmarkList from '@/renderer/components/panels/BookmarkList';
import PageThumbnailList from '@/renderer/components/panels/PageThumbnailList';
import styles from './DetailScreen.module.css';

export default function DetailScreen() {
  useParams<{ bookId: string }>();
  const { updateBook } = useBookStore();
  const { tabs, activeTabId, updateTabPage } = useTabStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [sidebarTab, setSidebarTab] = useState<'pages' | 'bookmarks'>('pages');

  const activeTab = tabs.find(t => t.id === activeTabId);
  const book = activeTab?.book;

  useEffect(() => {
    if (book) {
      loadPages();
      setCurrentPage(book.last_read_page || 0);
    }
  }, [book?.id]);

  const loadPages = async () => {
    if (!book) return;
    try {
      const pages = await window.electronAPI.images.getPages(book.id);
      setTotalPages(pages.length);
    } catch (error) {
      console.error('ページ数取得エラー:', error);
      alert('本の情報を読み込めませんでした。ファイルが移動または削除されている可能性があります。');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (book && activeTabId) {
      updateTabPage(activeTabId, page);
      updateBook(book.id, { last_read_page: page } as any);
    }
  };

  const handleMetadataUpdate = (bookId: number, updates: any) => {
    if (book && book.id === bookId) {
      updateBook(bookId, updates);
    }
  };

  const handleTagsUpdate = async (bookId: number, tags: string[]) => {
    try {
      await window.electronAPI.tags.setBookTags(bookId, tags);
    } catch (error) {
      console.error('タグ更新エラー:', error);
    }
  };

  // キーボードショートカット
  useKeyboardShortcuts({
    onPrevPage: () => handlePageChange(Math.max(0, currentPage - 1)),
    onNextPage: () => handlePageChange(Math.min(totalPages - 1, currentPage + 1)),
    onPrevPage10: () => handlePageChange(Math.max(0, currentPage - 10)),
    onNextPage10: () => handlePageChange(Math.min(totalPages - 1, currentPage + 10)),
    onPrevPage100: () => handlePageChange(Math.max(0, currentPage - 100)),
    onNextPage100: () => handlePageChange(Math.min(totalPages - 1, currentPage + 100)),
    onZoomIn: () => setZoom(Math.min(200, zoom + 10)),
    onZoomOut: () => setZoom(Math.max(50, zoom - 10)),
    onZoomReset: () => setZoom(100),
    // キーボードからのしおり追加は、現在のページをそのまま保存するIPCを直接呼ぶ
    onAddBookmark: async () => {
      if (book) {
        await window.electronAPI.bookmarks.create({
          book_id: book.id,
          page_number: currentPage,
        });
      }
    },
  });

  if (!book) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>本が選択されていません</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarTabs}>
          <button
            className={`${styles.sidebarTab} ${sidebarTab === 'pages' ? styles.active : ''}`}
            onClick={() => setSidebarTab('pages')}
            title="ページ"
          >
            📄
          </button>
          <button
            className={`${styles.sidebarTab} ${sidebarTab === 'bookmarks' ? styles.active : ''}`}
            onClick={() => setSidebarTab('bookmarks')}
            title="しおり"
          >
            🔖
          </button>
        </div>

        <div className={styles.sidebarContent}>
          {sidebarTab === 'pages' && (
            <PageThumbnailList
              bookId={book.id}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageClick={handlePageChange}
            />
          )}
          {sidebarTab === 'bookmarks' && (
            <BookmarkList
              bookId={book.id}
              currentPage={currentPage}
              onBookmarkClick={handlePageChange}
            />
          )}
        </div>
      </div>

      <div className={styles.main}>
        <ImageViewer
          bookId={book.id}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <div className={styles.rightPanel}>
        <MetadataEditor
          book={book}
          onUpdate={handleMetadataUpdate}
          onTagsUpdate={handleTagsUpdate}
        />
      </div>
    </div>
  );
}
