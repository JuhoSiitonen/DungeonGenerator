import type { RoomSpecifics } from "../App"
import seedrandom from 'seedrandom'

export type Tile = 'empty' | 'room' | 'corridor'

export type DungeonMapMatrix = Tile[][]

export function createEmptyMap(width: number, height: number): DungeonMapMatrix {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 'empty')
  )
}

export function createMapAndRooms(
  numberOfRooms: number,
  seed: string
): {roomSpecifics:RoomSpecifics[], map:DungeonMapMatrix} {
  // Käytetään seedrandomia satunnaisten huoneiden luomiseen, jotta saadaan toistettavat tulokset
  const rng = seedrandom(seed)
  let roomCount = 0
  const roomSpecifics: RoomSpecifics[] = []
  const map = createEmptyMap(60, 40)

  let attempts = 0
  const maxAttempts = numberOfRooms * 10

   while (roomCount < numberOfRooms && attempts < maxAttempts) {
    attempts++

    // Sattumanvaraiset leveys ja korkeus huoneelle, ja sattumanvaraiset x ja y koordinaatit
    const minRoomSize = 2
    const width = Math.floor(rng() * (map[0].length / 4)) + minRoomSize
    const height = Math.floor(rng() * (map.length / 4)) + minRoomSize
    const x = Math.floor(rng() * (map[0].length - width))
    const y = Math.floor(rng() * (map.length - height))

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
