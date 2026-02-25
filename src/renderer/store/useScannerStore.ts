import { create } from 'zustand';
import type { ScanProgress } from '@/types';
import { useSettingsStore } from './useSettingsStore';

interface ScannerStore {
  isScanning: boolean;
  scanProgress: ScanProgress;
  scanMode: 'add' | 'sync';

  setScanMode: (mode: 'add' | 'sync') => void;
  startScan: (modeOverride?: 'add' | 'sync') => Promise<void>;
  startSmartScan: () => Promise<void>;
  cancelScan: () => Promise<void>;
  reset: () => void;
}

export const useScannerStore = create<ScannerStore>((set, get) => ({
  isScanning: false,
  scanProgress: { current: 0, total: 0, currentPath: '', status: 'scanning' },
  scanMode: 'add',

  setScanMode: (mode) => set({ scanMode: mode }),

  startScan: async (modeOverride?: 'add' | 'sync') => {
    if (get().isScanning) return;

    const { scanPaths, autoExtractMetadata } = useSettingsStore.getState();
    const mode = modeOverride || get().scanMode;

    if (scanPaths.length === 0) {
      await window.electronAPI.utils.showAlert('スキャン対象フォルダを追加してください。設定画面から追加できます。');
      return;
    }

    if (mode === 'sync') {
      const confirmed = await window.electronAPI.utils.showConfirm('同期モードを実行します。削除されたファイルや構成が変更されたフォルダはデータベースから更新または削除されます。\nよろしいですか？');
      if (!confirmed) return;
    }

    set({
      isScanning: true,
      scanMode: mode,
      scanProgress: { current: 0, total: 0, currentPath: '', status: 'scanning' }
    });

    let unsub: (() => void) | undefined;
    unsub = window.electronAPI.scanner.onProgress((progress) => {
      set({ scanProgress: progress });
    });

    try {
      const count = await window.electronAPI.scanner.start(scanPaths, mode, {
        enabled: autoExtractMetadata,
      });
      await window.electronAPI.utils.showAlert(`スキャン完了: ${count}冊の本を処理しました`);
    } catch (error) {
      console.error('スキャンエラー:', error);
      await window.electronAPI.utils.showAlert('スキャン中にエラーが発生しました');
    } finally {
      if (unsub) unsub();
      set({ isScanning: false });

      // スキャン完了時に本棚を更新する
      const { useBookStore } = await import('./useBookStore');
      useBookStore.getState().loadBooks();
    }
  },

  startSmartScan: async () => {
    if (get().isScanning) return;

    const { scanPaths } = useSettingsStore.getState();

    if (scanPaths.length === 0) {
      await window.electronAPI.utils.showAlert('スキャン対象フォルダを追加してください。設定画面から追加できます。');
      return;
    }

    const confirmed = await window.electronAPI.utils.showConfirm(
      '自動整理スキャンを実行します。\n' +
      'ファイルの中身を解析して、移動や名前変更された本を追跡・整理します。（時間がかかる場合があります）\n' +
      'よろしいですか？'
    );
    if (!confirmed) return;

    set({
      isScanning: true,
      scanMode: 'sync', // UIの表示上は同期に似ているため
      scanProgress: { current: 0, total: 0, currentPath: 'コンテンツ解析の準備中...', status: 'scanning' }
    });

    let unsub: (() => void) | undefined;

    // スマートスキャンも同じプログレスイベントを使用している前提
    unsub = window.electronAPI.scanner.onProgress((progress) => {
      set({ scanProgress: progress });
    });

    try {
      const result = await window.electronAPI.scanner.smartScan(scanPaths);
      await window.electronAPI.utils.showAlert(
        `自動整理完了\n\n` +
        `新規追加: ${result.added} 件\n` +
        `情報更新(移動など): ${result.updated} 件\n` +
        `リンク削除: ${result.removed} 件`
      );
    } catch (error: any) {
      console.error('スマートスキャンエラー:', error);
      await window.electronAPI.utils.showAlert(`自動整理中にエラーが発生しました\n${error.message || ''}`);
    } finally {
      if (unsub) unsub();
      set({ isScanning: false });

      // スキャン完了時に本棚を更新する
      const { useBookStore } = await import('./useBookStore');
      useBookStore.getState().loadBooks();
    }
  },

  cancelScan: async () => {
    await window.electronAPI.scanner.cancel();
    set({ isScanning: false });
  },

  reset: () => {
    set({
      isScanning: false,
      scanProgress: { current: 0, total: 0, currentPath: '', status: 'scanning' }
    });
  }
}));
