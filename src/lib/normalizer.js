export function normalizeBattle(item, trackedTag) {
    
    let me = trackedTag.toUpperCase().replace(/\s/g, ""); 
    if (me.charAt(0) != '#') {
        me = '#' + me;
    }

    let battle = item.battle;

    let groups = battle.teams ? battle.teams : [battle.players]
    let starPlayer = battle.starPlayer ? battle.starPlayer.tag : null;

    //me, teams (username, brawlerID, brawler Name,trophies, power ), 

    /*
    example from official API
    "teams": [
          [
            {
              "tag": "#2LY29R2RGJ",
              "name": "bobisselling",
              "brawler": {
                "id": 16000079,
                "name": "ANGELO",
                "power": 11,
                "trophies": 890
              }
            },
    players:
            {
            "tag": "#8JGQ98Q9",
            "name": "CHROSS⚡VOLT",
            "brawler": {
              "id": 16000038,
              "name": "SURGE",
              "power": 11,
              "trophies": 807
            }
          },
*/
    let teams = groups.map(group => (
        group.map(p => ({
            tag: p.tag, name: p.name, bName: p.brawler.name, bPower: p.brawler.power, bId: p.brawler.id, bTrophies: p.brawler.trophies, isStar: (starPlayer === p.tag) ? true : false, isMe: (me === p.tag) ? true : false, 
        }))
    ))
    let trophyChanged = null;
    if (battle.trophyChange > 0) {
        trophyChanged = '+' + battle.trophyChange
    } else {
        trophyChanged = battle.trophyChange
    }

    return {
        battleTime: item.battleTime, mode: item.event.mode, map: item.event.map,   trophyChange: trophyChanged, result: battle.result ?? (battle.rank ? `rank_${battle.rank}` : null), teams: teams, ranked: battle.type?.includes('ranked') ?? false
    }
}