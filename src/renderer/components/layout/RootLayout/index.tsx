/**
 * 共通レイアウトコンポーネント
 */
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TabManager from '../TabManager';
import PathReplaceModal from '../../panels/PathReplaceModal';
import ImageConvertModal from '../../panels/ImageConvertModal';
import styles from './RootLayout.module.css';

export default function RootLayout() {
  const navigate = useNavigate();
  const [isPathReplaceModalOpen, setIsPathReplaceModalOpen] = useState(false);
  const [isImageConvertModalOpen, setIsImageConvertModalOpen] = useState(false);

  useEffect(() => {
    const unsubNavigate = window.electronAPI.utils.onMenuNavigate((path) => {
      navigate(path);
    });

    const unsubPathReplace = window.electronAPI.utils.onMenuPathReplace(() => {
      setIsPathReplaceModalOpen(true);
    });

    const unsubImageConvert = window.electronAPI.utils.onMenuImageConvert(() => {
      setIsImageConvertModalOpen(true);
    });

    return () => {
      unsubNavigate();
      unsubPathReplace();
      unsubImageConvert();
    };
  }, [navigate]);

  return (
    <div className={styles.container}>
      <TabManager />
      <main className={styles.content}>
        <Outlet />
      </main>
      <PathReplaceModal
        isOpen={isPathReplaceModalOpen}
        onClose={() => setIsPathReplaceModalOpen(false)}
      />
      <ImageConvertModal
        isOpen={isImageConvertModalOpen}
        onClose={() => setIsImageConvertModalOpen(false)}
      />
    </div>
  );
}
