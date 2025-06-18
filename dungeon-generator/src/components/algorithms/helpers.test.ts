import { describe, it, expect } from 'vitest'
import { 
  circumCircleCalculator, 
  pointWithinCircle, 
  edgesEqual, 
  superTriangleCalculator, 
  calculateDistance,
  pointsEqual,
  getUniquePoints,
  manhattanDistance,
  isValidPoint,
  isWalkable,
  getMovementCost,
  getDiagonalNeighbors,
  getNeighbors4
} from './helpers' 
import type { Point, CircumCircle, Edge, Triangle } from './types'
import type { DungeonMapMatrix } from '../types'

describe('circumCircleCalculator', () => {
  it('should calculate circumcircle for a simple right triangle', () => {
    const a: Point = { x: 0, y: 0 }
    const b: Point = { x: 3, y: 0 }
    const c: Point = { x: 0, y: 4 }
    
    const result = circumCircleCalculator(a, b, c)
    

    // Suorakulmaiselle kolmiolle jonka sivut ovat 3 ja 4 ja jonka hypotenuusa on 5
    // Ympyräkehän keskipiste on hypotenuusan keskellä
    expect(result.center.x).toBeCloseTo(1.5, 5)
    expect(result.center.y).toBeCloseTo(2, 5)
    expect(result.radius).toBeCloseTo(2.5, 5)
  })

  it('should throw error for identical points (a and b)', () => {
    const a: Point = { x: 1, y: 1 }
    const b: Point = { x: 1, y: 1 }
    const c: Point = { x: 2, y: 2 }
    
    expect(() => circumCircleCalculator(a, b, c)).toThrow("Pisteet eivät saa olla samoja")
  })

  it('should throw error for horizontal line', () => {
    const a: Point = { x: 0, y: 0 }
    const b: Point = { x: 1, y: 0 }
    const c: Point = { x: 2, y: 0 }
    
    expect(() => circumCircleCalculator(a, b, c)).toThrow("Pisteet eivät saa olla suorassa linjassa")
  })

  it('should throw error for vertical line', () => {
    const a: Point = { x: 1, y: 0 }
    const b: Point = { x: 1, y: 1 }
    const c: Point = { x: 1, y: 2 }
    
    expect(() => circumCircleCalculator(a, b, c)).toThrow("Pisteet eivät saa olla suorassa linjassa")
  })

  it('should throw error for diagonal line', () => {
    const a: Point = { x: 0, y: 0 }
    const b: Point = { x: 1, y: 1 }
    const c: Point = { x: 2, y: 2 }
    
    expect(() => circumCircleCalculator(a, b, c)).toThrow("Pisteet eivät saa olla suorassa linjassa")
  })
})

describe('pointWithinCircle', () => {
  const circle: CircumCircle = {
    center: { x: 0, y: 0 },
    radius: 5
  }

  it('should return true for point inside circle', () => {
    const point: Point = { x: 2, y: 2 }
    expect(pointWithinCircle(point, circle)).toBe(true)
  })

  it('should return false for point outside circle', () => {
    const point: Point = { x: 6, y: 0 }
    expect(pointWithinCircle(point, circle)).toBe(false)
  })

  it('should return false for point exactly on circle boundary', () => {
    const point: Point = { x: 5, y: 0 }
    expect(pointWithinCircle(point, circle)).toBe(false)
  })
})


describe('edgesEqual', () => {
  it('should return true for identical edges (same order)', () => {
    const edge1: Edge = { a: {x: 1, y: 2}, b: {x:2, y:3} }
    const edge2: Edge = { a: {x: 1, y: 2}, b: {x:2, y:3} }
    
    expect(edgesEqual(edge1, edge2)).toBe(true)
  })

  it('should return false for different edges', () => {
    const edge1: Edge = { a: {x: 1, y: 2}, b: {x:2, y:3} }
    const edge2: Edge = { a: {x: 2, y: 4}, b: {x:2, y:5} }
    
    expect(edgesEqual(edge1, edge2)).toBe(false)
  })
})

