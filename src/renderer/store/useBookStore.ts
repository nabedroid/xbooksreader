/**
 * 本の状態管理ストア
 */
import { create } from 'zustand';
import type { Book, SearchFilter } from '@/types';

interface BookStore {
  // 状態
  books: Book[];
  selectedBook: Book | null;
  currentPage: number;
  searchFilter: SearchFilter;
  isLoading: boolean;

  // アクション
  setBooks: (books: Book[]) => void;
  selectBook: (book: Book | null) => void;
  setCurrentPage: (page: number) => void;
  setSearchFilter: (filter: SearchFilter) => void;
  setLoading: (loading: boolean) => void;

  // 非同期アクション
  loadBooks: () => Promise<void>;
  searchBooks: (filter: SearchFilter) => Promise<void>;
  updateBook: (id: number, updates: Partial<Book>) => Promise<void>;
}

export const useBookStore = create<BookStore>((set, get) => ({
  // 初期状態
  books: [],
  selectedBook: null,
  currentPage: 0,
  searchFilter: {},
  isLoading: false,

  // アクション
  setBooks: (books) => set({ books }),
  selectBook: (book) => set({ selectedBook: book, currentPage: book?.last_read_page || 0 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchFilter: (filter) => set({ searchFilter: filter }),
  setLoading: (loading) => set({ isLoading: loading }),

  // 非同期アクション
  loadBooks: async () => {
    set({ isLoading: true });
    try {
      const books = await window.electronAPI.books.getAll();
      set({ books, isLoading: false });
    } catch (error) {
      console.error('本の読み込みエラー:', error);
      set({ isLoading: false });
    }
  },

  searchBooks: async (filter) => {
    set({ isLoading: true, searchFilter: filter });
    try {
      const books = await window.electronAPI.books.search(filter);
      set({ books, isLoading: false });
    } catch (error) {
      console.error('検索エラー:', error);
      set({ isLoading: false });
    }
  },

  updateBook: async (id, updates) => {
    try {
      const updatedBook = await window.electronAPI.books.update(id, updates as any);
      const books = get().books.map(b => b.id === id ? updatedBook : b);
      set({ books });

      // 選択中の本も更新
      if (get().selectedBook?.id === id) {
        set({ selectedBook: updatedBook });
      }
    } catch (error) {
      console.error('本の更新エラー:', error);
    }
  },
}));
