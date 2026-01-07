import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'somba.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Users table with role-based access
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'active_student', 'completed_student')),
    avatar_url TEXT,
    cohort TEXT,
    enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,
    last_login TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- User progress tracking
  CREATE TABLE IF NOT EXISTS user_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    week_index INTEGER NOT NULL,
    step_index INTEGER NOT NULL,
    completed INTEGER DEFAULT 0,
    completed_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, week_index, step_index)
  );

  -- User inputs saved from lessons
  CREATE TABLE IF NOT EXISTS user_inputs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    input_key TEXT NOT NULL,
    input_value TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, input_key)
  );

  -- Checklist progress
  CREATE TABLE IF NOT EXISTS checklist_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    step_id TEXT NOT NULL,
    item_key TEXT NOT NULL,
    checked INTEGER DEFAULT 0,
    checked_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, step_id, item_key)
  );

  -- Content/Module release schedule
  CREATE TABLE IF NOT EXISTS content_schedule (
    id TEXT PRIMARY KEY,
    week_index INTEGER NOT NULL UNIQUE,
    release_date TEXT NOT NULL,
    is_released INTEGER DEFAULT 0,
    released_by TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (released_by) REFERENCES users(id)
  );

  -- Custom content that admins can add
  CREATE TABLE IF NOT EXISTS custom_content (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    week_index INTEGER,
    content_type TEXT CHECK(content_type IN ('announcement', 'resource', 'bonus_lesson', 'update')),
    is_published INTEGER DEFAULT 0,
    published_at TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  -- AI aggregation - stores participant inputs for analysis
  CREATE TABLE IF NOT EXISTS ai_aggregation_inputs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    input_key TEXT NOT NULL,
    input_value TEXT NOT NULL,
    aggregation_type TEXT DEFAULT 'general',
    week_index INTEGER,
    analyzed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  -- AI generated summaries/insights from participant data
  CREATE TABLE IF NOT EXISTS ai_insights (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    insight_type TEXT CHECK(insight_type IN ('weekly_summary', 'common_challenges', 'success_patterns', 'recommendations')),
    week_index INTEGER,
    input_count INTEGER DEFAULT 0,
    generated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    generated_by TEXT,
    FOREIGN KEY (generated_by) REFERENCES users(id)
  );

  -- Buddy matching
  CREATE TABLE IF NOT EXISTS buddy_pairs (
    id TEXT PRIMARY KEY,
    user_1_id TEXT NOT NULL,
    user_2_id TEXT NOT NULL,
    matched_at TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('active', 'ended', 'pending')) DEFAULT 'active',
    FOREIGN KEY (user_1_id) REFERENCES users(id),
    FOREIGN KEY (user_2_id) REFERENCES users(id),
    UNIQUE(user_1_id, user_2_id)
  );

  -- Indexes for performance
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  CREATE INDEX IF NOT EXISTS idx_users_cohort ON users(cohort);
  CREATE INDEX IF NOT EXISTS idx_progress_user ON user_progress(user_id);
  CREATE INDEX IF NOT EXISTS idx_inputs_user ON user_inputs(user_id);
  CREATE INDEX IF NOT EXISTS idx_schedule_release ON content_schedule(release_date);
  CREATE INDEX IF NOT EXISTS idx_aggregation_week ON ai_aggregation_inputs(week_index);
`);

export default db;
