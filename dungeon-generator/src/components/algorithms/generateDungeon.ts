import type { DungeonMapMatrix, RoomSpecifics } from "../types";
import { createCorridorsFromMST} from "./aStar";
import { createMapAndRooms } from "./createMapAndRooms";
import { delaunayTriangulation } from "./delaunayTriangulation";
import { getMSTLines, primsAlgorithm } from "./minimumSpanningTree";
import type { MST, Point, Triangle } from "./types";

// Tämä funktio kutsuu muita algoritmeja luodakseen luolaston, jossa on huoneita ja käytäviä.
// corridorType ei ole vielä käytössä, mutta ajattelin vielä tehdä jonkin muun kuin A* algoritmin käytäville
export const generateDungeon = (
  numberOfRooms: number, 
  seed: string, 
  _corridorType: 'astar', 
  allowDiagonalCorridors: boolean, 
  manualRooms?: RoomSpecifics[]
): { 
  roomSpecifics: RoomSpecifics[]; 
  map: DungeonMapMatrix; 
  triangulation: Triangle[]; 
  mst: MST,
  mstEdges: Array<{start: Point, end: Point}>} => {

  const { roomSpecifics, map } = manualRooms ? createMapAndRooms(manualRooms.length, seed, manualRooms) : createMapAndRooms(numberOfRooms, seed);
  const triangles = delaunayTriangulation(roomSpecifics)
  const mst = primsAlgorithm(triangles)
  const mstEdges: Array<{start: Point, end: Point}> = getMSTLines(mst)
  const mapWithRoomsAndCorridors = createCorridorsFromMST(map, mstEdges, allowDiagonalCorridors)
  
  return { roomSpecifics, map: mapWithRoomsAndCorridors, triangulation: triangles, mst, mstEdges };
}
