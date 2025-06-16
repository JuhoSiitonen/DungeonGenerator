import type { VisualOptions } from "./types"


export const VisualizationControls = ({ options, onChange }: {
  options: VisualOptions
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
            {key === 'showCircumcircles' && 'Näytä ympyränkehät'}
            {key === 'showTriangles' && 'Näytä kolmiot'}
            {key === 'showRoomNumbers' && 'Näytä numerot'}
            {key === 'showMST' && 'Näytä MST'}
            {key === 'showMSTWeights' && ' Näytä MST painot'}
            {key === 'showCorridors' && 'Näytä käytävät'}
          </span>
        </label>
      ))}
    </div>
  </div>
)