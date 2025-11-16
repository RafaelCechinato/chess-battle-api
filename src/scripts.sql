CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    birth_date DATE,
    ranking INTEGER DEFAULT 400 NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant VARCHAR(20) NOT NULL,
  current_turn VARCHAR(10) NOT NULL,
  board_state JSONB NOT NULL,
  move_history JSONB NOT NULL DEFAULT '[]',
  captured_pieces JSONB NOT NULL DEFAULT '[]',
  is_game_over BOOLEAN DEFAULT FALSE,
  winner VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE game_players (
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  player_id serial REFERENCES users(id) ON DELETE CASCADE,
  color VARCHAR(10) NOT NULL,
  PRIMARY KEY (game_id, player_id)
);

CREATE INDEX idx_games_created_at ON games(created_at DESC);
CREATE INDEX idx_games_variant ON games(variant);