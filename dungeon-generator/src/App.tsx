import { useState } from "react"
import { DungeonMap }  from "./components/DungeonMap.tsx"
import { createEmptyMap, createRooms } from "./components/dungeonMap"

export interface RoomSpecifics {
  width: number,
  height: number,
  xCenter: number,
  yCenter: number
}

function App() {
  const [map, setMap] = useState(createEmptyMap(60, 40))
  const [roomCount, setRoomCount] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [roomSpecifics, setRoomSpecifics] = useState<RoomSpecifics[]>([])
  
  const generateRooms = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setMap(createEmptyMap(60, 40))
    setRoomSpecifics(createRooms(map, roomCount))
    setMap([...map])
  }

  return (
    <div>
    <h1>2D Luolaston visualisointi</h1>
    <DungeonMap dungeon={map} tileSize={12} />
    <form onSubmit={generateRooms}>
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
