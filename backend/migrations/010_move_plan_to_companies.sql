-- Migration 010: Move plan and subscription fields from users to companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO', 'ENTERPRISE'));
ALTER TABLE companies ADD COLUMN IF NOT EXISTS plan_expiry TIMESTAMPTZ;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS razorpay_customer_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

-- Update existing companies based on admin user plans
UPDATE companies c
SET plan = COALESCE((SELECT u.plan FROM users u WHERE u.company_id = c.id AND u.role = 'admin' LIMIT 1), 'FREE'),
    plan_expiry = (SELECT u.plan_expiry FROM users u WHERE u.company_id = c.id AND u.role = 'admin' LIMIT 1),
    razorpay_customer_id = (SELECT u.razorpay_customer_id FROM users u WHERE u.company_id = c.id AND u.role = 'admin' LIMIT 1),
    razorpay_subscription_id = (SELECT u.razorpay_subscription_id FROM users u WHERE u.company_id = c.id AND u.role = 'admin' LIMIT 1),
    razorpay_order_id = (SELECT u.razorpay_order_id FROM users u WHERE u.company_id = c.id AND u.role = 'admin' LIMIT 1);

-- Optional: Depending on business rules, we might want to keep the plan column on users for legacy code 
-- or drop it. We'll keep it for now but the source of truth will be the companies table.
-- We will drop the plan column from users to avoid ambiguity.
ALTER TABLE users DROP COLUMN IF EXISTS plan;
ALTER TABLE users DROP COLUMN IF EXISTS plan_expiry;
ALTER TABLE users DROP COLUMN IF EXISTS razorpay_customer_id;
ALTER TABLE users DROP COLUMN IF EXISTS razorpay_subscription_id;
ALTER TABLE users DROP COLUMN IF EXISTS razorpay_order_id;
