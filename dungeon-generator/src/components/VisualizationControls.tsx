

export const VisualizationControls = ({ options, onChange }: {
  options: {
    showRooms: boolean
    showTriangles: boolean  
    showCircumcircles: boolean
    showRoomCenters: boolean
    showConnections: boolean
    showRoomNumbers: boolean
  }
  onChange: (key: string, value: boolean) => void
}) => (
  <div className="p-4 bg-gray-100 rounded-lg mb-4">
    <h3 className="font-bold mb-2">Visualisointi Asetukset:</h3>
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(options).map(([key, value]) => (
        <label key={key} className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            checked={value}
            onChange={(e) => onChange(key, e.target.checked)}
          />
          <span className="text-sm">
            {key === 'showRooms' && 'Näytä huoneet'}
            {key === 'showTriangles' && 'Näytä kolmiot'}
            {key === 'showCircumcircles' && 'Näytä ympyränkehät'}
            {key === 'showRoomCenters' && 'Näytä keskipisteet'}
            {key === 'showConnections' && 'Näytä yhteydet'}
            {key === 'showRoomNumbers' && 'Näytä numerot'}
          </span>
        </label>
      ))}
    </div>
  </div>
)