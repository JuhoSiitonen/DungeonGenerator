import type { Point, CircumCircle, Edge } from "./types"


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
    return e1.a === e2.a && e1.b === e2.b ||
           e1.a === e2.b && e1.b === e2.a
}
