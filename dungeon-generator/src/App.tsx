import { useState } from "react"
import { DungeonMap }  from "./components/DungeonMap.tsx"
import { createEmptyMap, createRoom } from "./components/dungeonMap"


function App() {
  const [map, setMap] = useState(createEmptyMap(60, 40))
  const [roomCount, setRoomCount] = useState(0)
  
  const createRooms = (e: React.SyntheticEvent) => {
    e.preventDefault()
    createRoom(map, roomCount)
    setMap([...map])
  }

  return (
    <div>
    <h1>2D Luolaston visualisointi</h1>
    <DungeonMap dungeon={map} tileSize={12} />
    <form onSubmit={createRooms}>
      <label>
        Huoneiden määrä:
        <input type="number" value={roomCount} onChange={(e) => setRoomCount(Number(e.target.value))} max={20}/>
      </label>
      <button type="submit">Luo</button>
    </form>    
  </div>
  )
}

export default App
