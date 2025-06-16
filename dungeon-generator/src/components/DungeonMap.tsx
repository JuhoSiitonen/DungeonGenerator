import { useEffect, useRef, type JSX } from 'react'
import type { DungeonMapProps } from './types'
import { calculateDistance } from './algorithms/helpers'

export const DungeonMap = ({ dungeon, tileSize = 10, roomSpecifics, visualOptions, triangulation, mst, mstEdges }: DungeonMapProps): JSX.Element => {
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

      // Piirrä ympyränkehät
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
  
      // Piirrä kolmioiden reunat
    if (visualOptions.showTriangles) {
      ctx.strokeStyle = '#FFD700' // Kulta
      ctx.lineWidth = 3
      triangulation.forEach((triangle, index) => {
        const [p1, p2, p3] = triangle.coordinates;
  
        ctx.beginPath()
        ctx.moveTo(p1.x * tileSize, p1.y * tileSize)
        ctx.lineTo(p2.x * tileSize, p2.y * tileSize)
        ctx.lineTo(p3.x * tileSize, p3.y * tileSize)
        ctx.closePath()
        ctx.stroke()

        // Esitetään MST "painot", eli etäisyydet eri pisteiden välillä, tässä piirretään kaikkien 
        // reunojen painot, mutta seuraavassa osassa koodia piirretään vain MST:n reunojen painot
        if (visualOptions.showMSTWeights) {
          const edges = [
            { a: p1, b: p2 },
            { a: p2, b: p3 },
            { a: p3, b: p1 }
          ];
  
          edges.forEach(edge => {
            const midX = (edge.a.x + edge.b.x) / 2 * tileSize
            const midY = (edge.a.y + edge.b.y) / 2 * tileSize
            
            const weight = calculateDistance(edge.a, edge.b);
      
            // Tausta tekstille
            ctx.fillStyle = 'rgba(241, 148, 138)' // Punertava tausta
            ctx.beginPath()
            ctx.arc(midX, midY, 10, 0, 2 * Math.PI)
            ctx.fill()
            
            // Painoarvo
            ctx.fillStyle = '#17202a' // Tumma teksti
            ctx.font = 'bold 9px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(weight.toFixed(1), midX, midY + 3)
          });
        }
    
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

      // Piirrä MST reunat ja painot
    if (visualOptions.showMST && mst.edges.length > 0) {
      ctx.strokeStyle = '#FF6B35' 
      ctx.lineWidth = 4
      ctx.setLineDash([5, 5]) 
    
      mst.edges.forEach((edge) => {
        ctx.beginPath()
        ctx.moveTo(edge.a.x * tileSize, edge.a.y * tileSize)
        ctx.lineTo(edge.b.x * tileSize, edge.b.y * tileSize)
        ctx.stroke()
      
        if (visualOptions.showMSTWeights) { 
          const midX = (edge.a.x + edge.b.x) / 2 * tileSize
          const midY = (edge.a.y + edge.b.y) / 2 * tileSize
        
          // Tausta tekstille 
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
          ctx.beginPath()
          ctx.arc(midX, midY, 12, 0, 2 * Math.PI)
          ctx.fill()
        
          ctx.fillStyle = '#333'
          ctx.font = 'bold 10px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(edge.weight.toFixed(1), midX, midY + 3)
        }
      })
    
      ctx.setLineDash([])
    }
    
    // Piirrä huoneiden keskipisteet ja numerot
    if (visualOptions.showRoomNumbers) {
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
        ctx.fillStyle = 'black'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`${index + 1}`, room.xCenter * tileSize, room.yCenter * tileSize + 4)
        
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