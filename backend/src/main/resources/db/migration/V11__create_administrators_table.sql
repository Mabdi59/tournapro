BEGIN;

CREATE TABLE IF NOT EXISTS administrators (
    id           BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    email        VARCHAR(255) NOT NULL,
    rights       TEXT,
    created_at   TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_administrators_tournament_email
    ON administrators (tournament_id, lower(email));

COMMIT;

