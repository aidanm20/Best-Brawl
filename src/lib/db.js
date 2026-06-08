export async function getPlayers(env) {
    const result = await env.DB.prepare('SELECT * FROM players').all();
    return result.results;
}

export async function upsertPlayer(env, tag, name) {
    return env.DB.prepare(`
  INSERT OR REPLACE INTO players (tag, name, created_at) 
  VALUES (?, ?, ?)
`)
        .bind(tag, name, Date.now())
        .run() 
}

export async function insertBattle(env, battle) {
    return env.DB.prepare(`
        INSERT OR IGNORE INTO battles (id, player_tag, battle_time, mode, map, result, brawler, trophies_change, is_star_player, raw_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `) 
        .bind(battle.id, battle.player_tag, battle.battle_time, battle.mode, battle.map, battle.result, battle.brawler, battle.trophies_change, battle.is_star_player, battle.raw_json, battle.created_at).run()
}

export async function updateLastPolled(env, tag) {
    return env.DB.prepare(`UPDATE players SET last_polled_at = ? WHERE tag = ?`)
        .bind(Date.now(), tag)
        .run();
}

export async function getBattles(env, tag, limit) {
    const result = await env.DB.prepare(`SELECT * FROM battles WHERE player_tag = ? ORDER BY battle_time DESC LIMIT ?`)
    .bind(tag, limit).all();
    return result.results;
}
/*
getPlayers(env) — returns all rows from the players table. Every player we're tracking.

upsertPlayer(env, tag, name) — inserts a player, or replaces them if they already exist. Look up INSERT OR REPLACE INTO for SQLite syntax.

insertBattle(env, battle) — inserts one battle row. Use INSERT OR IGNORE so duplicates are silently skipped.

getBattles(env, tag, limit) — returns battles for a specific player tag, ordered by battle_time descending (newest first), up to limit rows*/