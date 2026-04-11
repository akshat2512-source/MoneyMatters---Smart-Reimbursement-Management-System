-- Add Google Auth fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Password can be nullable for Google-only accounts
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
