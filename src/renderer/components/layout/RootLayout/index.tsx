/**
 * 共通レイアウトコンポーネント
 */
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TabManager from '../TabManager';
import styles from './RootLayout.module.css';

export default function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = window.electronAPI.utils.onMenuNavigate((path) => {
      navigate(path);
    });
    return () => unsub();
  }, [navigate]);

  return (
    <div className={styles.container}>
      <TabManager />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
