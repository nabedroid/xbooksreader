/**
 * Electronメインプロセスのエントリーポイント
 */
import { app, BrowserWindow, dialog, Menu } from 'electron';
import path from 'path';
import fs from 'fs';
import { initDatabase, closeDatabase } from './database/db';

// DevToolsのAutofillエラー抑制
app.commandLine.appendSwitch('disable-autofill');
app.commandLine.appendSwitch('disable-features', 'Autofill');

// ログ出力用のペルパー（コマンドラインで見えない場合のため）
const logPath = app.isPackaged
  ? path.join(path.dirname(app.getPath('exe')), 'startup_debug.log')
  : path.join(app.getAppPath(), 'startup_debug.log');

function logToFile(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logPath, logMessage);
  console.log(message);
}

// 既存のログをクリア
try { if (fs.existsSync(logPath)) fs.unlinkSync(logPath); } catch (e) { }

logToFile('--- アプリケーション開始 ---');
logToFile(`環境: ${app.isPackaged ? '本番' : '開発'}`);
logToFile(`AppPath: ${app.getAppPath()}`);
logToFile(`ExePath: ${app.getPath('exe')}`);

let mainWindow: BrowserWindow | null = null;

/**
 * メインウィンドウを作成
 */
function createWindow() {
  logToFile('MainWindowを作成中...');
  try {
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      webPreferences: {
        preload: path.join(app.getAppPath(), 'dist-electron/preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
      title: 'xBooksReader',
      show: true, // 診断のため最初から表示
    });

    // メニューの設定
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'ファイル',
        submenu: [
          {
            label: '設定',
            accelerator: 'CmdOrCtrl+,',
            click: () => {
              mainWindow?.webContents.send('menu:navigate', '/settings');
            }
          },
          { type: 'separator' },
          {
            label: '終了',
            role: 'quit'
          }
        ]
      },
      {
        label: '表示',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'ウィンドウ',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          ...(process.platform === 'darwin' ? [
            { type: 'separator' },
            { role: 'front' },
            { type: 'separator' },
            { role: 'window' }
          ] : [
            { role: 'close' }
          ])
        ] as any
      }
    ];

    if (process.platform === 'darwin') {
      template.unshift({
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // 読み込み先の設定
    const indexPath = app.isPackaged
      ? path.join(app.getAppPath(), 'dist/index.html')
      : 'http://localhost:3000';

    logToFile(`UI読み込み先: ${indexPath}`);

    if (!app.isPackaged) {
      mainWindow.loadURL(indexPath);
      mainWindow.webContents.openDevTools();
    } else {
      mainWindow.loadFile(indexPath).catch(err => {
        logToFile(`UI読み込みエラー: ${err.message}`);
      });
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
    });

    logToFile('MainWindow作成完了');
  } catch (error: any) {
    logToFile(`MainWindow作成失敗: ${error.message}`);
    throw error;
  }
}

import { registerIpcHandlers } from './ipc/handlers';

/**
 * アプリケーション初期化
 */
logToFile('whenReady待ち開始...');
app.whenReady().then(async () => {
  logToFile('whenReady完了');

  try {
    logToFile('データベース初期化開始...');
    await initDatabase();
    logToFile('データベース初期化完了');

    logToFile('IPCハンドラー登録中...');
    registerIpcHandlers();
    logToFile('IPCハンドラー登録完了');

    createWindow();
  } catch (error: any) {
    const errorMsg = `起動中にエラーが発生しました:\n${error.message}\n${error.stack}`;
    logToFile(`致命的なエラー: ${errorMsg}`);
    dialog.showErrorBox('Fatal Start Error', errorMsg);
    app.exit(1);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}).catch(err => {
  logToFile(`whenReady失敗: ${err.message}`);
});

/**
 * 全てのウィンドウが閉じられた時
 */
app.on('window-all-closed', () => {
  logToFile('全てのウィンドウが閉じられました');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * アプリケーション終了時
 */
app.on('will-quit', () => {
  logToFile('will-quit実行');
  try {
    closeDatabase();
  } catch (e) { }
});

/**
 * エラーハンドリング
 */
process.on('uncaughtException', (error) => {
  const msg = `未処理の例外: ${error.message}\n${error.stack}`;
  logToFile(msg);
  dialog.showErrorBox('Fatal Uncaught Exception', msg);
  app.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  logToFile(`未処理のPromise拒否: ${reason}`);
});
