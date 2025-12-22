/**
 * 設定画面
 */
import { useState } from 'react';
import { useSettingsStore } from '@/renderer/store/useSettingsStore';
import styles from './SettingsScreen.module.css';

export default function SettingsScreen() {
  const {
    scanPath,
    autoExtractMetadata,
    displayMode,
    theme,
    setScanPath,
    setAutoExtractMetadata,
    setDisplayMode,
    setTheme,
  } = useSettingsStore();

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });

  const handleSelectFolder = async () => {
    const path = await window.electronAPI.utils.selectDirectory();
    if (path) {
      setScanPath(path);
    }
  };

  const handleStartScan = async () => {
    if (!scanPath) {
      alert('スキャン対象フォルダを選択してください');
      return;
    }

    setIsScanning(true);

    // 進捗を監視
    window.electronAPI.scanner.onProgress((progress) => {
      setScanProgress(progress);
    });

    try {
      const count = await window.electronAPI.scanner.start(scanPath, {
        enabled: autoExtractMetadata,
      });
      alert(`${count}冊の本をスキャンしました`);
    } catch (error) {
      console.error('スキャンエラー:', error);
      alert('スキャン中にエラーが発生しました');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCancelScan = async () => {
    await window.electronAPI.scanner.cancel();
    setIsScanning(false);
  };

  const handleExportMetadata = async () => {
    // TODO: ファイル保存ダイアログ
    alert('エクスポート機能は実装予定です');
  };

  const handleImportMetadata = async () => {
    // TODO: ファイル選択ダイアログ
    alert('インポート機能は実装予定です');
  };

  const handleCreateBackup = async () => {
    // TODO: ファイル保存ダイアログ
    alert('バックアップ機能は実装予定です');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>設定</h1>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>スキャン設定</h2>

          <div className={styles.field}>
            <label>スキャン対象フォルダ</label>
            <div className={styles.pathInput}>
              <input
                type="text"
                value={scanPath}
                readOnly
                placeholder="フォルダを選択してください"
              />
              <button onClick={handleSelectFolder}>選択</button>
            </div>
          </div>

          <div className={styles.field}>
            <label>
              <input
                type="checkbox"
                checked={autoExtractMetadata}
                onChange={(e) => setAutoExtractMetadata(e.target.checked)}
              />
              パスからメタデータを自動抽出
            </label>
            <p className={styles.hint}>
              フォルダ構造（シリーズ/キャラクター/タイトル）からメタデータを抽出します
            </p>
          </div>

          <div className={styles.actions}>
            {!isScanning ? (
              <button onClick={handleStartScan} className={styles.primaryButton}>
                スキャン開始
              </button>
            ) : (
              <>
                <div className={styles.progress}>
                  <p>
                    スキャン中: {scanProgress.current} / {scanProgress.total}
                  </p>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${(scanProgress.current / scanProgress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <button onClick={handleCancelScan} className={styles.dangerButton}>
                  キャンセル
                </button>
              </>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2>表示設定</h2>

          <div className={styles.field}>
            <label>表示モード</label>
            <select
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value as any)}
            >
              <option value="single">単ページ</option>
              <option value="spread">見開き</option>
              <option value="scroll">スクロール</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>テーマ</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
              <option value="dark">ダーク</option>
              <option value="light">ライト</option>
            </select>
          </div>
        </section>

        <section className={styles.section}>
          <h2>バックアップ</h2>

          <div className={styles.actions}>
            <button onClick={handleExportMetadata}>
              メタデータをエクスポート
            </button>
            <button onClick={handleImportMetadata}>
              メタデータをインポート
            </button>
            <button onClick={handleCreateBackup} className={styles.primaryButton}>
              データベースをバックアップ
            </button>
          </div>
        </section>

        <section className={styles.section}>
          <h2>キーボードショートカット</h2>
          <table className={styles.shortcuts}>
            <tbody>
              <tr>
                <td>← / →</td>
                <td>前/次のページ</td>
              </tr>
              <tr>
                <td>Shift + ← / →</td>
                <td>10ページジャンプ</td>
              </tr>
              <tr>
                <td>Ctrl + ← / →</td>
                <td>100ページジャンプ</td>
              </tr>
              <tr>
                <td>+ / -</td>
                <td>ズームイン/アウト</td>
              </tr>
              <tr>
                <td>0</td>
                <td>ズームリセット</td>
              </tr>
              <tr>
                <td>F</td>
                <td>フルスクリーン</td>
              </tr>
              <tr>
                <td>B</td>
                <td>しおり追加</td>
              </tr>
              <tr>
                <td>Ctrl + T</td>
                <td>新しいタブ</td>
              </tr>
              <tr>
                <td>Ctrl + W</td>
                <td>タブを閉じる</td>
              </tr>
              <tr>
                <td>Ctrl + F</td>
                <td>検索</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