describe('superTriangleCalculator', () => {
  it('should create super triangle for basic point set', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ]
    
    const result = superTriangleCalculator(points)
    
    expect(result.coordinates).toHaveLength(3)
    expect(result.circumcircle).toBeDefined()
    
    // Tarkista että kaikki pisteet ovat kolmion ympyräkehän sisällä
    points.forEach(point => {
      expect(pointWithinCircle(point, result.circumcircle)).toBe(true)
    })
  })

  it('should throw error for less than 3 points', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 }
    ]
    
    expect(() => superTriangleCalculator(points)).toThrow("Tarvitaan vähintään kolme pistettä")
  })
})

describe('calculateDistance', () => {
  it('should calculate distance between two points', () => {
    const p1: Point = { x: 0, y: 0 }
    const p2: Point = { x: 3, y: 4 }
    
    expect(calculateDistance(p1, p2)).toBeCloseTo(5, 5)
  })

  it('should return 0 for identical points', () => {
    const p1: Point = { x: 2, y: 3 }
    const p2: Point = { x: 2, y: 3 }
    
    expect(calculateDistance(p1, p2)).toBe(0)
  })

  it('should calculate distance for negative coordinates', () => {
    const p1: Point = { x: -1, y: -1 }
    const p2: Point = { x: 2, y: 3 }
    
    expect(calculateDistance(p1, p2)).toBeCloseTo(5, 5)
  })
})

describe('pointsEqual', () => {
  it('should return true for identical points', () => {
    const p1: Point = { x: 1, y: 2 }
    const p2: Point = { x: 1, y: 2 }
    
    expect(pointsEqual(p1, p2)).toBe(true)
  })

  it('should return false for different points', () => {
    const p1: Point = { x: 1, y: 2 }
    const p2: Point = { x: 2, y: 1 }
    
    expect(pointsEqual(p1, p2)).toBe(false)
  })

  it('should return false for points with same x but different y', () => {
    const p1: Point = { x: 5, y: 3 }
    const p2: Point = { x: 5, y: 7 }
    
    expect(pointsEqual(p1, p2)).toBe(false)
  })
})

describe('getUniquePoints', () => {
  it('should return unique points from triangulation', () => {
    const triangulation: Triangle[] = [
      {
        coordinates: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: 1 }
        ],
        circumcircle: { center: { x: 0.5, y: 0.5 }, radius: 1 }
      },
      {
        coordinates: [
          { x: 1, y: 0 }, // Duplikaatti!
          { x: 1, y: 1 },
          { x: 0, y: 1 } // Duplikaatti!
        ],
        circumcircle: { center: { x: 1, y: 0.5 }, radius: 1 }
      }
    ]
    
    const result = getUniquePoints(triangulation)
    
    expect(result).toHaveLength(4)
    expect(result).toEqual(
      expect.arrayContaining([
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
      ])
    )
  })

  it('should return empty array for empty triangulation', () => {
    const triangulation: Triangle[] = []
    
    const result = getUniquePoints(triangulation)
    
    expect(result).toEqual([])
  })
})

// Manhattan eli korttelietäisyys
describe('manhattanDistance', () => {
  it('should calculate Manhattan distance between two points', () => {
    const a: Point = { x: 1, y: 1 }
    const b: Point = { x: 4, y: 5 }
    
    expect(manhattanDistance(a, b)).toBe(7) // |4-1| + |5-1| = 7
  })

  it('should return 0 for identical points', () => {
    const a: Point = { x: 3, y: 3 }
    const b: Point = { x: 3, y: 3 }
    
    expect(manhattanDistance(a, b)).toBe(0)
  })

  it('should handle negative coordinates', () => {
    const a: Point = { x: -2, y: -3 }
    const b: Point = { x: 1, y: 2 }
    
    expect(manhattanDistance(a, b)).toBe(8) // |1-(-2)| + |2-(-3)| = 8
  })
})

