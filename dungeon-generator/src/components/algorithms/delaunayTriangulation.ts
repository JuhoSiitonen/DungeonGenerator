/* eslint-disable @typescript-eslint/no-unused-vars */

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

export interface Point {
    x: number
    y: number
}

export interface Triangle {
    coordinates: Point[]
    circumcircle: CircumCircle
} 

export interface CircumCircle {
    center: Point
    radius: number
}

export const circumCircleCalculator = (a: Point, b: Point, c: Point): CircumCircle  => {
    // Lasketaan kolmion pisteet sisältävän ympyrän keskipiste ja säde
    // Käytetään kaavaa: https://en.wikipedia.org/wiki/Circumcircle   -> Osio Circumcenter coordinates - Cartesian coordinates

    // TODO: tarkista että pisteet eivät ole suorassa linjassa

    const d = 2 * (a.x * ( c.y - b.y) + b.x * (a.y - c.y) + c.x * (b.y - a.y))
    const x = ((a.x ** 2 + a.y ** 2) * (c.y - b.y) + (b.x ** 2 + b.y ** 2) * (a.y - c.y) + (c.x ** 2 + c.y ** 2) * (b.y - a.y)) / d
    const y = ((a.x ** 2 + a.y ** 2) * (b.x - c.x) + (b.x ** 2 + b.y ** 2) * (c.x - a.x) + (c.x ** 2 + c.y ** 2) * (a.x - b.x)) / d

    return {
        center: { x, y },
        radius: Math.sqrt((a.x - x) ** 2 + (a.y - y) ** 2)
    }
}

export const pointWithinCircle = (p: Point, circle: CircumCircle): boolean => {
  const dx = p.x - circle.center.x
  const dy = p.y - circle.center.y
  const distSq = dx * dx + dy * dy
  return distSq < circle.radius * circle.radius
}

export const delaunayTriangulation = (roomSpecifics: RoomSpecifics[]) => {
    const triangulation : Triangle[] = []
    const points: Point[] = roomSpecifics.map((room) => ({
        x: room.xCenter,
        y: room.yCenter,
    }))
}