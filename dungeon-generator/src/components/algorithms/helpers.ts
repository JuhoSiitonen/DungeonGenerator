import type { DungeonMapMatrix } from "../types"
import type { Point, CircumCircle, Edge, Triangle } from "./types"


export const circumCircleCalculator = (a: Point, b: Point, c: Point): CircumCircle  => {
    // Lasketaan kolmion pisteet sisältävän ympyrän keskipiste ja säde
    // Käytetään kaavaa: https://en.wikipedia.org/wiki/Circumcircle   -> Osio Circumcenter coordinates - Cartesian coordinates

    if ((a.x === b.x && a.y === b.y) || (b.x === c.x && b.y === c.y) || (c.x === a.x && c.y === a.y)) {
        throw new Error("Pisteet eivät saa olla samoja")
    }
    
    // Tarkistetaan että pisteet eivät ole suorassa linjassa laskemalla ristitulo
    // Jos ristitulo on nolla, pisteet ovat suorassa linjassa, mutta floating point tarkkuus voi aiheuttaa ongelmia, joten käytetään pientä toleranssia
    const crossProduct = (a.x - b.x) * (c.y - b.y) - (a.y - b.y) * (c.x - b.x)
    if (Math.abs(crossProduct) < 1e-10) {
      throw new Error("Pisteet eivät saa olla suorassa linjassa")
   }

    const d = 2 * (a.x * ( c.y - b.y) + b.x * (a.y - c.y) + c.x * (b.y - a.y))
    const x = ((a.x ** 2 + a.y ** 2) * (c.y - b.y) + (b.x ** 2 + b.y ** 2) * (a.y - c.y) + (c.x ** 2 + c.y ** 2) * (b.y - a.y)) / d
    const y = ((a.x ** 2 + a.y ** 2) * (b.x - c.x) + (b.x ** 2 + b.y ** 2) * (c.x - a.x) + (c.x ** 2 + c.y ** 2) * (a.x - b.x)) / d

    return {
        center: { x, y },
        radius: Math.sqrt((a.x - x) ** 2 + (a.y - y) ** 2)
    }
}

export const pointWithinCircle = (p: Point, circle: CircumCircle): boolean => {
  const dx = p.x - circle.center.x
  const dy = p.y - circle.center.y
  const distSq = dx * dx + dy * dy
  return distSq < circle.radius * circle.radius
}

export const edgesEqual = (e1: Edge, e2: Edge): boolean => {
    // Tarkistetaan ovatko reunat samat, riippumatta siitä missä järjestyksessä pisteet ovat

     return (e1.a.x === e2.a.x && e1.a.y === e2.a.y && e1.b.x === e2.b.x && e1.b.y === e2.b.y) ||
           (e1.a.x === e2.b.x && e1.a.y === e2.b.y && e1.b.x === e2.a.x && e1.b.y === e2.a.y)
}

export const superTriangleCalculator = (points: Point[]): Triangle => {
    // Lasketaan ns superkolmio, joka on tarpeeksi suuri kattamaan kaikki pisteet triangulaation alussa
    // Käytetään minimi ja maksimi arvoja pisteiden koordinaateista

    if (points.length < 3) {
        throw new Error("Tarvitaan vähintään kolme pistettä")
    }

    const minX = Math.min(...points.map(p => p.x))
    const maxX = Math.max(...points.map(p => p.x))
    const minY = Math.min(...points.map(p => p.y))
    const maxY = Math.max(...points.map(p => p.y))

    const dx = maxX - minX
    const dy = maxY - minY
    const dmax = Math.max(dx, dy)

    const midX = (minX + maxX) / 2
    const midY = (minY + maxY) / 2

    return {coordinates: [
            { x: midX - 20 * dmax, y: midY - dmax },
            { x: midX, y: midY + 20 * dmax },
            { x: midX + 20 * dmax, y: midY - dmax }
        ],
        circumcircle: circumCircleCalculator(
            { x: midX - 20 * dmax, y: midY - dmax },
            { x: midX, y: midY + 20 * dmax },
            { x: midX + 20 * dmax, y: midY - dmax }
        )
}}

export const calculateDistance = (p1: Point, p2: Point): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
};

export const pointsEqual = (p1: Point, p2: Point): boolean => {
    return p1.x === p2.x && p1.y === p2.y;
};

export const getUniquePoints = (triangulation: Triangle[]): Point[] => {
    const pointSet = new Set<string>();
    const points: Point[] = [];
    
    for (const triangle of triangulation) {
        for (const point of triangle.coordinates) {
            const key = `${point.x},${point.y}`;
            if (!pointSet.has(key)) {
                pointSet.add(key);
                points.push(point);
            }
        }
    }
    
    return points;
};

////////////////// A* algoritmin keskeneräiset jutut


// Lasketaan Manhattan-etäisyys kahden pisteen välillä, eli kuinka monta ruutua niiden välillä on vaakasuoraan ja pystysuoraan
export const manhattanDistance = (a: Point, b: Point): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

export const isValidPoint = (point: Point, map: DungeonMapMatrix): boolean => {
  return (
    point.x >= 0 &&
    point.x < map[0].length &&
    point.y >= 0 &&
    point.y < map.length
  );
};

export const isWalkable = (point: Point, map: DungeonMapMatrix): boolean => {
  if (!isValidPoint(point, map)) return false;
  const tile = map[point.y][point.x];
  return tile === 'empty' || tile === 'corridor' || tile === 'room';
};


// Palauttaa neljä naapuripistettä (ylös, alas, vasemmalle, oikealle)
export const getNeighbors4 = (point: Point): Point[] => {
  return [
    { x: point.x, y: point.y - 1 }, // Ylös
    { x: point.x, y: point.y + 1 }, // Alas
    { x: point.x - 1, y: point.y }, // Vasemmalla
    { x: point.x + 1, y: point.y }  // Oikealla
  ];
};

// Palauttaa diagonaaliset naapurit (ylävasen, yläoikea, alavasen, alaoikea)
export const getDiagonalNeighbors = (point: Point): Point[] => {
  return [
    { x: point.x - 1, y: point.y - 1 }, // Ylävasen
    { x: point.x + 1, y: point.y - 1 }, // Yläoikea
    { x: point.x - 1, y: point.y + 1 }, // Alavasen
    { x: point.x + 1, y: point.y + 1 }  // Alaoikea
  ];
};

export const getMovementCost = (from: Point, to: Point): number => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  
  if (dx === 1 && dy === 1) {
    return 1.4; // Diagonaalisen liikkumisen "kustannus" (Pythagoraan lauseesta)
  }
  return 1; // Suoran liikkumisen "kustannus"
};
