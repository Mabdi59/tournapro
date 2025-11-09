-- **************************************************************
-- This script destroys the database and associated users
-- **************************************************************

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'tournapro';

DROP DATABASE tournapro;

DROP USER tournapro_owner;
DROP USER tournapro_appuser;
