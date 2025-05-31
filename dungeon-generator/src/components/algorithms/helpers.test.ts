import { describe, it, expect } from 'vitest'
import { 
  circumCircleCalculator, 
  pointWithinCircle, 
  edgesEqual, 
  superTriangleCalculator 
} from './helpers' 
import type { Point, CircumCircle, Edge } from './types'

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