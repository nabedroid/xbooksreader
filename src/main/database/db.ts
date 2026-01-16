import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { app, dialog } from 'electron';

// SQLファイルをバンドルとしてインポート
import schemaSql from './schema.sql?raw';

let db: sqlite3.Database | null = null;

/**
 * データベースを初期化
 */
export async function initDatabase(): Promise<sqlite3.Database> {
  if (db) {
    return db;
  }

  return new Promise((resolve, reject) => {
    try {
      const dbPath = app.isPackaged
        ? path.join(process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(app.getPath('exe')), 'library.db')
        : path.join(app.getAppPath(), 'library.db');

      console.log(`データベースパス: ${dbPath}`);

      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      db = new sqlite3.Database(dbPath, async (err) => {
        if (err) {
          const errorMsg = `データベースの接続に失敗しました:\n${err.message}`;
          console.error(errorMsg);
          dialog.showErrorBox('起動エラー', errorMsg);
          app.exit(1);
          reject(err);
          return;
        }

        // 基本設定
        db?.run('PRAGMA journal_mode = WAL');
        db?.run('PRAGMA foreign_keys = ON');

        // テーブル作成（存在しない場合のみ）
        db?.exec(schemaSql, (execErr) => {
          if (execErr) {
            console.error('スキーマの適用に失敗しました:', execErr);
            reject(execErr);
          } else {
            console.log('データベースの初期化が完了しました。');
            resolve(db!);
          }
        });
      });
    } catch (error: any) {
      reject(error);
    }
  });
}

/**
 * データベース接続を取得
 */
export function getDatabase(): sqlite3.Database {
  if (!db) {
    throw new Error('データベースが初期化されていません');
  }
  return db;
}

/**
 * プロミスベースのクエリ実行ヘルパー
 */
export const dbQuery = {
  run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      getDatabase().run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get<T>(sql: string, params: any[] = []): Promise<T | null> {
    return new Promise((resolve, reject) => {
      getDatabase().get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve((row as T) || null);
      });
    });
  },
  all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      getDatabase().all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve((rows as T[]) || []);
      });
    });
  }
};

/**
 * データベース接続を閉じる
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('データベース接続を閉じました');
  }
}
