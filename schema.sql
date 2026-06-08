-- Players we're tracking. Think of this as your "watchlist."
-- tag is the PRIMARY KEY — no two rows can have the same tag.
CREATE TABLE IF NOT EXISTS players (
  tag          TEXT PRIMARY KEY,  -- e.g. #ABC123 (always uppercase, with the #)
  name         TEXT,              -- display name from the API
  last_polled_at INTEGER,         -- Unix timestamp (seconds since 1970) of last successful poll
  created_at   INTEGER            -- when we added this player
);

-- Every battle we've ever captured. This is the core of the whole project.
CREATE TABLE IF NOT EXISTS battles (
  id              TEXT PRIMARY KEY,  -- we generate this: playerTag + "_" + battleTime (dedup key)
  player_tag      TEXT NOT NULL,
  battle_time     TEXT NOT NULL,     -- ISO timestamp from the API, e.g. "20240530T214500.000Z"
  mode            TEXT,              -- "gemGrab", "brawlBall", "heist", etc.
  map             TEXT,              -- map name, e.g. "Hard Rock Mine"
  result          TEXT,              -- "victory", "defeat", or "draw"
  brawler         TEXT,              -- which brawler you used
  trophies_change INTEGER,           -- how many trophies you gained/lost
  is_star_player  INTEGER DEFAULT 0, -- 1 if you were star player, 0 if not (SQLite has no boolean)
  raw_json        TEXT,              -- the full battle object from the API, saved for future use
  created_at      INTEGER,
  FOREIGN KEY (player_tag) REFERENCES players(tag)
);

-- Index so looking up battles by player_tag is fast (without this, every query scans every row)
CREATE INDEX IF NOT EXISTS idx_battles_player_tag ON battles(player_tag);
CREATE INDEX IF NOT EXISTS idx_battles_battle_time ON battles(player_tag, battle_time);

-- A snapshot of your brawler collection taken each poll.
-- We store these over time so we can see your brawler progression.
CREATE TABLE IF NOT EXISTS brawler_snapshots (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  player_tag    TEXT NOT NULL,
  brawler_name  TEXT NOT NULL,
  power         INTEGER,    -- power level 1-11
  trophies      INTEGER,    -- current trophies on this brawler
  snapshotted_at INTEGER,   -- when this snapshot was taken
  FOREIGN KEY (player_tag) REFERENCES players(tag)
);
