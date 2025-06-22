/*
Pseudokoodi Bowyer-Watson algoritmille jolla toteutetaan Delaunay triangulaatio (lähde wikipedia)
Tämä on naiivi toteutus, joka ei ole optimoitu suorituskyvyn kannalta.

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

import type { RoomSpecifics } from "../types";
import type { Edge, Point, Triangle } from "./types";
import { circumCircleCalculator, edgesEqual, pointWithinCircle, superTriangleCalculator } from "./helpers";


export const delaunayTriangulation = (roomSpecifics: RoomSpecifics[]): Triangle[] => {
    if (roomSpecifics.length < 3) return []
    
    const triangulation : Triangle[] = []
    const points: Point[] = roomSpecifics.map((room) => ({
        x: room.xCenter,
        y: room.yCenter,
    }))

    // Lasketaan superkolmio, joka on tarpeeksi suuri kattamaan kaikki pisteet triangulaation alussa
    const superTriangle = superTriangleCalculator(points);
    triangulation.push(superTriangle);


    for (const point of points) {
        const badTriangles: Triangle[] = [];

        // Etsitään kaikki kolmiot, joiden ympyräpiiri sisältää pisteen
        for (const triangle of triangulation) {
            if (pointWithinCircle(point, triangle.circumcircle)) {
                badTriangles.push(triangle);
            }
        }

        const polygon: Edge[] = [];

        // Etsitään kaikki reunat, joita ei ole jaettu muiden huonojen kolmioiden kanssa
        for (const triangle of badTriangles) {
            const edges: Edge[] = [
                { a: triangle.coordinates[0], b: triangle.coordinates[1] },
                { a: triangle.coordinates[1], b: triangle.coordinates[2] },
                { a: triangle.coordinates[2], b: triangle.coordinates[0] }
            ]
        
            for (const edge of edges) {
                let isShared = false
                for (const otherTriangle of badTriangles) {
                    if (otherTriangle === triangle) continue
                    
                    const otherEdges: Edge[] = [
                        { a: otherTriangle.coordinates[0], b: otherTriangle.coordinates[1] },
                        { a: otherTriangle.coordinates[1], b: otherTriangle.coordinates[2] },
                        { a: otherTriangle.coordinates[2], b: otherTriangle.coordinates[0] }
                    ]
                    
                    for (const otherEdge of otherEdges) {
                        if (edgesEqual(edge, otherEdge)) {
                            isShared = true
                            break
                        }
                    }
                    if (isShared) break
                }
                
                // Jos reunaa ei ole jaettu muiden huonojen kolmioiden kanssa, lisätään se monikulmioon
                if (!isShared) {
                    polygon.push(edge)
                }
            }
        }

        for (const badTriangle of badTriangles) {
            const index = triangulation.indexOf(badTriangle)
            if (index > -1) {
                triangulation.splice(index, 1)
            }
        }
        

        // Luodaan uudet kolmiot monikulmion reunoista ja silmukan tämän hetkisestä point arvosta
        //  ja lisätään ne triangulaatioon
        for (const edge of polygon) {
            const newTriangle: Point[] = [edge.a, edge.b, point]
            const circumcircle = circumCircleCalculator(newTriangle[0], newTriangle[1], newTriangle[2])
            if (!circumcircle) {
                continue // Jos ympyräpiiriä ei voida laskea, ohitetaan
            }
            triangulation.push({
                coordinates: newTriangle,
                circumcircle: circumcircle
            })
        }
    }

    // Lopuksi poistetaan kolmiot joissa on vielä superkolmion kärkiä
    const finalTriangulation = triangulation.filter(triangle => {
        for (const vertex of triangle.coordinates) {
            
            for (const superVertex of superTriangle.coordinates) {
                if (vertex.x === superVertex.x && vertex.y === superVertex.y) {
                    return false
                }
            }
        }
        return true
    })
    return finalTriangulation
}
