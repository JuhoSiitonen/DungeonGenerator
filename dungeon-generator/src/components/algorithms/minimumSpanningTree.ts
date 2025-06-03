import { calculateDistance, getUniquePoints, pointsEqual } from "./helpers";
import type { Point, Triangle, MST, WeightedEdge } from "./types";


// Lasketaan reunojen painot triangulaatiosta
export const triangulationToEdges = (triangulation: Triangle[]): WeightedEdge[] => {
    const edgeMap = new Map<string, WeightedEdge>();
    
    for (const triangle of triangulation) {
        const [p1, p2, p3] = triangle.coordinates;
        
        
        const edges = [
            { a: p1, b: p2 },
            { a: p2, b: p3 },
            { a: p3, b: p1 }
        ];
        
        for (const edge of edges) {
            const key1 = `${edge.a.x},${edge.a.y}-${edge.b.x},${edge.b.y}`;
            const key2 = `${edge.b.x},${edge.b.y}-${edge.a.x},${edge.a.y}`;
            
            if (!edgeMap.has(key1) && !edgeMap.has(key2)) {
                const weightedEdge: WeightedEdge = {
                    ...edge,
                    weight: calculateDistance(edge.a, edge.b)
                };
                edgeMap.set(key1, weightedEdge);
            }
        }
    }
    
    return Array.from(edgeMap.values());
};


export const primsAlgorithm = (triangulation: Triangle[]): MST => {
    if (triangulation.length === 0) {
        return { edges: [], totalWeight: 0 };
    }
    
    const edges = triangulationToEdges(triangulation);
    const points = getUniquePoints(triangulation);
    
    if (points.length === 0) {
        return { edges: [], totalWeight: 0 };
    }
    
    if (points.length === 1) {
        return { edges: [], totalWeight: 0 };
    }
    
    const mstEdges: WeightedEdge[] = [];
    const inMST = new Set<string>();
    const candidates: WeightedEdge[] = [];
    
    // Aloitetaan MST ensimmäisestä pisteestä
    const startPoint = points[0];
    inMST.add(`${startPoint.x},${startPoint.y}`);
    
    // Etsitään kaikki reunat, jotka yhdistävät aloituspisteen muihin pisteisiin
    for (const edge of edges) {
        if (pointsEqual(edge.a, startPoint) || pointsEqual(edge.b, startPoint)) {
            candidates.push(edge);
        }
    }
    
    while (mstEdges.length < points.length - 1 && candidates.length > 0) {
        candidates.sort((a, b) => a.weight - b.weight);
        
        // Etsitään reunat, jotka yhdistävät MST:n ulkopuolisiin pisteisiin
        let minEdgeIndex = -1;
        
        for (let i = 0; i < candidates.length; i++) {
            const edge = candidates[i];
            const aKey = `${edge.a.x},${edge.a.y}`;
            const bKey = `${edge.b.x},${edge.b.y}`;
            
            const aInMST = inMST.has(aKey);
            const bInMST = inMST.has(bKey);
            
            // Varmistetaan, että reunassa on yksi piste MST:ssä ja toinen ei
            if (aInMST !== bInMST) {
                minEdgeIndex = i;
                break;
            }
        }
        
        if (minEdgeIndex === -1) {
            break;
        }
        
        const minEdge = candidates[minEdgeIndex];
        mstEdges.push(minEdge);
        candidates.splice(minEdgeIndex, 1);
        
        const aKey = `${minEdge.a.x},${minEdge.a.y}`;
        const bKey = `${minEdge.b.x},${minEdge.b.y}`;
        const newPoint = inMST.has(aKey) ? minEdge.b : minEdge.a;
        const newPointKey = inMST.has(aKey) ? bKey : aKey;
        
        inMST.add(newPointKey);
        
        // Käydään läpi kaikki reunat ja lisätään ne, jotka yhdistävät uuden pisteen MST:hen
        for (const edge of edges) {
            if (pointsEqual(edge.a, newPoint) || pointsEqual(edge.b, newPoint)) {
                const edgeAKey = `${edge.a.x},${edge.a.y}`;
                const edgeBKey = `${edge.b.x},${edge.b.y}`;
                
                // Lisätään vain jos se yhdistää pisteen, joka ei ole vielä MST:ssä
                if (inMST.has(edgeAKey) !== inMST.has(edgeBKey)) {
                    // Tarkistetaan, että reunaa ei ole jo ehdokkaissa
                    const alreadyCandidate = candidates.some(candidate => 
                        (pointsEqual(candidate.a, edge.a) && pointsEqual(candidate.b, edge.b)) ||
                        (pointsEqual(candidate.a, edge.b) && pointsEqual(candidate.b, edge.a))
                    );
                    
                    if (!alreadyCandidate) {
                        candidates.push(edge);
                    }
                }
            }
        }
    }
    
    const totalWeight = mstEdges.reduce((sum, edge) => sum + edge.weight, 0);
    
    return {
        edges: mstEdges,
        totalWeight
    };
};

// Apufunktio, joka palauttaa MST:n reunat piirrettäväksi HTML Canvasissa
export const getMSTLines = (mst: MST): Array<{start: Point, end: Point}> => {
    return mst.edges.map(edge => ({
        start: edge.a,
        end: edge.b,
    }));
};