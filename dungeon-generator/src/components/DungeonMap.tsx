import { useEffect, useRef } from 'react'
import type { DungeonMapMatrix } from './dungeonMap'
import React from 'react'

type Props = {
  dungeon: DungeonMapMatrix
  tileSize?: number
}

export const DungeonMap = ({ dungeon, tileSize = 10 }: Props): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
  }, [dungeon, tileSize])

  return (
    <canvas
      ref={canvasRef}
      width={dungeon[0].length * tileSize}
      height={dungeon.length * tileSize}
      style={{ border: '1px solid #555' }}
    />
  )
}
