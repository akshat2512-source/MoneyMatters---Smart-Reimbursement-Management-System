-- Migration: Add Fraud Detection fields to bills table
ALTER TABLE bills 
ADD COLUMN IF NOT EXISTS is_suspicious BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fraud_reason TEXT,
ADD COLUMN IF NOT EXISTS receipt_hash TEXT;

-- Index for fast lookup of duplicate receipts
CREATE INDEX IF NOT EXISTS idx_bills_receipt_hash ON bills(receipt_hash);
