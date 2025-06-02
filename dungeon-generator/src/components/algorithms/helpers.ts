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
