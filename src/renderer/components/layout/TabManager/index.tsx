/**
 * タブマネージャーコンポーネント
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useTabStore } from '@/renderer/store/useTabStore';
import styles from './TabManager.module.css';

export default function TabManager() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useTabStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomeActive = location.pathname === '/';

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
              const idToClose = tab.id;
              closeTab(idToClose);

              // 遷移処理: 閉じた後にアクティブなタブがなければ本棚へ
              const nextActiveTabId = useTabStore.getState().activeTabId;
              const nextTabs = useTabStore.getState().tabs;
              if (nextActiveTabId) {
                const nextTab = nextTabs.find(t => t.id === nextActiveTabId);
                if (nextTab) {
                  navigate(`/book/${nextTab.book.id}`);
                }
              } else {
                navigate('/');
              }
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
