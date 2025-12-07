-- Flyway migration V5: Remove all non-user tables and ensure `users` table exists
-- This migration is destructive: it drops application tables other than `users`.
-- Run only if you truly want to keep only the users table.

BEGIN;

-- Drop common domain tables (use CASCADE to remove FKs/indexes)
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS divisions CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;

-- Drop possible join/aux tables if present
DROP TABLE IF EXISTS tournament_teams CASCADE;
DROP TABLE IF EXISTS division_teams CASCADE;
DROP TABLE IF EXISTS match_participants CASCADE;

-- Ensure the users table exists with the expected columns. If it already exists, this will do nothing.
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    enabled BOOLEAN
);

COMMIT;

