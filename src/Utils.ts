export type Point = {x: number, y: number};

export const Vector = {
    add: (a: Point, b: Point) => ({x: a.x + b.x, y: a.y + b.y}),
    subtract: (a: Point, b: Point) => ({x: a.x - b.x, y: a.y - b.y}),
    scale: (a: Point, s: number) => ({x: a.x * s, y: a.y * s}),
    magnitude: (a: Point) => Math.sqrt(a.x * a.x + a.y * a.y),
}

export type PathFunc = (t: number) => Point;
export type EventAction = () => void;