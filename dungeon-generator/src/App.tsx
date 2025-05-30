import { useState } from "react"
import { DungeonMap }  from "./components/DungeonMap.tsx"
import { createMapAndRooms } from "./components/dungeonMap"
import { VisualizationControls } from "./components/VisualizationControls.tsx"
import type { DungeonMapMatrix } from "./components/types.ts"

export interface RoomSpecifics {
  width: number,
  height: number,
  xCenter: number,
  yCenter: number
}

function App() {
  const [map, setMap] = useState<DungeonMapMatrix>([])
  const [roomCount, setRoomCount] = useState(0)
  const [roomSpecifics, setRoomSpecifics] = useState<RoomSpecifics[]>([])
   const [visualOptions, setVisualOptions] = useState({
    showTriangles: true,
    showCircumcircles: true,
    showRoomCenters: true,
    showRoomNumbers: true
  })
  
  const generateRooms = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const { roomSpecifics, map } = createMapAndRooms( roomCount, "1234")
    setMap(map)
    setRoomSpecifics(roomSpecifics)
  }

  const handleVisualOptionChange = (key: string, value: boolean) => {
    setVisualOptions(prev => ({ ...prev, [key]: value }))
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
      <VisualizationControls options={visualOptions} onChange={handleVisualOptionChange} />
      {map.length > 0 &&
      <DungeonMap dungeon={map} tileSize={12} roomSpecifics={roomSpecifics} visualOptions={visualOptions}/>
     }
    </div>
  )
}

export default App
