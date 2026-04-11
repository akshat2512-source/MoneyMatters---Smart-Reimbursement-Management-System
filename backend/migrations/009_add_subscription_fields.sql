-- Migration 009: Add subscription and Razorpay fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO', 'ENTERPRISE'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expiry TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS razorpay_customer_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

-- Update existing users to FREE plan if they don't have one
UPDATE users SET plan = 'FREE' WHERE plan IS NULL;
ALTER TABLE users ALTER COLUMN plan SET NOT NULL;
