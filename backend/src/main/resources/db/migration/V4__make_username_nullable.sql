-- Make username column nullable to match the JPA entity
-- This migration drops the NOT NULL constraint on users.username

ALTER TABLE IF EXISTS users
    ALTER COLUMN username DROP NOT NULL;

