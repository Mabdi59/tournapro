-- ********************************************************************************
-- This script creates the database users and grants them the necessary permissions
-- ********************************************************************************

CREATE USER tournapro_owner
WITH PASSWORD 'tournapro';

GRANT ALL
ON ALL TABLES IN SCHEMA public
TO tournapro_owner;

GRANT ALL
ON ALL SEQUENCES IN SCHEMA public
TO tournapro_owner;

CREATE USER tournapro_appuser
WITH PASSWORD 'tournapro';

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO tournapro_appuser;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO tournapro_appuser;
