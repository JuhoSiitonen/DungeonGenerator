import { describe, it, expect } from 'vitest'
import { createEmptyMap, createMapAndRooms } from './createMapAndRooms'

describe('Dungeon Map Generation', () => {
  describe('createEmptyMap', () => {
    it('should create an empty map with correct dimensions', () => {
      const map = createEmptyMap(5, 3)
      
      expect(map).toHaveLength(3) 
      expect(map[0]).toHaveLength(5) 
      expect(map.every(row => row.every(tile => tile === 'empty'))).toBe(true)
    })
  })
   describe('createMapAndRooms', () => {
    it('should create rooms with consistent seed', () => {
      const result1 = createMapAndRooms(3, "test-seed")
      const result2 = createMapAndRooms(3, "test-seed")
      
      expect(result1.roomSpecifics).toEqual(result2.roomSpecifics)
    })

    it('should create requested number of rooms when possible', () => {
      const result = createMapAndRooms(2, "test")
      
      expect(result.roomSpecifics.length).toBeLessThanOrEqual(2)
      expect(result.roomSpecifics.length).toBeGreaterThan(0)
    })

    it('should have rooms within map boundaries', () => {
      const result = createMapAndRooms(5, "boundary-test")
      
      result.roomSpecifics.forEach(room => {
        expect(room.xCenter).toBeGreaterThanOrEqual(0)
        expect(room.yCenter).toBeGreaterThanOrEqual(0)
        expect(room.xCenter).toBeLessThan(60) 
        expect(room.yCenter).toBeLessThan(40) 
      })
    })
  })
})