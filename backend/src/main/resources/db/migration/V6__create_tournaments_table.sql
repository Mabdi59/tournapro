BEGIN;

CREATE TABLE IF NOT EXISTS tournaments (
    id            BIGSERIAL PRIMARY KEY,
    owner_id      BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         VARCHAR(255) NOT NULL,
    primary_venue VARCHAR(255),
    start_date    DATE,
    created_at    TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

COMMIT;

