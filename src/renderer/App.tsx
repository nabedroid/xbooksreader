/**
 * メインアプリケーションコンポーネント
 */
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useSettingsStore } from './store/useSettingsStore';

function App() {
  const { loadSettings } = useSettingsStore();

  useEffect(() => {
    // 設定を読み込む
    loadSettings();
  }, [loadSettings]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
