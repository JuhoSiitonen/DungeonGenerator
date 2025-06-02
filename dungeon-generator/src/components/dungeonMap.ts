import type { RoomSpecifics } from "../App"
import seedrandom from 'seedrandom'
import type { DungeonMapMatrix } from "./types"


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
  const map: DungeonMapMatrix = createEmptyMap(60, 40)

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
  const maxAttempts = numberOfRooms * 10

   while (roomCount < numberOfRooms && attempts < maxAttempts) {
    attempts++

    // Sattumanvaraiset leveys ja korkeus huoneelle, ja sattumanvaraiset x ja y koordinaatit
    const minRoomSize = 2
    const width = Math.floor(rng() * (map[0].length / 4)) + minRoomSize
    const height = Math.floor(rng() * (map.length / 4)) + minRoomSize
    const x = Math.floor(rng() * (map[0].length - (width-1)))  
    const y = Math.floor(rng() * (map.length - (height-1)))

    // Tarkistetaan että huone on tyhjä
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
      console.warn(`Huone jonka keskipiste on (${xCenter}, ${yCenter}) ja koko ${width}x${height} ei mahdu karttaan`)
      continue
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
    
    if (!isEmpty) {
      console.warn(`(${xCenter}, ${yCenter}) Päällekkäiset huoneet`)
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