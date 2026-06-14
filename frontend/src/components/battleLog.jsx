import React from 'react'
import { useState, useEffect } from 'react';
import '../styles/battleLog.css'
import trophyIcon from '../assets/icon_trophy.png'


function BattleLog() {

    const brawlerImg = (id) => `https://cdn.brawlify.com/brawlers/borderless/${id}.png`;
    
    const modeImg = {
        gemGrab: `https://cdn.brawlify.com/game-modes/regular/48000000.png`,
        heist: `https://cdn.brawlify.com/game-modes/regular/48000002.png`,
        bounty: `https://cdn.brawlify.com/game-modes/regular/48000003.png`,
        brawlBall: `https://cdn.brawlify.com/game-modes/regular/48000005.png`,
        hotZone: `https://cdn.brawlify.com/game-modes/regular/48000017.png`,
        brawlArena: `https://cdn.brawlify.com/game-modes/regular/48000018.png`,
        knockout: `https://cdn.brawlify.com/game-modes/regular/48000020.png`,
        basketBrawl: `https://cdn.brawlify.com/game-modes/regular/48000022.png`,
        duels: `https://cdn.brawlify.com/game-modes/regular/48000024.png`,
        wipeout: `https://cdn.brawlify.com/game-modes/regular/48000025.png`,
        soloShowdown: `https://cdn.brawlify.com/game-modes/regular/48000042.png`,
        duoShowdown: `https://cdn.brawlify.com/game-modes/regular/48000042.png`,
    }

        const [ data, setData ] = useState(null);
      const [ loading, setLoading ] = useState(true);
    
      useEffect(() => {
        const url = '/api/battles/%23PVVG8J299';
    
        fetch(url) 
          .then ((res) => (res.json()))
          .then((res) => {
            setData(res)
            setLoading(false)
          })
          .catch((err) => {
            console.log(err)
            setLoading(false)
          }) 
      } 
        ,[]);
    
        if (loading) return <p>Loading...</p>
    
      //id, player_tag, battle_time, mode, map, result, brawler, trophies_change, is_star_player, raw_json, created_at
    
      //{row.id + row.player_tag + row.battle_time + row.mode + row.map + row.result + row.brawler + row.trophies_change + row.is_star_player + row.raw_json + row.created_at}
  const resultClass = (result) => {
    if (result === 'victory') return 'resultText victoryColor';
    if (result === 'defeat') return 'resultText defeatColor';
    return 'resultText';
  };

  return (
    <>
    {data.map((battle) => (
        <div className="battle" key={battle.id}>
          <div className="battle-header">
            {modeImg[battle.mode] && (
              <img className='modeImg' src={modeImg[battle.mode]} alt={battle.mode} width='32px' />
            )}
            {battle.mode} — {battle.map} — <span className={resultClass(battle.result)}> {battle.result}</span> — <span className='trophyText'>{battle.trophyChange ?? 0}</span> <img className='trophyImg' src={trophyIcon} width='32px' alt='trophy' />
          </div>

          <div className="teams">
            {battle.teams.map((team, teamIndex) => (
              <div className="team" key={teamIndex}>
                {team.map((player) => (
                  <div
                    className={`player${player.isMe ? ' is-me' : ''}${player.isStar ? ' is-star' : ''}`}
                    key={player.tag}
                  >
                    <img
                      src={brawlerImg(player.bId)}
                      alt={player.bName}
                      width='120px'
                      onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                    <div className='name'>{player.name}</div>
                    <div className='trophies'>
                      {!battle.ranked
                        ? <img src={`https://cdn.brawlify.com/ranked/tiered/580000${player.bTrophies - 1}.png`} alt={player.bTrophies} width='24px' onError={(e) => { e.target.style.display = 'none'; }} />
                        : player.bTrophies}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}</>
  )
}

export default BattleLog