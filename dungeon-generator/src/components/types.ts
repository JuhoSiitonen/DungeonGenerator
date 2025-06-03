
export type Tile = 'empty' | 'room' | 'corridor'

export type DungeonMapMatrix = Tile[][]

export type DungeonMapProps = {
  dungeon: DungeonMapMatrix
  tileSize?: number
  roomSpecifics: RoomSpecifics[]
  visualOptions: {
    showTriangles: boolean
    showCircumcircles: boolean
    showRoomCenters: boolean
    showRoomNumbers: boolean
    showMST: boolean
  }
}

export interface RoomSpecifics {
  width: number,
  height: number,
  xCenter: number,
  yCenter: number
}