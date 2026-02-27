/**
 * タブマネージャーコンポーネント
 */
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTabStore } from '@/renderer/store/useTabStore';
import styles from './TabManager.module.css';

export default function TabManager() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeActive = location.pathname === '/';

  // タブを閉じる共通処理: 遷移先に移動してからタブを閉じる
  const handleCloseTab = (idToClose: string) => {
    const currentTabs = useTabStore.getState().tabs;
    const remainingTabs = currentTabs.filter(t => t.id !== idToClose);

    // 先に遷移先を決定して遷移する
    if (remainingTabs.length > 0) {
      const nextTab = remainingTabs[remainingTabs.length - 1];
      setActiveTab(nextTab.id);
      navigate(`/book/${nextTab.book.id}`);
    } else {
      navigate('/');
    }

    // 遷移後にタブを閉じる
    closeTab(idToClose);
  };

  // Ctrl+W によるタブ閉じショートカットのグローバルハンドリング
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+W (または Cmd+W) を検知
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();

        // ホーム画面の場合は何もしない
        if (isHomeActive) return;

        // アクティブなタブがあれば閉じる
        if (activeTabId) {
          handleCloseTab(activeTabId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, isHomeActive, closeTab, navigate]);

  return (
    <div className={styles.tabBar}>
      <div
        className={`${styles.tab} ${styles.homeTab} ${isHomeActive ? styles.active : ''}`}
        onClick={() => {
          // 本棚タブクリック時はアクティブな本をクリアせず、単に遷移する
          navigate('/');
        }}
      >
        <span className={styles.tabTitle}>🏠 本棚</span>
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`${styles.tab} ${activeTabId === tab.id && !isHomeActive ? styles.active : ''}`}
          onClick={() => {
            setActiveTab(tab.id);
            navigate(`/book/${tab.book.id}`);
          }}
        >
          <span className={styles.tabTitle}>
            {tab.book.title || '無題'}
          </span>
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              handleCloseTab(tab.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
