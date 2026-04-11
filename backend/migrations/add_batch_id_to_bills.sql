-- Migration: Add batch_id to bills table
-- Run once against your PostgreSQL database
-- Safe to run multiple times (uses IF NOT EXISTS)

ALTER TABLE bills ADD COLUMN IF NOT EXISTS batch_id UUID;
CREATE INDEX IF NOT EXISTS idx_bills_batch_id ON bills(batch_id);
