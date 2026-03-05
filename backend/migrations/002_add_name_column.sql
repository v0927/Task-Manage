-- Migration: Add name column to users table
-- Description: Adds name field to store user's full name
-- Created: 2026-02-28

ALTER TABLE users ADD COLUMN name VARCHAR(255);

-- Set default name for existing users
UPDATE users SET name = SPLIT_PART(email, '@', 1) WHERE name IS NULL;
