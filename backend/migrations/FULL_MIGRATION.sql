-- ============================================================================
-- FULL MIGRATION SCRIPT FOR MONEY MATTERS
-- This script combines all migrations into one file for easy setup.
-- ============================================================================

-- 001_initial_schema.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  currency_code VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  invite_code VARCHAR(50) UNIQUE -- From 004_multi_tenant.sql (merged for consistency)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL, -- Unique removed here, added as composite below
  password_hash TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin','manager','employee')) DEFAULT 'employee',
  manager_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT users_email_company_id_key UNIQUE (email, company_id) -- From 005_composite_unique_user.sql
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  amount_in_base NUMERIC(12,2),
  category VARCHAR(100),
  description TEXT,
  date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 002_bills_table.sql (New 2-stage approval workflow)
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  admin_status VARCHAR(20) DEFAULT 'pending' CHECK (admin_status IN ('pending','approved','rejected')),
  manager_status VARCHAR(20) DEFAULT 'pending' CHECK (manager_status IN ('pending','approved','rejected')),
  current_stage VARCHAR(30) DEFAULT 'admin_review' CHECK (current_stage IN ('submitted','admin_review','manager_review','completed')),
  admin_comment TEXT,
  manager_comment TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  admin_reviewed_at TIMESTAMPTZ,
  manager_reviewed_at TIMESTAMPTZ,
  admin_reviewer_id UUID REFERENCES users(id),
  manager_reviewer_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- From 003_add_bill_features.sql
  currency VARCHAR(10) DEFAULT 'USD',
  converted_amount NUMERIC(12,2),
  receipt_url TEXT,
  scanned_data JSONB,
  
  -- From add_batch_id_to_bills.sql
  batch_id UUID
);

CREATE INDEX IF NOT EXISTS idx_bills_current_stage ON bills(current_stage);
CREATE INDEX IF NOT EXISTS idx_bills_user_id ON bills(user_id);
CREATE INDEX IF NOT EXISTS idx_bills_batch_id ON bills(batch_id);

CREATE TABLE IF NOT EXISTS approval_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  step_sequence INT NOT NULL,
  approver_id UUID REFERENCES users(id),
  is_manager_approver BOOLEAN DEFAULT FALSE,
  condition_type VARCHAR(20) CHECK (condition_type IN ('percentage','specific','hybrid')),
  condition_value JSONB,
  UNIQUE(company_id, step_sequence)
);

CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES users(id),
  step INT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  comment TEXT,
  decided_at TIMESTAMPTZ
);

-- Initialize invite codes for existing companies (From 004)
UPDATE companies SET invite_code = substring(md5(random()::text) from 1 for 8) WHERE invite_code IS NULL;

-- 006_user_approval_status.sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
UPDATE users SET status = 'approved' WHERE status IS NULL;
ALTER TABLE users ALTER COLUMN status SET NOT NULL;
