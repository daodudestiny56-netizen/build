import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'triage.db');

// Global cache for DB connection in dev to prevent connection leaks across hot reloads
const globalForDb = global as unknown as { db: Database.Database };

export const db =
  globalForDb.db ||
  new Database(dbPath, {
    verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;

// Enable WAL mode for better concurrency and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      raw_request TEXT NOT NULL,
      category TEXT NOT NULL,
      urgency TEXT NOT NULL,
      ai_summary TEXT NOT NULL,
      ai_draft_response TEXT NOT NULL,
      assigned_to TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('new', 'in_progress', 'resolved', 'escalated')),
      is_urgent_flag INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now')),
      escalated_at DATETIME,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      event TEXT NOT NULL,
      detail TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
    CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
    CREATE INDEX IF NOT EXISTS idx_cases_customer_id ON cases(customer_id);
    CREATE INDEX IF NOT EXISTS idx_audit_log_case_id ON audit_log(case_id);
  `);
}

// Auto-run schema initialization on module load
initDb();
