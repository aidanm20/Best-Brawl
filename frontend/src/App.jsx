 
import './App.css'
import { useState, useEffect } from 'react';

 

function App() { 
  
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
  return ( 
    <>
      {data.map((row) => (
        <div className='item' key={row.id}> {row.mode}
        </div>
      ))}
    </>
  )
}

export default App
