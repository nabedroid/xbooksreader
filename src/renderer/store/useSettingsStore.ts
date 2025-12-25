/**
 * 設定の状態管理ストア
 */
import { create } from 'zustand';

interface SettingsStore {
  // 状態
  scanPaths: string[];
  autoExtractMetadata: boolean;
  displayMode: 'single' | 'spread' | 'scroll';
  theme: 'dark' | 'light';

  // アクション
  addScanPath: (path: string) => void;
  removeScanPath: (path: string) => void;
  setAutoExtractMetadata: (enabled: boolean) => void;
  setDisplayMode: (mode: 'single' | 'spread' | 'scroll') => void;
  setTheme: (theme: 'dark' | 'light') => void;

  // 永続化
  loadSettings: () => void;
  saveSettings: () => void;
}

const STORAGE_KEY = 'xbooksreader-settings';

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  // 初期状態
  scanPaths: [],
  autoExtractMetadata: true,
  displayMode: 'single',
  theme: 'dark',

  // アクション
  addScanPath: (path) => {
    const { scanPaths } = get();
    if (!scanPaths.includes(path)) {
      set({ scanPaths: [...scanPaths, path] });
      get().saveSettings();
    }
  },

  removeScanPath: (path) => {
    const { scanPaths } = get();
    set({ scanPaths: scanPaths.filter(p => p !== path) });
    get().saveSettings();
  },

  setAutoExtractMetadata: (enabled) => {
    set({ autoExtractMetadata: enabled });
    get().saveSettings();
  },

  setDisplayMode: (mode) => {
    set({ displayMode: mode });
    get().saveSettings();
  },

  setTheme: (theme) => {
    set({ theme });
    get().saveSettings();
  },

  // LocalStorageから設定を読み込む
  loadSettings: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const settings = JSON.parse(saved);

        // 以前の scanPath (単数) からの移行
        if ('scanPath' in settings && !settings.scanPaths) {
          settings.scanPaths = settings.scanPath ? [settings.scanPath] : [];
          delete settings.scanPath;
        }

        set(settings);
      }
    } catch (error) {
      console.error('設定の読み込みエラー:', error);
    }
  },

  // LocalStorageに設定を保存
  saveSettings: () => {
    try {
      const settings = {
        scanPaths: get().scanPaths,
        autoExtractMetadata: get().autoExtractMetadata,
        displayMode: get().displayMode,
        theme: get().theme,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('設定の保存エラー:', error);
    }
  },
}));
