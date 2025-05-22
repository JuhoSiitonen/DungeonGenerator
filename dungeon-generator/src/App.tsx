import { useState } from "react"
import { DungeonMap }  from "./components/DungeonMap.tsx"
import { createMapAndRooms, type DungeonMapMatrix } from "./components/dungeonMap"

export interface RoomSpecifics {
  width: number,
  height: number,
  xCenter: number,
  yCenter: number
}

function App() {
  const [map, setMap] = useState<DungeonMapMatrix>([])
  const [roomCount, setRoomCount] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roomSpecifics, setRoomSpecifics] = useState<RoomSpecifics[]>([])
  
  const generateRooms = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const { roomSpecifics, map } = createMapAndRooms( roomCount, "1234")
    setMap(map)
    setRoomSpecifics(roomSpecifics)
  }


  return (
    <div>
    <h1>2D Luolaston visualisointi</h1>
    <form onSubmit={generateRooms}>
      <label>
        Huoneiden määrä:
        <input type="number" value={roomCount} onChange={(e) => setRoomCount(Number(e.target.value))} max={10}/>
      </label>
      <button type="submit">Luo</button>
    </form>    
    {map.length > 0 &&
    <DungeonMap dungeon={map} tileSize={12} roomSpecifics={roomSpecifics}/>
   }
    
  </div>
  )
}

export default App
