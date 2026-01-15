/**
 * Webメタデータ検索モーダル
 */
import { useState, useEffect } from 'react';
import type { ScrapedBook } from '@/types';
import styles from './WebSearchModal.module.css';

interface WebSearchModalProps {
  initialQuery: string;
  onClose: () => void;
  onApply: (data: ScrapedBook) => void;
}

export default function WebSearchModal({ initialQuery, onClose, onApply }: WebSearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ScrapedBook[]>([]);
  const [selected, setSelected] = useState<ScrapedBook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // マウント時に自動検索はしない（ユーザー確認のため）
    // 必要ならここで handleSearch() を呼ぶ
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);
    setSelected(null);
    setHasSearched(true);

    try {
      const data = await window.electronAPI.metadata.search(query);
      setResults(data);
      if (data.length > 0) {
        setSelected(data[0]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      await window.electronAPI.utils.showAlert('検索中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Webから情報を取得</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.searchForm}>
            <input
              type="text"
              className={styles.searchInput}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="タイトルで検索..."
              autoFocus
            />
            <button
              className={styles.searchButton}
              onClick={handleSearch}
              disabled={isLoading}
            >
              検索
            </button>
          </div>

          <div className={styles.resultArea}>
            {isLoading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>検索中...</p>
              </div>
            ) : (
              <>
                <div className={styles.list}>
                  {results.length === 0 && hasSearched ? (
                    <p style={{ color: '#888', textAlign: 'center' }}>
                      該当する作品が見つかりませんでした
                    </p>
                  ) : (
                    results.map((item, index) => (
                      <div
                        key={index}
                        className={`${styles.listItem} ${selected === item ? styles.selected : ''}`}
                        onClick={() => setSelected(item)}
                      >
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt="" className={styles.itemThumb} />
                        )}
                        <div className={styles.itemInfo}>
                          <div className={styles.itemTitle}>{item.title}</div>
                          <div className={styles.itemMeta}>
                            <span className={`${styles.itemSite} ${item.siteName === 'DLsite' ? styles.siteDLsite : styles.siteFANZA}`}>
                              {item.siteName}
                            </span>
                            {item.circle || item.author || '---'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {selected && (
                  <div className={styles.preview}>
                    {selected.imageUrl && (
                      <img src={selected.imageUrl} alt="" className={styles.previewImage} />
                    )}
                    <div className={styles.previewTitle}>{selected.title}</div>

                    <div className={styles.previewMeta}>
                      <label>サークル</label>
                      <span>{selected.circle || '-'}</span>

                      <label>作者</label>
                      <span>{selected.author || '-'}</span>

                      <label>タグ</label>
                      <div className={styles.tags}>
                        {selected.tags.map(tag => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>

                    {selected.description && (
                      <div className={styles.previewDesc}>{selected.description}</div>
                    )}

                    <button
                      className={styles.applyButton}
                      onClick={() => onApply(selected)}
                    >
                      この情報を反映する
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
