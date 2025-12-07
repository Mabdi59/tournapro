-- Flyway migration: enlarge player text columns to match entity definitions
-- Adjusts name, email, position and phone_number column sizes to avoid "value too long" errors

ALTER TABLE IF EXISTS players
    ALTER COLUMN name TYPE varchar(100);

ALTER TABLE IF EXISTS players
    ALTER COLUMN email TYPE varchar(100);

ALTER TABLE IF EXISTS players
    ALTER COLUMN position TYPE varchar(50);

ALTER TABLE IF EXISTS players
    ALTER COLUMN phone_number TYPE varchar(20);

