import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { app, dialog } from 'electron';

// SQLファイルをバンドルとしてインポート
import initialSql from './migrations/001_initial.sql?raw';
import expansionSql from './migrations/002_metadata_expansion.sql?raw';
import characterExpansionSql from './migrations/003_add_characters_column.sql?raw';
import updateRatingConstraintSql from './migrations/004_update_rating_constraint.sql?raw';
import normalizeMetadataSql from './migrations/005_normalize_metadata.sql?raw';
import casMigrationSql from './migrations/006_cas_migration.sql?raw';
import fixBooksPathNullableSql from './migrations/007_fix_books_path_nullable.sql?raw';

let db: sqlite3.Database | null = null;
const migrations = [
  { version: 1, sql: initialSql },
  { version: 2, sql: expansionSql },
  { version: 3, sql: characterExpansionSql },
  { version: 4, sql: updateRatingConstraintSql },
  { version: 5, sql: normalizeMetadataSql },
  { version: 6, sql: casMigrationSql },
  { version: 7, sql: fixBooksPathNullableSql },
];

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
        ? path.join(path.dirname(app.getPath('exe')), 'doujinshi.db')
        : path.join(app.getAppPath(), 'doujinshi.db');

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

        // マイグレーション
        try {
          await runMigrations(db!);
          resolve(db!);
        } catch (mErr: any) {
          reject(mErr);
        }
      });
    } catch (error: any) {
      reject(error);
    }
  });
}

/**
 * マイグレーションを実行
 */
async function runMigrations(database: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    database.get(
      "SELECT MAX(version) as version FROM schema_version",
      async (err, row: { version: number } | undefined) => {
        if (err && !err.message.includes('no such table: schema_version')) {
          reject(err);
          return;
        }

        const currentVersion = row?.version || 0;
        console.log(`現在のDBバージョン: ${currentVersion}`);

        try {
          let migratedV5 = false;
          let migratedV6 = false;

          for (const migration of migrations) {
            if (migration.version > currentVersion) {
              console.log(`マイグレーション ${migration.version} を適用中...`);
              await new Promise<void>((res, rej) => {
                database.exec(migration.sql, (execErr) => {
                  if (execErr) rej(execErr);
                  else res();
                });
              });
              if (migration.version === 5) migratedV5 = true;
              if (migration.version === 6) migratedV6 = true;
            }
          }

          // バージョン5（正規化）が適用された場合、既存データを移行
          if (migratedV5) {
            const { migrateOldMetadata } = await import('./models/Book');
            await migrateOldMetadata();
          }

          // バージョン6（CAS）が適用された場合、データ移行
          if (migratedV6) {
            console.log('CASアーキテクチャへのマイグレーションが適用されました。');
            // TODO: データ移行ロジックを実装後に有効化
            // const { migrateToCas } = await import('./models/Book');
            // await migrateToCas();
          }

          resolve();
        } catch (execErr) {
          reject(execErr);
        }
      }
    );
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
