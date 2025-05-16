export type Tile = 'empty' | 'room' | 'corridor'

export type DungeonMapMatrix = Tile[][]

export function createEmptyMap(width: number, height: number): DungeonMapMatrix {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 'empty')
  )
}

export function createRoom(
  map: DungeonMapMatrix,
  numberOfRooms: number,
): void {
  let roomCount = 0
  while ( roomCount < numberOfRooms ) {
  // Sattumanvaraiset leveys ja korkeus huoneelle
  const width = Math.floor(Math.random() * (map[0].length /4))
  const height = Math.floor(Math.random() * (map.length /4))
  // Sattumanvaraiset x ja y koordinaatit huoneelle
  const x = Math.floor(Math.random() * (map[0].length - width))
  const y = Math.floor(Math.random() * (map.length - height))
  // Tarkistetaan että huone on tyhjä
  for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
      if (map[i][j] !== 'empty') {
        return 
      }
    }
  }
  // Täytetään huone 'room' laatoilla
  for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
      map[i][j] = 'room'
    }
  }
  roomCount++
}}