#!/bin/bash
set -e
export PGPASSWORD='postgres1'
BASEDIR="$(dirname "$0")"
DATABASE="tournapro"

psql -U postgres -f "$BASEDIR/dropdb.sql" || true
createdb -U postgres "$DATABASE"
psql -U postgres -d "$DATABASE" -f "$BASEDIR/schema.sql"
psql -U postgres -d "$DATABASE" -f "$BASEDIR/data.sql"
psql -U postgres -d "$DATABASE" -f "$BASEDIR/user.sql"
