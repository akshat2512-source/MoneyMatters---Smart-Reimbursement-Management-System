-- 006_user_approval_status.sql

-- Add status column with enum-like check constraint
-- Default is 'pending' for new signups
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add tracking for who approved/rejected the user and when
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Auto-approve existing users so they don't get locked out
UPDATE users SET status = 'approved' WHERE status IS NULL;
ALTER TABLE users ALTER COLUMN status SET NOT NULL;
