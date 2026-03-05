-- Migration: Add first_login column to users table
-- Description: Adds a boolean column to track if user has completed onboarding
-- Created: 2024

ALTER TABLE users ADD COLUMN first_login BOOLEAN DEFAULT true;

-- Update existing users to have first_login = false since they already have tasks/accounts
UPDATE users SET first_login = false WHERE id IS NOT NULL;
