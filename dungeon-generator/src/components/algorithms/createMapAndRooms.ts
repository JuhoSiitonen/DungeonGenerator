import type { RoomSpecifics } from "../types"
import seedrandom from 'seedrandom'
import type { DungeonMapMatrix } from "../types"

/**
 * Huoneiden luomisessa käytetään satunnaista seed-arvoa, jotta saadaan toistettavat tulokset.
 * Huoneiden luomisessa käytetään satunnaista leveys- ja korkeusarvoa jotka ovat suurempia kuin 2.
 * Huoneiden koordinaatit lasketaan satunnaisesti kartan koordinaattien perusteella ottaen huomioon huoneen leveys ja korkeus.
 * Huoneiden luomisessa tarkistetaan että huone on tyhjä, eli että se ei mene päällekkäin muiden huoneiden kanssa.
 * Huoneiden luomisessa käytetään maxAttempts arvoa, joka on 100 kertaa huoneiden määrä, jotta vältetään loputon silmukka.
 * Kaksi eri funktiota on käytössä, koska kehitysympäristössä käyttäjä voi syöttää huoneiden koordinaatit 
 * manuaalisesti, mutta tuotantoympäristössä huoneet luodaan satunnaisesti.
 */


export function createEmptyMap(width: number, height: number): DungeonMapMatrix {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 'empty')
  )
}

export function createMapAndRooms(
  numberOfRooms: number,
  seed: string,
  manualRooms?: RoomSpecifics[]
): {roomSpecifics:RoomSpecifics[], map:DungeonMapMatrix, manualRooms?: RoomSpecifics[]} {
  // Käytetään seedrandomia satunnaisten huoneiden luomiseen, jotta saadaan toistettavat tulokset
  const map: DungeonMapMatrix = createEmptyMap(80, 60)

  // Jos manuaaliset huoneet on annettu (ENV === DEV), käytetään niitä
  if (manualRooms && manualRooms.length > 0) {
    return createMapWithManualRooms(map, manualRooms)
  }
  
  // Muuten luodaan huoneet automaattisesti (ENV === PROD)
  return createMapWithRandomRooms(map, numberOfRooms, seed)
}

function createMapWithRandomRooms(
  map: DungeonMapMatrix, 
  numberOfRooms: number, 
  seed: string
): {roomSpecifics: RoomSpecifics[], map: DungeonMapMatrix} {
  let attempts = 0
  const rng = seedrandom(seed)
  let roomCount = 0
  const roomSpecifics: RoomSpecifics[] = []
  const maxAttempts = numberOfRooms * 100

   while (roomCount < numberOfRooms && attempts < maxAttempts) {
    attempts++

    // Sattumanvaraiset leveys ja korkeus huoneelle, ja sattumanvaraiset x ja y koordinaatit
    // Huoneen leveys ja korkeus ovat vähintään 2, jotta huone ei ole liian pieni
    // Huoneen koordinaatit ovat välillä 1 ja kartan leveys/korkeus -1 
    const minRoomSize = 2
    const width = Math.floor(rng() * (map[0].length / 4)) + minRoomSize
    const height = Math.floor(rng() * (map.length / 4)) + minRoomSize
    let x = Math.floor(rng() * (map[0].length - (width+1)))
    let y = Math.floor(rng() * (map.length - (height+1)))
    
    x = x === 0 ? 1 : x // Varmistetaan että x ei ole 0
    y = y === 0 ? 1 : y // Varmistetaan että y ei ole 0

    // Tarkistetaan että huone on tyhjä (ja 1 ruutu ympärillä)
    let isEmpty = true
    for (let i = y-1; i < y + height + 1; i++) {
      for (let j = x-1; j < x + width + 1; j++) {
        if (map[i][j] !== 'empty') {
          isEmpty = false
          break
        }
      }
      if (!isEmpty) break
    }
    if (!isEmpty) continue

    // Täytetään huone 'room' laatoilla
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        map[i][j] = 'room'
      }
    }

    roomSpecifics.push({
      width,
      height,
      xCenter: x + Math.floor(width / 2),
      yCenter: y + Math.floor(height / 2),
    })

    roomCount++
  }

  return {roomSpecifics, map}
}


// Kehitystä ja testausta varten: luodaan kartta manuaalisesti määritellyillä huoneilla
function createMapWithManualRooms(
  map: DungeonMapMatrix, 
  manualRooms: RoomSpecifics[]
): {roomSpecifics: RoomSpecifics[], map: DungeonMapMatrix} {
  const roomSpecifics: RoomSpecifics[] = []
  
  for (const room of manualRooms) {
    const { width, height, xCenter, yCenter } = room
    
    // Laske huoneen vasemman yläkulman koordinaatit keskipisteen perusteella
    const x = Math.max(0, Math.min(map[0].length - width, xCenter - Math.floor(width / 2)))
    const y = Math.max(0, Math.min(map.length - height, yCenter - Math.floor(height / 2)))
    
    // Tarkista että huone mahtuu karttaan
    if (x + width > map[0].length || y + height > map.length) {
      throw new Error(`Huone ei mahdu karttaan: ${JSON.stringify(room)}`)
    }
    
    let isEmpty = true
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        if (map[i][j] !== 'empty') {
          isEmpty = false
          break
        }
      }
      if (!isEmpty) break
    }

    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        map[i][j] = 'room'
      }
    }
    
    roomSpecifics.push({
      width,
      height,
      xCenter: x + Math.floor(width / 2),
      yCenter: y + Math.floor(height / 2),
    })
  }
  
  return { roomSpecifics, map }
}