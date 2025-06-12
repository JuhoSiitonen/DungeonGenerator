import { useEffect, useRef, type JSX } from 'react'
import type { DungeonMapProps } from './types'

export const DungeonMap = ({ dungeon, tileSize = 10, roomSpecifics, visualOptions, triangulation, mstEdges }: DungeonMapProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 1. Piirrä luolasto pohja 
      dungeon.forEach((row, y) => {
        row.forEach((tile, x) => {
          switch (tile) {
            case 'empty':
              ctx.fillStyle = '#111'
              break
            case 'room':
              ctx.fillStyle = '#4caf50'
              break
            case 'corridor':
              ctx.fillStyle = '#2196f3'
              break
          }
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
        })
      })
    
      // 2. Piirrä kolmioiden reunat
      if (visualOptions.showTriangles) {
        ctx.strokeStyle = '#FFD700' // Kulta
        ctx.lineWidth = 3
        triangulation.forEach((triangle, index) => {
          ctx.beginPath()
          ctx.moveTo(triangle.coordinates[0].x * tileSize, triangle.coordinates[0].y * tileSize)
          ctx.lineTo(triangle.coordinates[1].x * tileSize, triangle.coordinates[1].y * tileSize)
          ctx.lineTo(triangle.coordinates[2].x * tileSize, triangle.coordinates[2].y * tileSize)
          ctx.closePath()
          ctx.stroke()
          
          // Kolmion numero keskelle
          if (visualOptions.showRoomNumbers) {
            const centerX = (triangle.coordinates[0].x + triangle.coordinates[1].x + triangle.coordinates[2].x) / 3 * tileSize
            const centerY = (triangle.coordinates[0].y + triangle.coordinates[1].y + triangle.coordinates[2].y) / 3 * tileSize
            ctx.fillStyle = 'yellow'
            ctx.font = '14px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(`T${index + 1}`, centerX, centerY)
          }
        })
      }

       // 2.5. Piirrä MST reunat
      if (visualOptions.showMST && mstEdges.length > 0) {
        ctx.strokeStyle = '#FF6B35' 
        ctx.lineWidth = 4
        ctx.setLineDash([5, 5]) 
        
        mstEdges.forEach((edge) => {
          ctx.beginPath()
          ctx.moveTo(edge.start.x * tileSize, edge.start.y * tileSize)
          ctx.lineTo(edge.end.x * tileSize, edge.end.y * tileSize)
          ctx.stroke()
        })
        
        ctx.setLineDash([])
      }
      
      // 3. Piirrä ympyränkehät
      if (visualOptions.showCircumcircles) {
        ctx.strokeStyle = '#FF4444' // Punainen
        ctx.lineWidth = 2
        triangulation.forEach((triangle) => {
          const circle = triangle.circumcircle
          ctx.beginPath()
          ctx.arc(
          circle.center.x * tileSize,
          circle.center.y * tileSize,
          circle.radius * tileSize,
          0,
          2 * Math.PI
          )
          ctx.stroke()
            
          // Ympyrän keskipiste
          ctx.fillStyle = '#FF4444'
          ctx.beginPath()
          ctx.arc(circle.center.x * tileSize, circle.center.y * tileSize, 3, 0, 2 * Math.PI)
          ctx.fill()
          
        })
      }
      
    
    
    // 4. Piirrä huoneiden keskipisteet ja numerot
    if (visualOptions.showRoomCenters) {
      roomSpecifics.forEach((room, index) => {
        // Piste  
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(room.xCenter * tileSize, room.yCenter * tileSize, 7, 0, 2 * Math.PI)
        ctx.fill()
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Numero
        if (visualOptions.showRoomNumbers) {
          ctx.fillStyle = 'black'
          ctx.font = 'bold 12px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(`${index + 1}`, room.xCenter * tileSize, room.yCenter * tileSize + 4)
        }
      })
    }
    
  }, [dungeon, mstEdges, roomSpecifics, tileSize, triangulation, visualOptions])

  return (
    <canvas
      ref={canvasRef}
      width={dungeon[0]?.length * tileSize || 600}
      height={dungeon.length * tileSize || 400}
      style={{ border: '2px solid #333', borderRadius: '8px' }}
    />
  )
}