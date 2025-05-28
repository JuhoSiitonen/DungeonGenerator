
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

export interface Edge {
    a: Point
    b: Point
}