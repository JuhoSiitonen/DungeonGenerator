import { describe, it, expect } from 'vitest'
import { delaunayTriangulation } from './delaunayTriangulation' 
import type { RoomSpecifics } from '../../App'
import type { Point } from './types'

// Delaunay triangluaatiossa syntyvien kolmioiden määrän laskemiseen on tunnettu kaava: 2n - 2 - k 
// (missä n=kaikki pisteet, k=konveksisen hilan reunapisteiden määrä)

describe('delaunayTriangulation', () => {
  it('should return empty array for less than 3 rooms', () => {
    const rooms: RoomSpecifics[] = [
      { width: 2, height: 2, xCenter: 0, yCenter: 0 },
      { width: 2, height: 2, xCenter: 1, yCenter: 1 }
    ]
    
    const result = delaunayTriangulation(rooms)
    expect(result).toEqual([])
  })

  it('should create correct number of triangles for basic triangle', () => {
    const rooms: RoomSpecifics[] = [
      { width: 1, height: 1, xCenter: 0, yCenter: 0 },
      { width: 1, height: 1, xCenter: 4, yCenter: 0 },
      { width: 1, height: 1, xCenter: 2, yCenter: 3 }
    ]
    
    const triangles = delaunayTriangulation(rooms)
    // Kolmella pisteellä pitäisi luoda täsmälleen yhden kolmion
    expect(triangles).toHaveLength(1)
  })

  it('should create correct number of triangles for square formation', () => {
    const rooms: RoomSpecifics[] = [
      { width: 1, height: 1, xCenter: 1, yCenter: 1 },
      { width: 1, height: 1, xCenter: 3, yCenter: 1 },
      { width: 1, height: 1, xCenter: 3, yCenter: 3 },
      { width: 1, height: 1, xCenter: 1, yCenter: 3 }
    ]
    
    const triangles = delaunayTriangulation(rooms)
    
    // Neljällä pisteellä, jotka ovat neliön kulmissa, pitäisi luoda täsmälleen 2 kolmioa
    expect(triangles).toHaveLength(2)
  })

  it('should create correct number of triangles for pentagon formation', () => {
    const rooms: RoomSpecifics[] = [
      { width: 1, height: 1, xCenter: 0, yCenter: 0 },
      { width: 1, height: 1, xCenter: 2, yCenter: 0 },
      { width: 1, height: 1, xCenter: 3, yCenter: 1.5 },
      { width: 1, height: 1, xCenter: 1, yCenter: 2.5 },
      { width: 1, height: 1, xCenter: -1, yCenter: 1.5 }
    ]
    
    const triangles = delaunayTriangulation(rooms)
    
    // Viidellä pisteellä, jotka ovat viisikulmio muodostelmassa, pitäisi luoda täsmälleen 3 kolmioa
    expect(triangles).toHaveLength(3)
  })

   it('should create correct number of triangles with interior points', () => {
    const rooms: RoomSpecifics[] = [
      // Neliö (konveksinen hila)
      { width: 1, height: 1, xCenter: 0, yCenter: 0 },
      { width: 1, height: 1, xCenter: 4, yCenter: 0 },
      { width: 1, height: 1, xCenter: 4, yCenter: 4 },
      { width: 1, height: 1, xCenter: 0, yCenter: 4 },
      // Sisäiset pisteet
      { width: 1, height: 1, xCenter: 2, yCenter: 3 },
      { width: 1, height: 1, xCenter: 1, yCenter: 1 }
    ]
    
    const triangles = delaunayTriangulation(rooms)
    
    // Kaavan mukaan: 2*6 - 2 - 4 = 6 
    expect(triangles).toHaveLength(6)
  })

  it('should ensure all rooms are included in triangulation', () => {
    const rooms: RoomSpecifics[] = [
      { width: 2, height: 2, xCenter: 1, yCenter: 1 },
      { width: 2, height: 2, xCenter: 4, yCenter: 1 },
      { width: 2, height: 2, xCenter: 2.5, yCenter: 3 },
      { width: 2, height: 2, xCenter: 1.5, yCenter: 2 }
    ]
    
    const triangles = delaunayTriangulation(rooms)
    const roomPoints: Point[] = rooms.map(room => ({ x: room.xCenter, y: room.yCenter }))
    
    const triangulationPoints = new Set<string>()
    triangles.forEach(triangle => {
      triangle.coordinates.forEach(point => {
        triangulationPoints.add(`${point.x},${point.y}`)
      })
    })
    
    roomPoints.forEach(roomPoint => {
      const pointKey = `${roomPoint.x},${roomPoint.y}`
      expect(triangulationPoints.has(pointKey)).toBe(true)
    })
  })

  it('should not contain any super triangle parts in final result', () => {
    const rooms: RoomSpecifics[] = [
      { width: 1, height: 1, xCenter: 1, yCenter: 1 },
      { width: 1, height: 1, xCenter: 3, yCenter: 1 },
      { width: 1, height: 1, xCenter: 2, yCenter: 2.5 }
    ]
    
    const triangles = delaunayTriangulation(rooms)
    const roomPoints: Point[] = rooms.map(room => ({ x: room.xCenter, y: room.yCenter }))
    
    const usedPoints: Point[] = []
    triangles.forEach(triangle => {
      triangle.coordinates.forEach(point => {
        usedPoints.push(point)
      })
    })
    
    // Tarkistetaan, että kaikki käytetyt pisteet ovat huoneiden keskikohtia
    usedPoints.forEach(usedPoint => {
      const isFromRooms = roomPoints.some(roomPoint => 
        roomPoint.x === usedPoint.x && roomPoint.y === usedPoint.y
      )
      expect(isFromRooms).toBe(true)
    })
  })
})


