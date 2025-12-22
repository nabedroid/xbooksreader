/**
 * 設定の状態管理ストア
 */
import { create } from 'zustand';

interface SettingsStore {
  // 状態
  scanPath: string;
  autoExtractMetadata: boolean;
  displayMode: 'single' | 'spread' | 'scroll';
  theme: 'dark' | 'light';

  // アクション
  setScanPath: (path: string) => void;
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
  scanPath: '',
  autoExtractMetadata: true,
  displayMode: 'single',
  theme: 'dark',

  // アクション
  setScanPath: (path) => {
    set({ scanPath: path });
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
        scanPath: get().scanPath,
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
