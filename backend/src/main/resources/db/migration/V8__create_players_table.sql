BEGIN;

CREATE TABLE IF NOT EXISTS players (
    id           BIGSERIAL PRIMARY KEY,
    team_id      BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name         VARCHAR(255) NOT NULL,
    dob          DATE,
    number       INTEGER,
    created_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_team_id
    ON players (team_id);

COMMIT;

