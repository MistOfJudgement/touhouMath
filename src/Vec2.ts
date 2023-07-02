export type Point = {x: number, y: number};

export const Vector = {
    add: (a: Point, b: Point) => ({x: a.x + b.x, y: a.y + b.y}),
}