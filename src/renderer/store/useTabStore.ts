/**
 * タブの状態管理ストア
 */
import { create } from 'zustand';
import type { Book } from '@/types';

interface Tab {
  id: string;
  book: Book;
  currentPage: number;
}

interface TabStore {
  // 状態
  tabs: Tab[];
  activeTabId: string | null;

  // アクション
  openTab: (book: Book) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabPage: (tabId: string, page: number) => void;
  closeAllTabs: () => void;
}

export const useTabStore = create<TabStore>((set, get) => ({
  // 初期状態
  tabs: [],
  activeTabId: null,

  // アクション
  openTab: (book) => {
    const existingTab = get().tabs.find(t => t.book.id === book.id);

    if (existingTab) {
      // 既に開いている場合はアクティブにする
      set({ activeTabId: existingTab.id });
    } else {
      // 新しいタブを作成
      const newTab: Tab = {
        id: `tab-${book.id}-${Date.now()}`,
        book,
        currentPage: book.last_read_page || 0,
      };
      set({
        tabs: [...get().tabs, newTab],
        activeTabId: newTab.id,
      });
    }
  },

  closeTab: (tabId) => {
    const tabs = get().tabs.filter(t => t.id !== tabId);
    let activeTabId = get().activeTabId;

    // 閉じたタブがアクティブだった場合
    if (activeTabId === tabId) {
      activeTabId = tabs.length > 0 ? tabs[tabs.length - 1].id : null;
    }

    set({ tabs, activeTabId });
  },

  setActiveTab: (tabId) => {
    set({ activeTabId: tabId });
  },

  updateTabPage: (tabId, page) => {
    const tabs = get().tabs.map(t =>
      t.id === tabId ? { ...t, currentPage: page } : t
    );
    set({ tabs });
  },

  closeAllTabs: () => {
    set({ tabs: [], activeTabId: null });
  },
}));
