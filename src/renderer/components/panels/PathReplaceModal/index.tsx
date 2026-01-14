/**
 * パス一括置換モーダル
 */
import { useState } from 'react';
import styles from './PathReplaceModal.module.css';

interface PathReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PathReplaceModal({ isOpen, onClose }: PathReplaceModalProps) {
  const [oldPath, setOldPath] = useState('');
  const [newPath, setNewPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!oldPath || !newPath) return;

    setIsLoading(true);
    try {
      // まず件数を取得 (Dry Run)
      const count = await window.electronAPI.books.updatePath(oldPath, newPath, true);

      if (count === 0) {
        await window.electronAPI.utils.showAlert('対象となる本が見つかりませんでした。');
        setIsLoading(false);
        return;
      }

      // ユーザー確認
      const confirmed = await window.electronAPI.utils.showConfirm(
        `${count} 件の本のパスが対象です。\n\n置換前: ${oldPath}\n置換後: ${newPath}\n\n実行してよろしいですか？\nこの操作は取り消せません。`
      );

      if (confirmed) {
        // 実行
        const updatedCount = await window.electronAPI.books.updatePath(oldPath, newPath, false);
        await window.electronAPI.utils.showAlert(`${updatedCount} 件の本のパスを更新しました。`);
        onClose();
        // 必要ならリロードなどを促す
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Path update failed:', error);
      await window.electronAPI.utils.showAlert(`エラーが発生しました: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>パス一括置換</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.description}>
            データベースに登録されている本のパスを一括で書き換えます。
            ドライブ文字の変更やフォルダの移動を行った場合に便利です。
          </div>

          <div className={styles.formGroup}>
            <label>変更前のパス（検索対象）</label>
            <input
              type="text"
              value={oldPath}
              onChange={(e) => setOldPath(e.target.value)}
              placeholder="例: D:\Books"
            />
          </div>

          <div className={styles.formGroup}>
            <label>変更後のパス（置換文字）</label>
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="例: E:\MyBooks"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
            disabled={isLoading}
          >
            キャンセル
          </button>
          <button
            className={`${styles.button} ${styles.submitButton}`}
            onClick={handleSubmit}
            disabled={isLoading || !oldPath || !newPath}
          >
            {isLoading ? '処理中...' : '確認'}
          </button>
        </div>
      </div>
    </div>
  );
}
