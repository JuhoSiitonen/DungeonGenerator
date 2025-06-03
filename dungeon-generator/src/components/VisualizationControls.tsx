

export const VisualizationControls = ({ options, onChange }: {
  options: {
    showTriangles: boolean  
    showCircumcircles: boolean
    showRoomCenters: boolean
    showRoomNumbers: boolean
    showMST: boolean
  }
  onChange: (key: string, value: boolean) => void
}) => (
  <div>
    <h3>Visualisointi Asetukset:</h3>
    <div>
      {Object.entries(options).map(([key, value]) => (
        <label key={key}>
          <input 
            type="checkbox" 
            checked={value}
            onChange={(e) => onChange(key, e.target.checked)}
          />
          <span>
            {key === 'showTriangles' && 'Näytä kolmiot'}
            {key === 'showCircumcircles' && 'Näytä ympyränkehät'}
            {key === 'showRoomCenters' && 'Näytä keskipisteet'}
            {key === 'showRoomNumbers' && 'Näytä numerot'}
            {key === 'showMST' && 'Näytä MST'}
          </span>
        </label>
      ))}
    </div>
  </div>
)