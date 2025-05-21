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
    const emptyMap = createEmptyMap(60, 40)
    const specifics = createRooms(emptyMap, roomCount, "1234")
    setRoomSpecifics(specifics)
    setMap(emptyMap)
  }


  return (
    <div>
    <h1>2D Luolaston visualisointi</h1>
    <DungeonMap dungeon={map} tileSize={12} roomSpecifics={roomSpecifics}/>
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
