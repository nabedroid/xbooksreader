/**
 * IPCハンドラー
 * レンダラープロセスからのリクエストを処理
 */
import { ipcMain, BrowserWindow, dialog } from 'electron';
import Jimp from 'jimp';
import * as BookModel from '../database/models/Book';
import * as TagModel from '../database/models/Tag';
import * as BookmarkModel from '../database/models/Bookmark';
import * as Scanner from '../services/scanner';
import * as ImageLoader from '../services/imageLoader';
import * as BackupService from '../services/backupService';
import { searchWebMetadata } from '../services/metadataScraper';

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

  ipcMain.handle('books:getMetadataList', (_event, field: any) => {
    return BookModel.getMetadataList(field);
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
  ipcMain.handle('scanner:start', async (event, paths: string[], mode: 'add' | 'sync', options: any) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    return Scanner.scanDirectories(paths, mode, options, window);
  });

  ipcMain.handle('scanner:cancel', () => {
    return Scanner.cancelScan();
  });

  // 画像読み込み
  ipcMain.handle('images:load', async (_event, bookId: number, pageNumber: number) => {
    const buffer = await ImageLoader.loadImage(bookId, pageNumber);
    // BufferをBase64に変換して送信
    return buffer.toString('base64');
  });

  ipcMain.handle('images:getThumbnail', async (_event, bookId: number, pageNumber: number) => {
    const buffer = await ImageLoader.loadImage(bookId, pageNumber);
    const image = await Jimp.read(buffer);
    const thumbnail = await image
      .resize(200, Jimp.AUTO)
      .quality(80)
      .getBufferAsync(Jimp.MIME_JPEG);
    return thumbnail.toString('base64');
  });

  ipcMain.handle('images:getPages', async (_event, bookId: number) => {
    return ImageLoader.getBookPages(bookId);
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

  console.log('IPCハンドラーを登録しました');
}
