import { useState } from "react"
import { DungeonMap }  from "./components/DungeonMap.tsx"
import { createEmptyMap, createRoom } from "./components/dungeonMap"


function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [map, setMap] = useState(createEmptyMap(60, 40))
  
  const createSingleRoom = () => {
    createRoom(map)
    setMap([...map])
  }

  return (
    <div>
    <h1>2D Luolaston visualisointi</h1>
    <DungeonMap dungeon={map} tileSize={12} />
    <button onClick={createSingleRoom}>Luo huone</button>
  </div>
  )
}

export default App
