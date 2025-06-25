import type { ManualRoomInputProps } from "./types"

export function ManualRoomInput({ 
  rooms, 
  onAddRoom, 
  onRemoveRoom, 
  onUpdateRoom 
}: ManualRoomInputProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3>Manuaalinen huoneiden lisäys</h3>
      {rooms.map((room, index) => (
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
                onChange={(e) => onUpdateRoom(index, 'width', Number(e.target.value))}
                min={1}
              />
            </label>
            <label>
              Korkeus:
              <input 
                type="number" 
                value={room.height} 
                onChange={(e) => onUpdateRoom(index, 'height', Number(e.target.value))}
                min={1}
              />
            </label>
            <label>
              X keskikohta:
              <input 
                type="number" 
                value={room.xCenter} 
                onChange={(e) => onUpdateRoom(index, 'xCenter', Number(e.target.value))}
              />
            </label>
            <label>
              Y keskikohta:
              <input 
                type="number" 
                value={room.yCenter} 
                onChange={(e) => onUpdateRoom(index, 'yCenter', Number(e.target.value))}
              />
            </label>
          </div>
          <button 
            type="button" 
            onClick={() => onRemoveRoom(index)}
            style={{ marginTop: '8px'}}
          >
            Poista huone
          </button>
        </div>
      ))}
      <button 
        type="button" 
        onClick={onAddRoom}
        style={{ margin: '8px 0' }}
      >
        Lisää huone
      </button>
    </div>
  )
}