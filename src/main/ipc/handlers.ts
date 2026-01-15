/**
 * IPCハンドラー
 * レンダラープロセスからのリクエストを処理
 */
import { ipcMain, BrowserWindow, dialog } from 'electron';
import sharp from 'sharp';
import * as BookModel from '../database/models/Book';
import * as TagModel from '../database/models/Tag';
import * as BookmarkModel from '../database/models/Bookmark';
import * as ImageLoader from '../services/imageLoader';
import * as BackupService from '../services/backupService';
import { searchWebMetadata } from '../services/metadataScraper';
import { convertImages, ConvertOptions } from '../services/imageConverter';

/**
 * IPCハンドラーを登録
 */
export function registerIpcHandlers() {
  // 本の操作
  ipcMain.handle('books:getAll', () => {
    return BookModel.getAllBooks();
  });

  ipcMain.handle('books:getById', (_event, id: number) => {
    return BookModel.getBookById(id);
  });

  ipcMain.handle('books:search', (_event, filter: any) => {
    return BookModel.searchBooks(filter);
  });

  ipcMain.handle('books:create', (_event, book: any) => {
    return BookModel.createBook(book);
  });

  ipcMain.handle('books:update', (_event, id: number, book: any) => {
    return BookModel.updateBook(id, book);
  });

  ipcMain.handle('books:delete', (_event, id: number) => {
    return BookModel.deleteBook(id);
  });

  ipcMain.handle('books:getCount', (_event, filter: any) => {
    return BookModel.getBooksCount(filter);
  });

  ipcMain.handle('books:incrementReadCount', (_event, id: number) => {
    return BookModel.incrementReadCount(id);
  });

  ipcMain.handle('books:updatePath', (_event, oldPath: string, newPath: string, dryRun: boolean = false) => {
    return BookModel.updateBookPaths(oldPath, newPath, dryRun);
  });

  ipcMain.handle('books:getMetadataList', (_event, field: any) => {
    return BookModel.getMetadataList(field);
  });

  // デッドリンク削除 (CAS用)
  ipcMain.handle('books:deleteOrphans', async (_event, basePaths: string[]) => {
    const orphanBooks = await BookModel.deleteOrphanBooks();
    const orphanLocations = await BookModel.deleteOrphanLocations(basePaths);
    return { orphanBooks, orphanLocations };
  });

  // タグの操作
  ipcMain.handle('tags:getAll', () => {
    return TagModel.getAllTags();
  });

  ipcMain.handle('tags:getBookTags', (_event, bookId: number) => {
    return TagModel.getBookTags(bookId);
  });

  ipcMain.handle('tags:setBookTags', (_event, bookId: number, tags: string[]) => {
    return TagModel.setBookTags(bookId, tags);
  });

  ipcMain.handle('tags:addToBook', (_event, bookId: number, tag: string) => {
    return TagModel.addTagToBook(bookId, tag);
  });

  ipcMain.handle('tags:removeFromBook', (_event, bookId: number, tag: string) => {
    return TagModel.removeTagFromBook(bookId, tag);
  });

  // しおりの操作
  ipcMain.handle('bookmarks:getBookBookmarks', (_event, bookId: number) => {
    return BookmarkModel.getBookBookmarks(bookId);
  });

  ipcMain.handle('bookmarks:create', (_event, bookmark: any) => {
    return BookmarkModel.createBookmark(bookmark);
  });

  ipcMain.handle('bookmarks:update', (_event, id: number, note: string) => {
    return BookmarkModel.updateBookmark(id, note);
  });

  ipcMain.handle('bookmarks:delete', (_event, id: number) => {
    return BookmarkModel.deleteBookmark(id);
  });

  // スキャン操作
  ipcMain.handle('scanner:start', async (event, paths: string[], _mode: 'add' | 'sync', _options: any) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    const { smartScan } = await import('../services/smartScanner');
    // CAS対応のスマートスキャンを実行
    const stats = await smartScan(paths, window ?? undefined);
    // 戻り値を旧スキャナーの期待値（追加された冊数）に合わせるか、
    // 全体のブック数に合わせるか検討が必要だが、一旦 stats.added を返す
    return stats.added;
  });

  ipcMain.handle('scanner:cancel', () => {
    // smartScannerにはまだキャンセル機能がないため、一旦何もしないか
    // 将来的に実装する
    return;
  });

  // スマートスキャン (CAS対応) - 明示的な呼び出し用
  ipcMain.handle('scanner:smartScan', async (event, paths: string[]) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    const { smartScan } = await import('../services/smartScanner');
    return smartScan(paths, window ?? undefined);
  });

  // 画像読み込み
  ipcMain.handle('images:load', async (_event, bookId: number, pageNumber: number) => {
    const buffer = await ImageLoader.loadImage(bookId, pageNumber);
    // BufferをBase64に変換して送信
    return buffer.toString('base64');
  });

  ipcMain.handle('images:getThumbnail', async (_event, bookId: number, pageNumber: number) => {
    const buffer = await ImageLoader.loadImage(bookId, pageNumber);
    const thumbnailBuffer = await sharp(buffer)
      .resize(200, null, { fit: 'inside' }) // 幅200、高さ自動（アスペクト比維持）
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();
    return thumbnailBuffer.toString('base64');
  });

  ipcMain.handle('images:getPages', async (_event, bookId: number) => {
    return ImageLoader.getBookPages(bookId);
  });

  ipcMain.handle('images:convert', async (event, options: ConvertOptions) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return { success: 0, failed: 0 };
    return convertImages(options, window);
  });

  // バックアップ/エクスポート
  ipcMain.handle('backup:exportMetadata', async (_event, exportPath: string) => {
    return BackupService.exportMetadata(exportPath);
  });

  ipcMain.handle('backup:importMetadata', async (_event, importPath: string) => {
    return BackupService.importMetadata(importPath);
  });

  ipcMain.handle('backup:createBackup', async (_event, backupPath: string) => {
    return BackupService.createBackup(backupPath);
  });

  ipcMain.handle('backup:restoreBackup', async (_event, backupPath: string) => {
    return BackupService.restoreBackup(backupPath);
  });

  // Webメタデータ検索
  ipcMain.handle('metadata:search', async (_event, query: string) => {
    return searchWebMetadata(query);
  });

  // ファイル/フォルダ選択ダイアログ
  ipcMain.handle('utils:selectDirectory', async (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return null;

    const result = await dialog.showOpenDialog(window, {
      properties: ['openDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    return result.filePaths[0];
  });

  // 確認ダイアログ
  ipcMain.handle('utils:showConfirm', async (event, message: string) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return false;

    const result = await dialog.showMessageBox(window, {
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 0,
      cancelId: 1,
      title: '確認',
      message: message,
    });

    return result.response === 0;
  });

  // アラートダイアログ
  ipcMain.handle('utils:showAlert', async (event, message: string) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;

    await dialog.showMessageBox(window, {
      type: 'info',
      buttons: ['OK'],
      title: '通知',
      message: message,
    });
  });

  console.log('IPCハンドラーを登録しました');
}
