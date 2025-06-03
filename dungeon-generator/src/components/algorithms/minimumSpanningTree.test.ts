import { describe, it, expect, beforeEach } from 'vitest';
import { 
  triangulationToEdges, 
  primsAlgorithm,
  getMSTLines 
} from '../algorithms/minimumSpanningTree';
import { getUniquePoints,  } from './helpers';
import type { Triangle } from './types';

describe('Minimum Spanning Tree', () => {
  let simpleTriangle: Triangle;
  let squareTriangulation: Triangle[];
  let complexTriangulation: Triangle[];

  beforeEach(() => {
    // Yksinkertainen kolmio perus testeille
    simpleTriangle = {
      coordinates: [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
        { x: 1.5, y: 2.6 }
      ],
      circumcircle: {
        center: { x: 1.5, y: 0.87 },
        radius: 1.5
      }
    };

    // neliön triangulaatio
    squareTriangulation = [
      {
        coordinates: [
          { x: 0, y: 0 },
          { x: 4, y: 0 },
          { x: 0, y: 4 }
        ],
        circumcircle: {
          center: { x: 2, y: 2 },
          radius: 2.83
        }
      },
      {
        coordinates: [
          { x: 4, y: 0 },
          { x: 4, y: 4 },
          { x: 0, y: 4 }
        ],
        circumcircle: {
          center: { x: 2, y: 2 },
          radius: 2.83
        }
      }
    ];

    // hieman monimutkaisempi triangulaatio (viisikulmion kaltainen)
    complexTriangulation = [
      {
        coordinates: [
          { x: 0, y: 0 },
          { x: 2, y: 0 },
          { x: 1, y: 1 }
        ],
        circumcircle: { center: { x: 1, y: 0.5 }, radius: 1 }
      },
      {
        coordinates: [
          { x: 2, y: 0 },
          { x: 3, y: 2 },
          { x: 1, y: 1 }
        ],
        circumcircle: { center: { x: 2, y: 1 }, radius: 1.5 }
      },
      {
        coordinates: [
          { x: 1, y: 1 },
          { x: 3, y: 2 },
          { x: 0, y: 3 }
        ],
        circumcircle: { center: { x: 1.5, y: 2 }, radius: 1.8 }
      }
    ];
  });

  describe('triangulationToEdges', () => {
    it('should convert a single triangle to 3 unique edges', () => {
      const edges = triangulationToEdges([simpleTriangle]);
      
      expect(edges).toHaveLength(3);
      expect(edges.every(edge => typeof edge.weight === 'number')).toBe(true);
      expect(edges.every(edge => edge.weight > 0)).toBe(true);
    });

    it('should handle square triangulation with shared edge', () => {
      const edges = triangulationToEdges(squareTriangulation);
      
      // Neliöllä on 5 reunaa, koska kaksi kolmioista jakaa saman reunan
      expect(edges).toHaveLength(5);
      expect(edges.every(edge => typeof edge.weight === 'number')).toBe(true);
    });

    it('should calculate correct edge weights', () => {
      const edges = triangulationToEdges([simpleTriangle]);
      
      const horizontalEdge = edges.find(edge => 
        (edge.a.x === 0 && edge.a.y === 0 && edge.b.x === 3 && edge.b.y === 0) ||
        (edge.b.x === 0 && edge.b.y === 0 && edge.a.x === 3 && edge.a.y === 0)
      );
      
      expect(horizontalEdge).toBeDefined();
      expect(horizontalEdge!.weight).toBeCloseTo(3, 2);
    });

    it('should return empty array for empty triangulation', () => {
      const edges = triangulationToEdges([]);
      expect(edges).toHaveLength(0);
    });

    it('should not create duplicate edges', () => {
      const edges = triangulationToEdges(squareTriangulation);
      const edgeStrings = edges.map(edge => 
        `${Math.min(edge.a.x, edge.b.x)},${Math.min(edge.a.y, edge.b.y)}-${Math.max(edge.a.x, edge.b.x)},${Math.max(edge.a.y, edge.b.y)}`
      );
      const uniqueEdgeStrings = [...new Set(edgeStrings)];
      
      expect(edgeStrings.length).toBe(uniqueEdgeStrings.length);
    });
  });

  describe('getUniquePoints', () => {
    it('should extract unique points from triangulation', () => {
      const points = getUniquePoints(squareTriangulation);
      
      expect(points).toHaveLength(4);
      
      const pointStrings = points.map(p => `${p.x},${p.y}`);
      expect(pointStrings).toContain('0,0');
      expect(pointStrings).toContain('4,0');
      expect(pointStrings).toContain('0,4');
      expect(pointStrings).toContain('4,4');
    });

    it('should handle single triangle', () => {
      const points = getUniquePoints([simpleTriangle]);
      expect(points).toHaveLength(3);
    });

    it('should return empty array for empty triangulation', () => {
      const points = getUniquePoints([]);
      expect(points).toHaveLength(0);
    });

    it('should not duplicate points that appear in multiple triangles', () => {
      const points = getUniquePoints(complexTriangulation);
      
      // Should have unique points only
      const pointStrings = points.map(p => `${p.x},${p.y}`);
      const uniquePointStrings = [...new Set(pointStrings)];
      
      expect(pointStrings.length).toBe(uniquePointStrings.length);
    });
  });

  describe('primsAlgorithm', () => {
    it('should create MST with correct number of edges', () => {
      const mst = primsAlgorithm(squareTriangulation);
      
      // MST neljästä pisteestä pitäisi sisältää kolme reunaa
      expect(mst.edges).toHaveLength(3);
      expect(mst.totalWeight).toBeGreaterThan(0);
    });

    it('should handle single triangle', () => {
      const mst = primsAlgorithm([simpleTriangle]);
      
      // MST kolmesta pisteestä pitäisi sisältää kaksi reunaa
      expect(mst.edges).toHaveLength(2);
      expect(mst.totalWeight).toBeGreaterThan(0);
    });

    it('should return empty MST for empty input', () => {
      const mst = primsAlgorithm([]);
      
      expect(mst.edges).toHaveLength(0);
      expect(mst.totalWeight).toBe(0);
    });

    it('should handle single point', () => {
      const singlePointTriangulation: Triangle[] = [];
      const mst = primsAlgorithm(singlePointTriangulation);
      
      expect(mst.edges).toHaveLength(0);
      expect(mst.totalWeight).toBe(0);
    });

    it('should create a tree (connected and acyclic)', () => {
      const mst = primsAlgorithm(complexTriangulation);
      const points = getUniquePoints(complexTriangulation);
      
      // Pitäisi olla yhteensä n-1 reunaa, jos on n pistettä
      expect(mst.edges).toHaveLength(points.length - 1);
      
      // Pitäisi olla ainakin yksi reuna, jos on useampi kuin yksi piste
      if (points.length > 1) {
        const pointsInMST = new Set<string>();
        mst.edges.forEach(edge => {
          pointsInMST.add(`${edge.a.x},${edge.a.y}`);
          pointsInMST.add(`${edge.b.x},${edge.b.y}`);
        });
        expect(pointsInMST.size).toBe(points.length);
      }
    });

    it('should find minimum weight spanning tree', () => {
      // Luodaan triangulaatio, jossa MST on ilmeinen
      const triangulation: Triangle[] = [
        {
          coordinates: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0.5, y: 0.1 }
          ],
          circumcircle: { center: { x: 0.5, y: 0 }, radius: 0.5 }
        }
      ];
      
      const mst = primsAlgorithm(triangulation);
      
      // Näiden lähellä olevien pisteiden tapauksessa MST:n pitäisi suosia lyhyempiä reunoja
      expect(mst.totalWeight).toBeLessThan(3); 
    });

    it('should have total weight equal to sum of edge weights', () => {
      const mst = primsAlgorithm(squareTriangulation);
      
      const calculatedTotal = mst.edges.reduce((sum, edge) => sum + edge.weight, 0);
      expect(mst.totalWeight).toBeCloseTo(calculatedTotal, 5);
    });
  });

  describe('getMSTLines', () => {
    it('should convert MST edges to line format', () => {
      const mst = primsAlgorithm(squareTriangulation);
      const lines = getMSTLines(mst);
      
      expect(lines).toHaveLength(mst.edges.length);
      
      lines.forEach((line, index) => {
        expect(line.start).toEqual(mst.edges[index].a);
        expect(line.end).toEqual(mst.edges[index].b);
      });
    });

    it('should handle empty MST', () => {
      const emptyMST = { edges: [], totalWeight: 0 };
      const lines = getMSTLines(emptyMST);
      
      expect(lines).toHaveLength(0);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle triangulation with duplicate points', () => {
      const duplicatePointTriangulation: Triangle[] = [
        {
          coordinates: [
            { x: 0, y: 0 },
            { x: 0, y: 0 }, // Duplikaattipiste
            { x: 1, y: 1 }
          ],
          circumcircle: { center: { x: 0.5, y: 0.5 }, radius: 1 }
        }
      ];
      
      expect(() => {
        const mst = primsAlgorithm(duplicatePointTriangulation);
        expect(mst).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('MST Properties', () => {
    it('should create a connected graph', () => {
      const mst = primsAlgorithm(complexTriangulation);
      const points = getUniquePoints(complexTriangulation);
      
      if (points.length <= 1) return;
      
      // Rakennetaan vierekkäisyyslista MST:stä
      const adjacency = new Map<string, Set<string>>();
      points.forEach(p => adjacency.set(`${p.x},${p.y}`, new Set()));
      
      mst.edges.forEach(edge => {
        const aKey = `${edge.a.x},${edge.a.y}`;
        const bKey = `${edge.b.x},${edge.b.y}`;
        adjacency.get(aKey)?.add(bKey);
        adjacency.get(bKey)?.add(aKey);
      });
      
      // Aloitetaan BFS ensimmäisestä pisteestä ja tarkistetaan, että kaikki pisteet saavutetaan
      const visited = new Set<string>();
      const queue = [`${points[0].x},${points[0].y}`];
      visited.add(queue[0]);
      
      while (queue.length > 0) {
        const current = queue.shift()!;
        const neighbors = adjacency.get(current) || new Set();
        
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      
      expect(visited.size).toBe(points.length);
    });

    it('should be acyclic', () => {
      const mst = primsAlgorithm(complexTriangulation);
      const points = getUniquePoints(complexTriangulation);
      
      if (points.length > 0) {
        expect(mst.edges).toHaveLength(points.length - 1);
      }
    });
  });
});