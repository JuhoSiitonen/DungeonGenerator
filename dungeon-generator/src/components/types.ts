import type { MST, Point, Triangle } from "./algorithms/types"

export type Tile = 'empty' | 'room' | 'corridor' | 'wall'

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
  showRoomNumbers: boolean
  showMST: boolean
  showMSTWeights: boolean
  showCorridors: boolean
}

export type DungeonMapProps = {
  dungeon: DungeonMapMatrix
  tileSize?: number
  roomSpecifics: RoomSpecifics[]
  visualOptions: VisualOptions
  triangulation: Triangle[]
  mst: MST
}

export interface ManualRoomInputProps {
  rooms: RoomSpecifics[]
  onAddRoom: () => void
  onRemoveRoom: (index: number) => void
  onUpdateRoom: (index: number, field: keyof RoomSpecifics, value: number) => void
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