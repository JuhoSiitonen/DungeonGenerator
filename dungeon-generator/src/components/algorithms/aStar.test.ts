import { describe, test, expect, beforeEach } from 'vitest';
import { findPath, createCorridorsFromMST } from './aStar';
import type { DungeonMapMatrix } from '../types';
import type { Point } from './types';

describe('A* Pathfinding Algorithm', () => {
  let simpleMap: DungeonMapMatrix;
  let complexMap: DungeonMapMatrix;
  let mazeMap: DungeonMapMatrix;

  beforeEach(() => {
    // Yksinkertainen 5x5 kartta
    simpleMap = [
      ['room', 'empty', 'empty', 'empty', 'room'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['room', 'empty', 'empty', 'empty', 'room']
    ];

    // Monimutkaisempi kartta esteillä
    complexMap = [
      ['room', 'empty', 'wall', 'wall', 'wall'],
      ['empty', 'empty', 'wall', 'empty', 'empty'],
      ['empty', 'wall', 'wall', 'empty', 'wall'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['wall', 'empty', 'wall', 'empty', 'wall']
    ];

    // Sokkelomainen kartta, testiin jossa maaliin pääseen ainoastaan diagonaalisesti
    mazeMap = [
      ['wall', 'empty', 'wall', 'wall', 'room'],
      ['empty', 'empty', 'wall', 'empty', 'wall'],
      ['wall', 'empty', 'wall', 'empty', 'wall'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['wall', 'wall', 'wall', 'empty', 'wall']
    ];
  });

  describe('Basic functionality', () => {
    test('can find a path between two points, L shaped', () => {
      const start: Point = { x: 0, y: 0 };
      const goal: Point = { x: 4, y: 4 };
      
      const result = findPath(start, goal, simpleMap, false, 'manhattan');
      
      expect(result.found).toBe(true);
      expect(result.path).toHaveLength(9); // 5 oikealle + 4 alas
      expect(result.path[0]).toEqual(start);
      expect(result.path[result.path.length - 1]).toEqual(goal);
    });

    test('can find a path diagonally', () => {
      const start: Point = { x: 0, y: 0 };
      const goal: Point = { x: 2, y: 2 };
      
      const result = findPath(start, goal, simpleMap, true, 'manhattan');
      
      expect(result.found).toBe(true);
      expect(result.path.length).toBeLessThanOrEqual(5); // Diagonaali on tehokkaampi
      expect(result.path[0]).toEqual(start);
      expect(result.path[result.path.length - 1]).toEqual(goal);
    });
  });

  describe('Errors and cornercases', () => {
    test('returns empty path when start is outside map', () => {
      const start: Point = { x: -1, y: 0 };
      const goal: Point = { x: 2, y: 2 };
      
      const result = findPath(start, goal, simpleMap, false, 'manhattan');
      
      expect(result.found).toBe(false);
      expect(result.path).toHaveLength(0);
    });

    test('returns empty path when goal is outside map', () => {
      const start: Point = { x: 0, y: 0 };
      const goal: Point = { x: 10, y: 10 };
      
      const result = findPath(start, goal, simpleMap, false, 'manhattan');
      
      expect(result.found).toBe(false);
      expect(result.path).toHaveLength(0);
    });

    test('returns empty path when start is not walkable', () => {
      const start: Point = { x: 0, y: 0 }; 
      const goal: Point = { x: 1, y: 1 };

      simpleMap[0][0] = 'wall'; // Muutetaan lähtöpiste ei-käveltäväksi
      
      const result = findPath(start, goal, simpleMap, false, 'manhattan');
      
      expect(result.found).toBe(false);
      expect(result.path).toHaveLength(0);
    });

    test('return empty path when goal is not walkable', () => {
      const start: Point = { x: 1, y: 1 };
      const goal: Point = { x: 0, y: 0 }; 
      
      simpleMap[0][0] = 'wall'; // Muutetaan maali ei-käveltäväksi
      
      const result = findPath(start, goal, simpleMap, false, 'manhattan');
      
      expect(result.found).toBe(false);
      expect(result.path).toHaveLength(0);
    });

    test('can find a path when the start and goal are same', () => {
      const point: Point = { x: 1, y: 1 };
      
      const result = findPath(point, point, simpleMap, false, 'manhattan');
      
      expect(result.found).toBe(true);
      expect(result.path).toHaveLength(1);
      expect(result.path[0]).toEqual(point);
    });

    test('returns empty path when there is no route to goal', () => {
      // Luo kartta, jossa maali on eristetty
      const blockedMap: DungeonMapMatrix = [
        ['empty', 'empty', 'wall', 'wall', 'room'],
        ['empty', 'empty', 'wall', 'empty', 'room'],
        ['room', 'room', 'wall', 'wall', 'wall'],
        ['room', 'room', 'room', 'room', 'room'],
        ['room', 'room', 'room', 'room', 'room']
      ];

      const start: Point = { x: 0, y: 0 };
      const goal: Point = { x: 3, y: 1 };
      
      const result = findPath(start, goal, blockedMap, false, 'manhattan');
      
      expect(result.found).toBe(false);
      expect(result.path).toHaveLength(0);
    });

     test('can access goal if the goal is only accessible diagonally', () => {

      const start: Point = { x: 1, y: 0 };
      const goal: Point = { x: 4, y: 0 };
      
      const result = findPath(start, goal, mazeMap, true, 'manhattan');
      expect(result.found).toBe(true);
     })

     test('cannot access goal if the goal is only accessible diagonally', () => {

      const start: Point = { x: 1, y: 0 };
      const goal: Point = { x: 4, y: 0 };
      
      const result = findPath(start, goal, mazeMap, false, 'manhattan');
      expect(result.found).toBe(false);
     })
  });

  describe('Path quality', () => {
    test('finds the shortest path in a simple case', () => {
      const start: Point = { x: 1, y: 1 };
      const goal: Point = { x: 3, y: 1 }; // Vaakasuora polku
      const result = findPath(start, goal, simpleMap, false, 'manhattan');
      
      expect(result.found).toBe(true);
      expect(result.path).toHaveLength(3); 
      
      // Tarkista, että polku on suora
      for (let i = 0; i < result.path.length; i++) {
        expect(result.path[i].y).toBe(1); // Sama y-koordinaatti koko matkan
      }
    });

    test('can find a way accross obstacles', () => {
      const start: Point = { x: 1, y: 0 };
      const goal: Point = { x: 3, y: 1 };
      
      const result = findPath(start, goal, complexMap, false, 'manhattan');
      
      expect(result.found).toBe(true);
      expect(result.path.length).toBeGreaterThan(3); // Ei suora polku esteiden takia
      
      // Varmistetaan, että polku ei kulje 'wall' ruudun läpi
      for (const point of result.path) {
        expect(complexMap[point.y][point.x]).not.toBe('wall');
      }
    });

    test('diagonal is better than orthogonal', () => {
      const start: Point = { x: 0, y: 0 };
      const goal: Point = { x: 3, y: 3 };
      
      const orthogonalResult = findPath(start, goal, simpleMap, false, 'manhattan');
      const diagonalResult = findPath(start, goal, simpleMap, true, 'manhattan');
      
      expect(orthogonalResult.found).toBe(true);
      expect(diagonalResult.found).toBe(true);
      expect(diagonalResult.path.length).toBeLessThanOrEqual(orthogonalResult.path.length);
    });
  });

  describe('Path continuity and validity', () => {
    test('path is continuous', () => {
      const start: Point = { x: 1, y: 1 };
      const goal: Point = { x: 3, y: 3 };
      
      const result = findPath(start, goal, complexMap, true, 'manhattan');
      
      if (result.found) {
        for (let i = 1; i < result.path.length; i++) {
          const prev = result.path[i - 1];
          const curr = result.path[i];
          
          const dx = Math.abs(curr.x - prev.x);
          const dy = Math.abs(curr.y - prev.y);
          
          // Tarkista, että siirtymä on validi (ortogonaalinen tai diagonaalinen)
          expect(dx <= 1 && dy <= 1).toBe(true);
          expect(dx + dy).toBeGreaterThan(0); // Ei sama piste
        }
      }
    });

    test('all points in path are walkable', () => {
      const start: Point = { x: 1, y: 0 };
      const goal: Point = { x: 3, y: 4 };
      
      const result = findPath(start, goal, complexMap, false, 'manhattan');
      
      if (result.found) {
        for (const point of result.path) {
          expect(complexMap[point.y][point.x]).not.toBe('wall');
        }
      }
    });
  });
});

describe('MST Corridor Creation', () => {
  let testMap: DungeonMapMatrix;
  let mstEdges: Array<{start: Point, end: Point}>;

  beforeEach(() => {
    testMap = [
      ['room', 'empty', 'empty', 'empty', 'room'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['room', 'empty', 'empty', 'empty', 'room']
    ];

    mstEdges = [
      { start: { x: 0, y: 0 }, end: { x: 4, y: 0 } },
      { start: { x: 4, y: 0 }, end: { x: 4, y: 4 } },
      { start: { x: 4, y: 4 }, end: { x: 0, y: 4 } }
    ];
  });

  test('create corridors according to MST', () => {
    const result = createCorridorsFromMST(testMap, mstEdges, false, true);
    
    // Tarkista, että joitain käytäviä on luotu
    let corridorCount = 0;
    for (let y = 0; y < result.length; y++) {
      for (let x = 0; x < result[y].length; x++) {
        if (result[y][x] === 'corridor') {
          corridorCount++;
        }
      }
    }
    expect(corridorCount).toBeGreaterThan(0);
  });

  test('can handle empty MST', () => {
    const result = createCorridorsFromMST(testMap, [], false, true);
    expect(result).toEqual(testMap);
  });
});
