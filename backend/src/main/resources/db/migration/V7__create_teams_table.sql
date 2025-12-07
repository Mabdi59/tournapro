BEGIN;

CREATE TABLE IF NOT EXISTS teams (
    id           BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL REFERENCES tournaments (id) ON DELETE CASCADE,
    name         VARCHAR(255) NOT NULL,
    short_name   VARCHAR(100),
    email        VARCHAR(255),
    country      VARCHAR(100),
    logo_url     VARCHAR(512),
    dressing_room VARCHAR(255),
    created_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_tournament_id
    ON teams (tournament_id);

COMMIT;
