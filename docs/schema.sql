-- ============================================================
-- AI Project Sprint — Supabase Schema Migration
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- PROJECTS (seed data managed from backend/app/data/projects.py)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  why_description TEXT NOT NULL,
  tech_stack      TEXT[] NOT NULL DEFAULT '{}',
  build_plan      JSONB NOT NULL DEFAULT '[]',
  difficulty      TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate')),
  ai_domains      TEXT[] NOT NULL DEFAULT '{}',
  suitable_goals  TEXT[] NOT NULL DEFAULT '{}',
  tags            TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Registration fields
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  college         TEXT NOT NULL,
  year            TEXT NOT NULL CHECK (year IN ('1st', '2nd', '3rd', 'Final')),
  ai_interest     TEXT NOT NULL CHECK (ai_interest IN ('NLP', 'CV', 'ML', 'Automation', 'Other')),
  goal            TEXT NOT NULL CHECK (goal IN ('Placement', 'Internship', 'Learning', 'Startup')),

  -- Auth / access
  -- Opaque, cryptographically random token (secrets.token_urlsafe(32))
  -- Stored as plain text; intentionally lightweight for MVP prototype.
  -- Do NOT use the user UUID as the passport token.
  passport_token  TEXT UNIQUE NOT NULL,

  -- Referral
  referral_code   TEXT UNIQUE NOT NULL,
  referred_by     TEXT REFERENCES users(referral_code) ON DELETE SET NULL,

  -- Project match
  project_id      TEXT NOT NULL REFERENCES projects(id),

  -- Attribution
  source          TEXT NOT NULL DEFAULT 'organic',
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_passport_token ON users(passport_token);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);

-- ============================================================
-- REFERRALS
-- ============================================================
CREATE TABLE IF NOT EXISTS referrals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_code   TEXT NOT NULL REFERENCES users(referral_code) ON DELETE CASCADE,
  referee_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(referrer_code, referee_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_code);

-- ============================================================
-- EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name      TEXT NOT NULL,
  session_id      TEXT,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  referral_code   TEXT,
  properties      JSONB NOT NULL DEFAULT '{}',
  ip_address      TEXT,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_name    ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_user    ON events(user_id);

-- ============================================================
-- Row Level Security — disable for service role (backend uses service role key)
-- ============================================================
ALTER TABLE users     DISABLE ROW LEVEL SECURITY;
ALTER TABLE referrals DISABLE ROW LEVEL SECURITY;
ALTER TABLE events    DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects  DISABLE ROW LEVEL SECURITY;
