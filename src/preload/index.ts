/**
 * プリロードスクリプト
 * レンダラープロセスとメインプロセス間の安全な通信を提供
 */
import { contextBridge, ipcRenderer } from 'electron';

// レンダラープロセスに公開するAPI
contextBridge.exposeInMainWorld('electronAPI', {
  // 本の操作
  books: {
    getAll: () => ipcRenderer.invoke('books:getAll'),
    getById: (id: number) => ipcRenderer.invoke('books:getById', id),
    search: (filter: any) => ipcRenderer.invoke('books:search', filter),
    create: (book: any) => ipcRenderer.invoke('books:create', book),
    update: (id: number, book: any) => ipcRenderer.invoke('books:update', id, book),
    delete: (id: number) => ipcRenderer.invoke('books:delete', id),
    incrementReadCount: (id: number) => ipcRenderer.invoke('books:incrementReadCount', id),
    getMetadataList: (field: string) => ipcRenderer.invoke('books:getMetadataList', field),
    getCount: (filter: any) => ipcRenderer.invoke('books:getCount', filter),
  },

  // タグの操作
  tags: {
    getAll: () => ipcRenderer.invoke('tags:getAll'),
    getBookTags: (bookId: number) => ipcRenderer.invoke('tags:getBookTags', bookId),
    setBookTags: (bookId: number, tags: string[]) => ipcRenderer.invoke('tags:setBookTags', bookId, tags),
    addToBook: (bookId: number, tag: string) => ipcRenderer.invoke('tags:addToBook', bookId, tag),
    removeFromBook: (bookId: number, tag: string) => ipcRenderer.invoke('tags:removeFromBook', bookId, tag),
  },

  // しおりの操作
  bookmarks: {
    getBookBookmarks: (bookId: number) => ipcRenderer.invoke('bookmarks:getBookBookmarks', bookId),
    create: (bookmark: any) => ipcRenderer.invoke('bookmarks:create', bookmark),
    update: (id: number, note: string) => ipcRenderer.invoke('bookmarks:update', id, note),
    delete: (id: number) => ipcRenderer.invoke('bookmarks:delete', id),
  },

  // スキャン操作
  scanner: {
    start: (paths: string[], mode: string, options: any) => ipcRenderer.invoke('scanner:start', paths, mode, options),
    cancel: () => ipcRenderer.invoke('scanner:cancel'),
    onProgress: (callback: (progress: any) => void) => {
      ipcRenderer.on('scanner:progress', (_event, progress) => callback(progress));
    },
  },

  // 画像読み込み
  images: {
    load: (bookId: number, pageNumber: number) => ipcRenderer.invoke('images:load', bookId, pageNumber),
    getThumbnail: (bookId: number, pageNumber: number) => ipcRenderer.invoke('images:getThumbnail', bookId, pageNumber),
    getPages: (bookId: number) => ipcRenderer.invoke('images:getPages', bookId),
  },

  // バックアップ/エクスポート
  backup: {
    exportMetadata: (path: string) => ipcRenderer.invoke('backup:exportMetadata', path),
    importMetadata: (path: string) => ipcRenderer.invoke('backup:importMetadata', path),
    createBackup: (path: string) => ipcRenderer.invoke('backup:createBackup', path),
    restoreBackup: (path: string) => ipcRenderer.invoke('backup:restoreBackup', path),
  },

  // メタデータWeb取得
  metadata: {
    search: (query: string) => ipcRenderer.invoke('metadata:search', query),
  },

  // ユーティリティ
  utils: {
    selectDirectory: () => ipcRenderer.invoke('utils:selectDirectory'),
    onMenuNavigate: (callback: (path: string) => void) => {
      const subscription = (_event: any, path: string) => callback(path);
      ipcRenderer.on('menu:navigate', subscription);
      return () => ipcRenderer.removeListener('menu:navigate', subscription);
    },
    onMenuAction: (callback: (action: string) => void) => {
      const subscription = (_event: any, action: string) => callback(action);
      ipcRenderer.on('menu:action', subscription);
      return () => ipcRenderer.removeListener('menu:action', subscription);
    },
  },
});
