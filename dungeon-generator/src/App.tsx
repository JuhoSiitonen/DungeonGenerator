import { useEffect, useState } from "react"
import { DungeonMap }  from "./components/DungeonMap.tsx"
import { VisualizationControls } from "./components/VisualizationControls.tsx"
import type { DungeonMapMatrix, RoomSpecifics } from "./components/types.ts"
import type { MST, Triangle } from "./components/algorithms/types.ts"
import { generateDungeon } from "./components/algorithms/generateDungeon.ts"

const stageDelay = 3000 // Millisekunteina, kuinka kauan jokainen vaihe kestää

const isDev = import.meta.env.MODE === 'development'

function App() {
  const [map, setMap] = useState<DungeonMapMatrix>([])
  const [roomCount, setRoomCount] = useState(0)
  const [roomSpecifics, setRoomSpecifics] = useState<RoomSpecifics[]>([])
  const [triangulation, setTriangulation] = useState<Triangle[]>([])
  const [mst, setMST] = useState<MST>({} as MST)
  const [allowDiagonal, setAllowDiagonal] = useState<boolean>(false)
  const [directRouting, setDirectRouting] = useState<boolean>(false)
  const [disableAnimation, setDisableAnimation] = useState<boolean>(false)
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
    if (map.length > 0 && !disableAnimation) {
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
    setVisualOptions(prev => ({
      ...prev,
      showTriangles: true,
      showCircumcircles: true
    }))
    
    await delay(stageDelay)
    
    // Vaihe 3: Näytä virittävänpuun reunat ja painot
    setVisualOptions(prev => ({
      ...prev,
      showMST: true,
      showMSTWeights: true,
      showCircumcircles: false
    }))
    
    await delay(stageDelay)
    
    // Vaihe 4: Näytä käytävät
    setVisualOptions(prev => ({
      ...prev,
      showCorridors: true,
      showTriangles: false, 
      showMSTWeights: false
    }))
    
    await delay(stageDelay)
    
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
          <div style={{ marginBottom: '16px' }}>
            <h3>Manuaalinen huoneiden lisäys</h3>
            {manualRoomInputs.map((room, index) => (
              <div key={index} style={{ 
                border: '1px solid #ccc', 
                padding: '12px', 
                margin: '8px 0', 
                borderRadius: '4px', 
              }}>
                <h4>Huone {index + 1}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <label>
                    Leveys:
                    <input 
                      type="number" 
                      value={room.width} 
                      onChange={(e) => updateManualRoom(index, 'width', Number(e.target.value))}
                      min={1}
                    />
                  </label>
                  <label>
                    Korkeus:
                    <input 
                      type="number" 
                      value={room.height} 
                      onChange={(e) => updateManualRoom(index, 'height', Number(e.target.value))}
                      min={1}
                    />
                  </label>
                  <label>
                    X keskikohta:
                    <input 
                      type="number" 
                      value={room.xCenter} 
                      onChange={(e) => updateManualRoom(index, 'xCenter', Number(e.target.value))}
                    />
                  </label>
                  <label>
                    Y keskikohta:
                    <input 
                      type="number" 
                      value={room.yCenter} 
                      onChange={(e) => updateManualRoom(index, 'yCenter', Number(e.target.value))}
                    />
                  </label>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeManualRoom(index)}
                  style={{ marginTop: '8px'}}
                >
                  Poista huone
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addManualRoom}
              style={{ margin: '8px 0' }}
            >
              Lisää huone
            </button>
          </div>
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
            checked={disableAnimation} 
            onChange={() => setDisableAnimation(prev => !prev)}
          />
          Poista animaatio käytöstä
        </label>
      </div>
      <VisualizationControls options={visualOptions} onChange={handleVisualOptionChange} />
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
