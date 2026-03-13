-- Migration: Add status column to tasks table
-- Description: Adds a status column to track task progress (pending, in_progress, completed)
-- Created: 2026-03-11

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Add constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tasks_status_check'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN ('pending', 'in_progress', 'completed'));
  END IF;
END $$;

-- Update existing completed tasks to have status = 'completed'
UPDATE tasks SET status = 'completed' WHERE completed = true AND status IS NULL;

-- Update existing pending tasks to have status = 'pending'
UPDATE tasks SET status = 'pending' WHERE completed = false AND status IS NULL;
