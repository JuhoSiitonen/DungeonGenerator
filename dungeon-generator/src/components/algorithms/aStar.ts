import type { DungeonMapMatrix, PathfindingResult, AStarNode } from "../types";
import { isValidPoint, isWalkable, manhattanDistance, getNeighbors4, getDiagonalNeighbors, calculateDistance, getMovementCost } from "./helpers";
import type { Point } from "./types";

/*
PSEUDOKOODI A* ALGORITMILLE

function reconstruct_path(cameFrom, current)
    total_path := {current}
    while current in cameFrom.Keys:
        current := cameFrom[current]
        total_path.prepend(current)
    return total_path

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function A_Star(start, goal, h)
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // This is usually implemented as a min-heap or priority queue rather than a hash-set.
    openSet := {start}

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
    // to n currently known.
    cameFrom := an empty map

    // For node n, gScore[n] is the currently known cost of the cheapest path from start to n.
    gScore := map with default value of Infinity
    gScore[start] := 0

    // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
    // how cheap a path could be from start to finish if it goes through n.
    fScore := map with default value of Infinity
    fScore[start] := h(start)

    while openSet is not empty
        // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
        current := the node in openSet having the lowest fScore[] value
        if current = goal
            return reconstruct_path(cameFrom, current)

        openSet.Remove(current)
        for each neighbor of current
            // d(current,neighbor) is the weight of the edge from current to neighbor
            // tentative_gScore is the distance from start to the neighbor through current
            tentative_gScore := gScore[current] + d(current, neighbor)
            if tentative_gScore < gScore[neighbor]
                // This path to neighbor is better than any previous one. Record it!
                cameFrom[neighbor] := current
                gScore[neighbor] := tentative_gScore
                fScore[neighbor] := tentative_gScore + h(neighbor)
                if neighbor not in openSet
                    openSet.add(neighbor)

    // Open set is empty but goal was never reached
    return failure

*/


// A* algoritmi, joka etsii polun aloituspisteestä maaliin
export const findPath = (
  start: Point,
  goal: Point,
  map: DungeonMapMatrix,
  allowDiagonal: boolean,
  heuristic: 'manhattan' | 'direct' // Valinnainen heuristiikka, Manhattan tuottaa suoraviivaisempia polkuja
): PathfindingResult => {
  if (!isValidPoint(start, map) || !isValidPoint(goal, map)) {
    return { path: [], found: false };
  }

  if (!isWalkable(start, map) || !isWalkable(goal, map)) {
    return { path: [], found: false };
  }

  const nodeArray: AStarNode[] = [];
  const closedSet = new Set<string>();
  const heuristicFn = heuristic === 'manhattan' ? manhattanDistance : calculateDistance;
  const getNeighbors = allowDiagonal ? getDiagonalNeighbors : getNeighbors4;

  // Luodaan aloitus solmu
  // A* solmu sisältää pisteen, gCost (kustannus aloituspisteestä tähän pisteeseen), hCost (heuristiikka maaliin) ja fCost (gCost + hCost)
  const startNode: AStarNode = {
    point: start,
    gCost: 0,
    hCost: heuristicFn(start, goal),
    fCost: 0,
    parent: null
  };
  startNode.fCost = startNode.gCost + startNode.hCost;

  nodeArray.push(startNode);

  // Etsi solmu, jolla on pienin fCost
  // Jos useammalla solmulla on sama fCost, valitaan se, jolla on pienin hCost
  while (nodeArray.length > 0) {
    let currentIndex = 0;
    for (let i = 1; i < nodeArray.length; i++) {
      if (nodeArray[i].fCost < nodeArray[currentIndex].fCost ||
          (nodeArray[i].fCost === nodeArray[currentIndex].fCost && nodeArray[i].hCost < nodeArray[currentIndex].hCost)) {
        currentIndex = i;
      }
    }

    const currentNode = nodeArray[currentIndex];
    nodeArray.splice(currentIndex, 1);

    const currentKey = `${currentNode.point.x},${currentNode.point.y}`;
    closedSet.add(currentKey);

    // Tarkista, onko nykyinen solmu maali, jos on, palauta polku
    if (currentNode.point.x === goal.x && currentNode.point.y === goal.y) {
      const path: Point[] = [];
      let node: AStarNode | null = currentNode;
      while (node !== null) {
        path.unshift(node.point); // Polku kasataan käänteisessä järjestyksessä joten siksi unshift
        node = node.parent;
      }
      return { path, found: true };
    }

    // Käydään läpi kaikki naapurit ja lisätään ne nodeArray:hin, jos ne ovat käveltäviä
    // Jos naapuri on jo nodeArray:ssä, päivitetään sen gCost ja parent, jos uusi polku on parempi
    const neighbors = getNeighbors(currentNode.point);
    for (const neighborPoint of neighbors) {
      const neighborKey = `${neighborPoint.x},${neighborPoint.y}`;

      if (!isWalkable(neighborPoint, map) || closedSet.has(neighborKey)) {
        continue;
      }

      const tentativeGCost = currentNode.gCost + getMovementCost(currentNode.point, neighborPoint);

      // Tarkista, onko naapuri jo nodeArray:ssä, jos ei ole, luodaan uusi solmu
      // Jos on, tarkistetaan, onko uusi polku parempi (pienempi gCost)
      const existingNeighbor = nodeArray.find(node => 
        node.point.x === neighborPoint.x && node.point.y === neighborPoint.y
      );

      if (!existingNeighbor) {
        // Lisätään uusi naapuri nodeArray:hin jos sitä ei ole nodeArray:ssä
        const neighborNode: AStarNode = {
          point: neighborPoint,
          gCost: tentativeGCost,
          hCost: heuristicFn(neighborPoint, goal),
          fCost: 0,
          parent: currentNode
        };
        neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;
        nodeArray.push(neighborNode);
      } else if (tentativeGCost < existingNeighbor.gCost) {
        // Päivitään naapurin gCost ja parent, jos uusi polku on parempi
        existingNeighbor.gCost = tentativeGCost;
        existingNeighbor.fCost = existingNeighbor.gCost + existingNeighbor.hCost;
        existingNeighbor.parent = currentNode;
      }
    }
  }

  // Ei löydetty polkua maaliin :( 
  return { path: [], found: false };
};

// Luodaan käytävät MST:stä 
export const createCorridorsFromMST = (
  map: DungeonMapMatrix,
  mstEdges: Array<{start: Point, end: Point}>,
  allowDiagonal: boolean,
  directRouting: boolean
): DungeonMapMatrix => {
  const newMap = map.map(row => [...row]);

  for (const edge of mstEdges) {
    const pathResult = findPath(edge.start, edge.end, newMap, allowDiagonal, directRouting ? 'manhattan': 'direct');
    
    if (pathResult.found) {
      for (const point of pathResult.path) {
        if (newMap[point.y][point.x] === 'empty') {
          newMap[point.y][point.x] = 'corridor';
        }
      }
    }
  }

  return newMap;
};

