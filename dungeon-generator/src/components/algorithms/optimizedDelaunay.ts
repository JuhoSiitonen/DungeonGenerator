import { pointsEqual } from "./helpers";
import type { Point, Triangle } from "./types";


interface TriangleWithAdjacency extends Triangle {
    id: number;
    neighbors: [number | null, number | null, number | null];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TriangulationWalker {
    private triangles: Map<number, TriangleWithAdjacency> = new Map();
    private nextId = 0;
    private lastTriangle: TriangleWithAdjacency | null = null;

     addTriangle(triangle: Triangle): TriangleWithAdjacency {
        const enhancedTriangle: TriangleWithAdjacency = {
            ...triangle,
            id: this.nextId++,
            neighbors: [null, null, null]
        };
        
        this.triangles.set(enhancedTriangle.id, enhancedTriangle);
        this.updateAdjacencies(enhancedTriangle);
        this.lastTriangle = enhancedTriangle;
        
        return enhancedTriangle;
    }

    private updateAdjacencies(newTriangle: TriangleWithAdjacency): void {
        const newEdges = [
            { a: newTriangle.coordinates[0], b: newTriangle.coordinates[1], side: 0 },
            { a: newTriangle.coordinates[1], b: newTriangle.coordinates[2], side: 1 },
            { a: newTriangle.coordinates[2], b: newTriangle.coordinates[0], side: 2 }
        ];

        // Etsitään kaikki reunat, jotka ovat yhteydessä uusiin reunoihin
        // ja päivitetään naapuruussuhteet
        for (const edge of newEdges) {
            for (const [id, triangle] of this.triangles) {
                if (id === newTriangle.id) continue;

                const triangleEdges = [
                    { a: triangle.coordinates[0], b: triangle.coordinates[1], side: 0 },
                    { a: triangle.coordinates[1], b: triangle.coordinates[2], side: 1 },
                    { a: triangle.coordinates[2], b: triangle.coordinates[0], side: 2 }
                ];

                for (const triangleEdge of triangleEdges) {
                    if (this.edgesAdjacent(edge, triangleEdge)) {
                        newTriangle.neighbors[edge.side] = triangle.id;
                        triangle.neighbors[triangleEdge.side] = newTriangle.id;
                        break;
                    }
                }
            }
        }
    }

    private edgesAdjacent(edge1: { a: Point; b: Point }, edge2: { a: Point; b: Point }): boolean {
        
        return (
            (pointsEqual(edge1.a, edge2.b) && pointsEqual(edge1.b, edge2.a)) ||
            (pointsEqual(edge1.a, edge2.a) && pointsEqual(edge1.b, edge2.b))
        );
    }
}

// Tästä tulisi jatkaa ratkaisemalla se miten triangulaation kävelijä löytää lähimmän kolmion
// ja miten se navigoi triangulaation läpi. Se miten löydetään lähin kolmio on vielä epäselvää. 
// Enkä ole ihan varma onko tämä "kävelijän" runko vielä oikea suunta.