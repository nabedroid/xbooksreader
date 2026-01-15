import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/renderer/store/useSettingsStore';
import type { ScanProgress } from '@/types';
import styles from './SettingsScreen.module.css';

export default function SettingsScreen() {
  const {
    scanPaths,
    autoExtractMetadata,
    displayMode,
    theme,
    addScanPath,
    removeScanPath,
    setAutoExtractMetadata,
    setDisplayMode,
    setTheme,
  } = useSettingsStore();

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    current: 0,
    total: 0,
    currentPath: '',
    status: 'scanning'
  });
  const [scanMode, setScanMode] = useState<'add' | 'sync'>('add');

  useEffect(() => {
    // メニューからのアクションをリッスン
    if (window.electronAPI.utils.onMenuAction) {
      const removeListener = window.electronAPI.utils.onMenuAction((action) => {
        if (action === 'add-folder') {
          handleSelectFolder();
        }
      });
      return removeListener;
    }
  }, []);

  const handleSelectFolder = async () => {
    const path = await window.electronAPI.utils.selectDirectory();
    if (path) {
      addScanPath(path);
    }
  };

  const handleRemoveFolder = (path: string) => {
    if (confirm(`このフォルダをスキャン対象から削除しますか？\n${path}`)) {
      removeScanPath(path);
    }
  };

  const handleStartScan = async () => {
    if (scanPaths.length === 0) {
      alert('スキャン対象フォルダを追加してください');
      return;
    }

    if (scanMode === 'sync') {
      if (!confirm('同期モードを実行します。削除されたファイルや構成が変更されたフォルダはデータベースから更新または削除されます。\nよろしいですか？')) {
        return;
      }
    }

    setIsScanning(true);
    setScanProgress({ current: 0, total: 0, currentPath: '', status: 'scanning' });

    // 進捗を監視
    window.electronAPI.scanner.onProgress((progress) => {
      setScanProgress(progress);
    });

    try {
      const count = await window.electronAPI.scanner.start(scanPaths, scanMode, {
        enabled: autoExtractMetadata,
      });
      await window.electronAPI.utils.showAlert(`スキャン完了: ${count}冊の本を処理しました`);
    } catch (error) {
      console.error('スキャンエラー:', error);
      await window.electronAPI.utils.showAlert('スキャン中にエラーが発生しました');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCancelScan = async () => {
    await window.electronAPI.scanner.cancel();
    setIsScanning(false);
  };

  const handleExportMetadata = async () => {
    await window.electronAPI.utils.showAlert('エクスポート機能は実装予定です');
  };

  const handleImportMetadata = async () => {
    await window.electronAPI.utils.showAlert('インポート機能は実装予定です');
  };

  const handleCreateBackup = async () => {
    await window.electronAPI.utils.showAlert('バックアップ機能は実装予定です');
  };

  const handleDeleteOrphans = async () => {
    if (scanPaths.length === 0) {
      await window.electronAPI.utils.showAlert('スキャン対象フォルダを追加してください');
      return;
    }

    const confirmed = await window.electronAPI.utils.showConfirm(
      'デッドリンク（ファイルが存在しない登録）を削除しますか？\n\n' +
      '・ファイルが見つからないロケーション情報\n' +
      '・ロケーションのないメタデータ\n\n' +
      'この操作は取り消せません。'
    );

    if (!confirmed) return;

    try {
      const result = await window.electronAPI.books.deleteOrphans(scanPaths);
      await window.electronAPI.utils.showAlert(`削除完了:\n・孤児メタデータ: ${result.orphanBooks}件\n・無効なロケーション: ${result.orphanLocations}件`);
    } catch (error) {
      console.error('デッドリンク削除エラー:', error);
      await window.electronAPI.utils.showAlert('削除中にエラーが発生しました');
    }
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
            <div className={styles.pathList}>
              {scanPaths.map((path) => (
                <div key={path} className={styles.pathItem}>
                  <span>{path}</span>
                  <button onClick={() => handleRemoveFolder(path)}>削除</button>
                </div>
              ))}
            </div>
            <button className={styles.addPathButton} onClick={handleSelectFolder}>
              ＋ フォルダを追加
            </button>
          </div>

          <div className={styles.field}>
            <label>スキャンモード</label>
            <div className={styles.scanMode}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  checked={scanMode === 'add'}
                  onChange={() => setScanMode('add')}
                />
                追加モード (新規ファイルのみ追加)
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  checked={scanMode === 'sync'}
                  onChange={() => setScanMode('sync')}
                />
                同期モード (削除・変更を反映)
              </label>
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
                    {scanProgress.status === 'processing' && ' (処理中...)'}
                  </p>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: scanProgress.total > 0 ? `${(scanProgress.current / scanProgress.total) * 100}%` : '0%',
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
          <h2>メンテナンス</h2>
          <p className={styles.hint}>
            デッドリンク（存在しないファイルへの参照）を削除します。
          </p>
          <div className={styles.actions}>
            <button onClick={handleDeleteOrphans} className={styles.dangerButton}>
              デッドリンクを削除
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
