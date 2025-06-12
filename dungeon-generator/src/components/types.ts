import type { MST, Point, Triangle } from "./algorithms/types"

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
  showMSTWeights: boolean
}

export type DungeonMapProps = {
  dungeon: DungeonMapMatrix
  tileSize?: number
  roomSpecifics: RoomSpecifics[]
  visualOptions: VisualOptions
  triangulation: Triangle[]
  mst: MST
  mstEdges: Array<{ start: Point, end: Point }>
}

export interface RoomSpecifics {
  width: number,
  height: number,
  xCenter: number,
  yCenter: number
}

export interface AStarNode {
  point: Point;
  gCost: number;  
  hCost: number;  
  fCost: number;
  parent: AStarNode | null;
}

export interface PathfindingResult {
  path: Point[];
  found: boolean;
}