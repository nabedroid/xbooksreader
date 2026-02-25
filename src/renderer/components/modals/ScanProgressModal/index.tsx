import { useScannerStore } from '@/renderer/store/useScannerStore';
import styles from './ScanProgressModal.module.css';

export default function ScanProgressModal() {
  const { isScanning, scanProgress, cancelScan } = useScannerStore();

  if (!isScanning) return null;

  const percentage = scanProgress.total > 0 ? Math.round((scanProgress.current / scanProgress.total) * 100) : 0;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>
          スキャン実行中...
        </h2>
        <div className={styles.content}>
          <div className={styles.progressText}>
            <span>{scanProgress.current} / {scanProgress.total}</span>
            <span>{percentage}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className={styles.pathText}>
            {scanProgress.status === 'processing' ? '処理中...' : scanProgress.currentPath || '準備中...'}
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={cancelScan}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
