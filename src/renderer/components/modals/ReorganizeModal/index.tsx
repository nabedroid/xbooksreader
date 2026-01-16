import { useState } from 'react';
import styles from './ReorganizeModal.module.css';

interface ReorganizeModalProps {
  onClose: () => void;
}

export default function ReorganizeModal({ onClose }: ReorganizeModalProps) {
  const [template, setTemplate] = useState('{原作}/{タイトル}');
  const [plan, setPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  // const [showDetails, setShowDetails] = useState(false);

  const fetchPreview = async () => {
    if (!template.trim()) return;
    setIsLoading(true);
    try {
      const data = await window.electronAPI.organizer.preview(template);
      setPlan(data);
    } catch (e) {
      console.error(e);
      await window.electronAPI.utils.showAlert('プレビューの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!plan || plan.items.length === 0) return;

    const confirm = await window.electronAPI.utils.showConfirm(
      `整理を実行しますか？\n対象: ${plan.items.filter((i: any) => i.status === 'pending').length} 件`
    );

    if (!confirm) return;

    setIsExecuting(true);
    try {
      const result = await window.electronAPI.organizer.execute(plan.items);
      await window.electronAPI.utils.showAlert(
        `整理が完了しました。\n成功: ${result.success}件\n失敗: ${result.failed}件`
      );
      onClose();
    } catch (e) {
      console.error(e);
      await window.electronAPI.utils.showAlert('実行中にエラーが発生しました');
    } finally {
      setIsExecuting(false);
    }
  };

  const downloadLog = () => {
    if (!plan) return;
    const log = plan.items.map((i: any) =>
      `[${i.status.toUpperCase()}] ${i.title}\n  FROM: ${i.originalPath}\n  TO:   ${i.newPath}${i.message ? `\n  MSG:  ${i.message}` : ''}`
    ).join('\n\n');

    const blob = new Blob([log], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reorganize_plan_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>ライブラリの整理整頓</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.description}>
            <p>メタデータに基づいてフォルダ構成を自動的に再構築します。</p>
            <ul>
              <li>移動は各「基準ディレクトリ」内でのみ行われます（ドライブ跨ぎなし）。</li>
              <li>接続されていないストレージ内のファイルはスキップされます。</li>
              <li>禁則文字は自動的に全角に置換されます。</li>
            </ul>
          </div>

          <div className={styles.templateSection}>
            <label className={styles.label}>テンプレート</label>
            <div className={styles.inputGroup}>
              <input
                type="text"
                className={styles.input}
                value={template}
                onChange={e => setTemplate(e.target.value)}
                placeholder="{原作}/{タイトル}"
              />
              <button className={styles.previewButton} onClick={fetchPreview} disabled={isLoading || isExecuting}>
                プレビュー
              </button>
            </div>
            <div className={styles.tags}>
              <span>使用可能な要素:</span>
              <button onClick={() => setTemplate(t => t + '{タイトル}')}>タイトル</button>
              <button onClick={() => setTemplate(t => t + '{原作}')}>原作</button>
              <button onClick={() => setTemplate(t => t + '{シリーズ}')}>シリーズ</button>
              <button onClick={() => setTemplate(t => t + '{サークル}')}>サークル</button>
            </div>
          </div>

          {plan && (
            <div className={styles.planSection}>
              <div className={styles.summary}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>移動対象</span>
                  <span className={styles.statValue}>{plan.items.filter((i: any) => i.status === 'pending').length} / {plan.total} 件</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>スキップ（変更なし）</span>
                  <span className={styles.statValue}>{plan.items.filter((i: any) => i.status === 'skipped').length} 件</span>
                </div>
                {plan.conflicts > 0 && (
                  <div className={`${styles.stat} ${styles.danger}`}>
                    <span className={styles.statLabel}>衝突</span>
                    <span className={styles.statValue}>{plan.conflicts} 件</span>
                  </div>
                )}
                {plan.errors > 0 && (
                  <div className={`${styles.stat} ${styles.danger}`}>
                    <span className={styles.statLabel}>エラー</span>
                    <span className={styles.statValue}>{plan.errors} 件</span>
                  </div>
                )}
              </div>

              {plan.notConnectedPorts.length > 0 && (
                <div className={styles.warning}>
                  <strong>未接続のストレージがあります:</strong>
                  <ul>
                    {plan.notConnectedPorts.map((p: string) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              )}

              <div className={styles.actions}>
                <button className={styles.logButton} onClick={downloadLog}>ログを保存(.txt)</button>
                <button
                  className={styles.executeButton}
                  onClick={handleExecute}
                  disabled={isExecuting || plan.items.filter((i: any) => i.status === 'pending').length === 0 || plan.conflicts > 0}
                >
                  {isExecuting ? '実行中...' : '実行する'}
                </button>
              </div>
              {plan.conflicts > 0 && <p className={styles.errorMessage}>※移動先の衝突があるため実行できません。テンプレートを調整してください。</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
