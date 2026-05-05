import Database, { Database as DatabaseType } from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '..', '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'pricepulse.db');

const db: DatabaseType = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      discount REAL,
      rating REAL DEFAULT 0,
      sold_count INTEGER DEFAULT 0,
      image_url TEXT DEFAULT '',
      shop_name TEXT DEFAULT '',
      shop_location TEXT DEFAULT '',
      category TEXT DEFAULT '',
      url TEXT NOT NULL,
      description TEXT,
      highlights TEXT DEFAULT '[]',
      ai_analysis TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS search_history (
      id TEXT PRIMARY KEY,
      query TEXT NOT NULL,
      filters TEXT DEFAULT '{}',
      result_count INTEGER DEFAULT 0,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      service TEXT NOT NULL UNIQUE,
      key_value TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
    CREATE INDEX IF NOT EXISTS idx_search_history_timestamp ON search_history(timestamp);
  `);

  console.log('Database initialized successfully');
}

export { db };