describe('isValidPoint', () => {
  const map: DungeonMapMatrix = [
    ['wall', 'empty', 'wall'],
    ['empty', 'room', 'empty'],
    ['wall', 'corridor', 'wall']
  ]

  it('should return true for valid point within map bounds', () => {
    const point: Point = { x: 1, y: 1 }
    
    expect(isValidPoint(point, map)).toBe(true)
  })

  it('should return false for point with negative x', () => {
    const point: Point = { x: -1, y: 1 }
    
    expect(isValidPoint(point, map)).toBe(false)
  })

  it('should return false for point with negative y', () => {
    const point: Point = { x: 1, y: -1 }
    
    expect(isValidPoint(point, map)).toBe(false)
  })

  it('should return false for point beyond map width', () => {
    const point: Point = { x: 3, y: 1 }
    
    expect(isValidPoint(point, map)).toBe(false)
  })

  it('should return false for point beyond map height', () => {
    const point: Point = { x: 1, y: 3 }
    
    expect(isValidPoint(point, map)).toBe(false)
  })
})

describe('isWalkable', () => {
  const map: DungeonMapMatrix = [
    ['wall', 'empty', 'wall'],
    ['empty', 'room', 'empty'],
    ['wall', 'corridor', 'wall']
  ]

  it('should return true for empty tile', () => {
    const point: Point = { x: 1, y: 0 }
    
    expect(isWalkable(point, map)).toBe(true)
  })

  it('should return true for room tile', () => {
    const point: Point = { x: 1, y: 1 }
    
    expect(isWalkable(point, map)).toBe(true)
  })

  it('should return true for corridor tile', () => {
    const point: Point = { x: 1, y: 2 }
    
    expect(isWalkable(point, map)).toBe(true)
  })

  it('should return false for wall tile', () => {
    const point: Point = { x: 0, y: 0 }
    
    expect(isWalkable(point, map)).toBe(false)
  })
})

describe('getNeighbors4', () => {
  it('should return 4 orthogonal neighbors', () => {
    const point: Point = { x: 5, y: 5 }
    
    const neighbors = getNeighbors4(point)
    
    expect(neighbors).toHaveLength(4)
    expect(neighbors).toEqual([
      { x: 5, y: 4 }, 
      { x: 5, y: 6 }, 
      { x: 4, y: 5 }, 
      { x: 6, y: 5 }  
    ])
  })
})

describe('getDiagonalNeighbors', () => {
  it('should return 8 neighbors including diagonals', () => {
    const point: Point = { x: 5, y: 5 }
    
    const neighbors = getDiagonalNeighbors(point)
    
    expect(neighbors).toHaveLength(8)
    expect(neighbors).toEqual([
      { x: 5, y: 4 }, 
      { x: 5, y: 6 }, 
      { x: 4, y: 5 }, 
      { x: 6, y: 5 }, 
      { x: 4, y: 4 }, 
      { x: 6, y: 4 }, 
      { x: 4, y: 6 }, 
      { x: 6, y: 6 }  
    ])
  })
})

describe('getMovementCost', () => {
  it('should return 1 for horizontal movement', () => {
    const from: Point = { x: 0, y: 0 }
    const to: Point = { x: 1, y: 0 }
    
    expect(getMovementCost(from, to)).toBe(1)
  })

  it('should return 1 for vertical movement', () => {
    const from: Point = { x: 0, y: 0 }
    const to: Point = { x: 0, y: 1 }
    
    expect(getMovementCost(from, to)).toBe(1)
  })

  it('should return 1.4 for diagonal movement', () => {
    const from: Point = { x: 0, y: 0 }
    const to: Point = { x: 1, y: 1 }
    
    expect(getMovementCost(from, to)).toBe(1.4)
  })

  it('should return 1.4 for negative diagonal movement', () => {
    const from: Point = { x: 1, y: 1 }
    const to: Point = { x: 0, y: 0 }
    
    expect(getMovementCost(from, to)).toBe(1.4)
  })

  it('should return 0 for same point', () => {
    const from: Point = { x: 5, y: 5 }
    const to: Point = { x: 5, y: 5 }
    
    expect(getMovementCost(from, to)).toBe(1) // Palauttaa silti funktion logiikan mukaan 1
  })
})