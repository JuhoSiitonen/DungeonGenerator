
export type Tile = 'empty' | 'room' | 'corridor'

export type DungeonMapMatrix = Tile[][]

export interface RoomSpecifics {
  width: number,
  height: number,
  xCenter: number,
  yCenter: number
}

export interface VisualOptions {
  showTriangles: boolean
  showCircumcircles: boolean
  showRoomCenters: boolean
  showRoomNumbers: boolean
  showMST: boolean
}

export type DungeonMapProps = {
  dungeon: DungeonMapMatrix
  tileSize?: number
  roomSpecifics: RoomSpecifics[]
  visualOptions: VisualOptions
}

export interface RoomSpecifics {
  width: number,
  height: number,
  xCenter: number,
  yCenter: number
}