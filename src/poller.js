import {getPlayers, insertBattle, updateLastPolled} from './lib/db.js';
import {getPlayerBattleLog} from './lib/brawlstars.js';
import {battleId} from './lib/dedup.js';

export async function runPoller(env) {
    const players = await getPlayers(env)
    for (const player of players) {
        let battleLog = await getPlayerBattleLog(player.tag, env.BRAWL_API_KEY)
        for (const battle of battleLog) {
 
            const allPlayers = battle.battle.teams
                ? battle.battle.teams.flat()
                : battle.battle.players ?? [];
            const me = allPlayers.find(p => p.tag === player.tag);
            const brawler = me.brawler.name;
            let starPlayer = null;
            //optional chaining needed as starPLare doesnt exist in showdown
            if (battle.battle.starPlayer?.tag == player.tag) {
                starPlayer = true;
            } else {
                starPlayer = false;
            }
            let result = null
            if (battle.battle.result) {
                result = battle.battle.result
            } else if (battle.battle.rank) {
                result = `rank_${battle.battle.rank}`;
            }

            let trophyChange = null;
            if (battle.battle.trophyChange) {
                trophyChange = battle.battle.trophyChange
            } else {
                trophyChange = null;
            }

            const battleObj = { id: battleId(player.tag, battle.battleTime), player_tag: player.tag, battle_time: battle.battleTime, mode: battle.event.mode, map: battle.event.map, result: result, brawler: brawler, trophies_change: trophyChange, is_star_player: starPlayer, raw_json: JSON.stringify(battle), created_at: Date.now()}
            //id, player_tag, battle_time, mode, map, result, brawler, trophies_change, is_star_player, raw_json, created_at
            console.log(JSON.stringify(battleObj)); 

            await insertBattle(env, battleObj)
        }
        await updateLastPolled(env, player.tag)
    }
}