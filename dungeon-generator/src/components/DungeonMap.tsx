import { useEffect, useRef } from 'react'
import type { DungeonMapMatrix } from './dungeonMap'
import type { RoomSpecifics } from '../App'
import { circumCircleCalculator } from './algorithms/delaunayTriangulation'

type Props = {
  dungeon: DungeonMapMatrix
  tileSize?: number
  roomSpecifics?: RoomSpecifics[]
}

export const DungeonMap = ({ dungeon, tileSize = 10, roomSpecifics }: Props): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  if (!dungeon || dungeon.length === 0) {
    return <div>Ei luolastoa</div>
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

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

    console.log(roomSpecifics)
    
    if (roomSpecifics && roomSpecifics.length >= 3) {
    for (let i = 0; i < roomSpecifics.length - 2; i += 3) {
      const p1 = roomSpecifics[i]
      const p2 = roomSpecifics[i + 1]
      const p3 = roomSpecifics[i + 2]

      const canvasHeight = dungeon.length
      const circle = circumCircleCalculator(
        { x: p1.xCenter, y: canvasHeight - p1.yCenter },
        { x: p2.xCenter, y: canvasHeight - p2.yCenter },
        { x: p3.xCenter, y: canvasHeight - p3.yCenter }
      )
      console.log('Drawing circle at:', circle.center.x, circle.center.y, 'radius:', circle.radius)

      ctx.beginPath()
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      ctx.arc(
        circle.center.x,
        circle.center.y ,
        circle.radius,
        0,
        2 * Math.PI
      )
      ctx.stroke()
    }
  }
    }, [dungeon, tileSize, roomSpecifics])

  return (
    <canvas
      ref={canvasRef}
      width={dungeon[0].length * tileSize}
      height={dungeon.length * tileSize}
      style={{ border: '1px solid #555' }}
    />
  )
}
