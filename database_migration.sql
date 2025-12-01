-- DATABASE MIGRATION: Add players table and match updates
    EXECUTE FUNCTION update_updated_at_column();
    FOR EACH ROW
    BEFORE UPDATE ON players
CREATE TRIGGER update_players_updated_at
DROP TRIGGER IF EXISTS update_players_updated_at ON players;

$$ language 'plpgsql';
END;
   RETURN NEW;
   NEW.updated_at = CURRENT_TIMESTAMP;
BEGIN
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
-- Trigger function to update updated_at

CREATE INDEX IF NOT EXISTS idx_matches_bracket_type ON matches(bracket_type);
CREATE INDEX IF NOT EXISTS idx_matches_venue ON matches(venue);
CREATE INDEX IF NOT EXISTS idx_players_goals ON players(goals DESC);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);

);
    CONSTRAINT uk_team_jersey UNIQUE (team_id, jersey_number)
      REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_player_team FOREIGN KEY (team_id)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    points INTEGER DEFAULT 0,
    red_cards INTEGER DEFAULT 0,
    yellow_cards INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    goals INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    team_id BIGINT NOT NULL,
    phone_number VARCHAR(50),
    email VARCHAR(100),
    position VARCHAR(50),
    jersey_number INTEGER,
    name VARCHAR(100) NOT NULL,
    id BIGSERIAL PRIMARY KEY,
CREATE TABLE IF NOT EXISTS players (

  ADD COLUMN IF NOT EXISTS scheduled_time TIMESTAMP;
ALTER TABLE matches

  ADD COLUMN IF NOT EXISTS bracket_type VARCHAR(20);
ALTER TABLE matches

  ADD COLUMN IF NOT EXISTS venue VARCHAR(500);
ALTER TABLE matches


