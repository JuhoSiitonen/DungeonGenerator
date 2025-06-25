import { useEffect, useState } from "react"
import { DungeonMap }  from "./components/DungeonMap.tsx"
import { VisualizationControls } from "./components/VisualizationControls.tsx"
import type { DungeonMapMatrix, RoomSpecifics } from "./components/types.ts"
import type { MST, Triangle } from "./components/algorithms/types.ts"
import { generateDungeon } from "./components/algorithms/generateDungeon.ts"
import { ManualRoomInput } from "./components/ManualRoomInput.tsx"

const stageDelay = 3000 // Millisekunteina, kuinka kauan jokainen vaihe kestää

const isDev = import.meta.env.MODE === 'development'

const stageNames = [
  "Vaihe 1: Huoneiden sijoittelu",
  "Vaihe 2: Delaunay-triangulaatio",
  "Vaihe 3: Virittävä puu (MST)",
  "Vaihe 4: Käytävien luominen",
  "Valmis luolasto"
]

function App() {
  const [map, setMap] = useState<DungeonMapMatrix>([])
  const [roomCount, setRoomCount] = useState(0)
  const [roomSpecifics, setRoomSpecifics] = useState<RoomSpecifics[]>([])
  const [triangulation, setTriangulation] = useState<Triangle[]>([])
  const [mst, setMST] = useState<MST>({} as MST)
  const [allowDiagonal, setAllowDiagonal] = useState<boolean>(false)
  const [directRouting, setDirectRouting] = useState<boolean>(false)
  const [showAnimation, setShowAnimation] = useState<boolean>(false)
  const [currentStage, setCurrentStage] = useState<number>(-1)
  const [visualOptions, setVisualOptions] = useState({
    showCircumcircles: false,
    showTriangles: false,
    showRoomNumbers: false,
    showMST: false,
    showMSTWeights: false,
    showCorridors: false,
  })

  const [manualRoomInputs, setManualRoomInputs] = useState<RoomSpecifics[]>([])
  const [useManualInput, setUseManualInput] = useState(false)

  const seed = isDev ? "1234" : crypto.randomUUID().slice(0, 4) // Käytä kiinteää seed arvoa kehityksessä, muuten satunnainen

  useEffect(() => {
    if (map.length > 0 && showAnimation) {
      startStagedGeneration()
    }
  }, [map])
  
  const generateRooms = (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (useManualInput) {
      const { roomSpecifics, map, triangulation, mst } = generateDungeon(roomCount, seed, 'astar', allowDiagonal, directRouting, manualRoomInputs)
      setMap(map)
      setTriangulation(triangulation)
      setMST(mst)
      setRoomSpecifics(roomSpecifics)
    } else {
      const { roomSpecifics, map, triangulation, mst } = generateDungeon(roomCount, seed, 'astar', allowDiagonal, directRouting)
      setMap(map)
      setTriangulation(triangulation)
      setMST(mst)
      setRoomSpecifics(roomSpecifics)
    }
  }

  const handleVisualOptionChange = (key: string, value: boolean): void => {
    setVisualOptions(prev => ({ ...prev, [key]: value }))
  }

  const addManualRoom = () => {
    setManualRoomInputs(prev => [...prev, { width: 4, height: 4, xCenter: 10, yCenter: 15 }])
  }

  const removeManualRoom = (index: number): void => {
    setManualRoomInputs(prev => prev.filter((_, i) => i !== index))
  }

  const updateManualRoom = (index: number, field: keyof RoomSpecifics, value: number): void => {
    setManualRoomInputs(prev => 
      prev.map((room, i) => 
        i === index ? { ...room, [field]: value } : room
      )
    )
  }

  const startStagedGeneration = async () => {
    // Vaihe 1 : ainoastaan huoneet ja niiden numerot
    setCurrentStage(0)
    setVisualOptions(prev => ({
      ...prev,
      showRoomNumbers: true,
      showTriangles: false,
      showMST: false,
      showCorridors: false,
      showCircumcircles: false,
      showMSTWeights: false
    }))
    
    await delay(stageDelay)
    
    // Vaihe 2: Näytä triangulaatio ja ympyränkehät
    setCurrentStage(1)
    setVisualOptions(prev => ({
      ...prev,
      showTriangles: true,
      showCircumcircles: true
    }))
    
    await delay(stageDelay)
    
    // Vaihe 3: Näytä virittävänpuun reunat ja painot
    setCurrentStage(2)
    setVisualOptions(prev => ({
      ...prev,
      showMST: true,
      showMSTWeights: true,
      showCircumcircles: false
    }))
    
    await delay(stageDelay)
    
    // Vaihe 4: Näytä käytävät
    setCurrentStage(3)
    setVisualOptions(prev => ({
      ...prev,
      showCorridors: true,
      showTriangles: false, 
      showMSTWeights: false
    }))
    
    await delay(stageDelay)
    
    setCurrentStage(4)
    setVisualOptions(prev => ({
      ...prev,
      showRoomNumbers: false,
      showTriangles: false,
      showCircumcircles: false,
      showMST: false,
      showMSTWeights: false,
      showCorridors: true
    }))
  }

  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  return (
    <div>
      <h1>2D Luolaston generointi</h1>
        <form onSubmit={generateRooms}>
          <div style={{ marginBottom: '16px' }}>
            <label>
              <input 
                type="checkbox" 
                checked={useManualInput} 
                onChange={(e) => setUseManualInput(e.target.checked)}
              />
              Syötä huoneet manuaalisesti
            </label>
          </div>
        {useManualInput ? (
          <ManualRoomInput 
            rooms={manualRoomInputs}
            onAddRoom={addManualRoom}
            onRemoveRoom={removeManualRoom}
            onUpdateRoom={updateManualRoom}
          />
        ) : (
          <label>
            Huoneiden määrä:
            <input 
              type="number" 
              value={roomCount} 
              onChange={(e) => setRoomCount(Number(e.target.value))} 
              max={10}
            />
          </label>
        )}
        
        <button type="submit">Luo</button>
      </form>
      <div style={{ marginBottom: '16px', marginTop: '16px', display: 'flex', flexDirection: 'row', gap: '8px' }}>
        <label>
          <input 
            type="checkbox" 
            checked={allowDiagonal} 
            onChange={() => setAllowDiagonal(prev => !prev)}
          />
          Reititys sallittu diagonaalisesti
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={directRouting} 
            onChange={() => setDirectRouting(prev => !prev)}
          />
          Suorat reitit
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={showAnimation} 
            onChange={() => setShowAnimation(prev => !prev)}
          />
          Esitä algoritmin vaiheet
        </label>
      </div>
      <VisualizationControls options={visualOptions} onChange={handleVisualOptionChange} />
       {showAnimation && currentStage >= 0 && (
        <div style={{ 
          backgroundColor: '#f0f8ff', 
          padding: '12px', 
          margin: '16px 0', 
          borderRadius: '8px',
          border: '2px solid #4a90e2',
          textAlign: 'center',
          width: '100%',
          maxWidth: '935px',
        }}>
          <h2 style={{ margin: 0, color: '#2c5282' }}>
            {stageNames[currentStage]}
          </h2>
        </div>
      )}
      {map.length > 0 &&
      <DungeonMap 
        dungeon={map} 
        tileSize={12} 
        roomSpecifics={roomSpecifics} 
        visualOptions={visualOptions}
        triangulation={triangulation}
        mst={mst}
      />
     }
    </div>
  )
}

export default App
