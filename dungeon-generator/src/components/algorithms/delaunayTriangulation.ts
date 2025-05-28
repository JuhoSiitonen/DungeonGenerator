 

/*
Pseudokoodi Bowyer-Watson algoritmille jolla toteutetaan Delaunay triangulaatio (lähde wikipedia)

function BowyerWatson (pointList)
    // pointList is a set of coordinates defining the points to be triangulated
    triangulation := empty triangle mesh data structure
    add super-triangle to triangulation // must be large enough to completely contain all the points in pointList
    for each point in pointList do // add all the points one at a time to the triangulation
        badTriangles := empty set
        for each triangle in triangulation do // first find all the triangles that are no longer valid due to the insertion
            if point is inside circumcircle of triangle
                add triangle to badTriangles
        polygon := empty set
        for each triangle in badTriangles do // find the boundary of the polygonal hole
            for each edge in triangle do
                if edge is not shared by any other triangles in badTriangles
                    add edge to polygon
        for each triangle in badTriangles do // remove them from the data structure
            remove triangle from triangulation
        for each edge in polygon do // re-triangulate the polygonal hole
            newTri := form a triangle from edge to point
            add newTri to triangulation
    for each triangle in triangulation // done inserting points, now clean up
        if triangle contains a vertex from original super-triangle
            remove triangle from triangulation
    return triangulation
*/

import type { RoomSpecifics } from "../../App";
import type { Edge, Point, Triangle } from "./types";
import { pointWithinCircle, superTriangleCalculator } from "./helpers";


export const delaunayTriangulation = (roomSpecifics: RoomSpecifics[]): Triangle[] => {
    if (roomSpecifics.length < 3) return []
    
    const triangulation : Triangle[] = []
    const points: Point[] = roomSpecifics.map((room) => ({
        x: room.xCenter,
        y: room.yCenter,
    }))

    const superTriangle = superTriangleCalculator(points);
    triangulation.push(superTriangle);

    for (const point of points) {
        const badTriangles: Triangle[] = [];

        for (const triangle of triangulation) {
            if (pointWithinCircle(point, triangle.circumcircle)) {
                badTriangles.push(triangle);
            }
        }

        const polygon: Edge[] = [];
        
    }
}