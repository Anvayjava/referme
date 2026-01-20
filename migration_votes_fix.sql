-- Migration: Fix votes table to use INTEGER instead of TEXT for vote_type
-- Run this if you already have the votes table with TEXT vote_type

-- Drop the existing constraint
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_vote_type_check;

-- Change the column type from TEXT to INTEGER
-- This will only work if the column is currently empty or has compatible values
-- If you have existing data, you'll need to handle the conversion

-- Option 1: If table is empty or you want to start fresh
-- TRUNCATE TABLE votes;
-- ALTER TABLE votes ALTER COLUMN vote_type TYPE INTEGER USING vote_type::INTEGER;

-- Option 2: If you have existing TEXT data ('upvote', 'downvote'), convert it
UPDATE votes SET vote_type =
  CASE
    WHEN vote_type::TEXT = 'upvote' THEN '1'
    WHEN vote_type::TEXT = 'downvote' THEN '-1'
  END
WHERE vote_type IN ('upvote', 'downvote');

-- Now change the type
ALTER TABLE votes ALTER COLUMN vote_type TYPE INTEGER USING vote_type::INTEGER;

-- Add the new constraint
ALTER TABLE votes ADD CONSTRAINT votes_vote_type_check CHECK (vote_type IN (1, -1));
