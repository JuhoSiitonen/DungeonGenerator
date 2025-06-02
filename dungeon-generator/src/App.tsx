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

const ENV = import.meta.env.MODE || 'production'
const isDevOrPreProd = ENV === 'development' 

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

  const [manualRoomInputs, setManualRoomInputs] = useState<RoomSpecifics[]>([])
  const [useManualInput, setUseManualInput] = useState(false)
  
  const generateRooms = (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (isDevOrPreProd && useManualInput) {
      const { roomSpecifics: manualCorrectedSpecifics, map } = createMapAndRooms(manualRoomInputs.length, "1234", manualRoomInputs)
      setMap(map)
      setRoomSpecifics(manualCorrectedSpecifics)
    } else {
      const { roomSpecifics, map } = createMapAndRooms(roomCount, "1234")
      setMap(map)
      setRoomSpecifics(roomSpecifics)
    }
  }

  const handleVisualOptionChange = (key: string, value: boolean) => {
    setVisualOptions(prev => ({ ...prev, [key]: value }))
  }

  const addManualRoom = () => {
    setManualRoomInputs(prev => [...prev, { width: 4, height: 4, xCenter: 10, yCenter: 15 }])
  }

  const removeManualRoom = (index: number) => {
    setManualRoomInputs(prev => prev.filter((_, i) => i !== index))
  }

  const updateManualRoom = (index: number, field: keyof RoomSpecifics, value: number) => {
    setManualRoomInputs(prev => 
      prev.map((room, i) => 
        i === index ? { ...room, [field]: value } : room
      )
    )
  }


  return (
    <div>
      <h1>2D Luolaston visualisointi</h1>
         {isDevOrPreProd && (
          <div style={{ 
          padding: '8px', 
          border: '1px solid #2196f3', 
          borderRadius: '4px', 
          marginBottom: '16px' 
        }}>
          <strong> Testiympäristö manuaalinen huoneiden syöttö mahdollinen </strong>
        </div>
      )}
        <form onSubmit={generateRooms}>
        {isDevOrPreProd && (
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
        )}

        {isDevOrPreProd && useManualInput ? (
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
      <VisualizationControls options={visualOptions} onChange={handleVisualOptionChange} />
      {map.length > 0 &&
      <DungeonMap dungeon={map} tileSize={12} roomSpecifics={roomSpecifics} visualOptions={visualOptions}/>
     }
    </div>
  )
}

export default App
