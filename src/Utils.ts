import Transform from "./Transform";

export type Point = {x: number, y: number};

export const Vector = {
    add: (a: Point, b: Point) => ({x: a.x + b.x, y: a.y + b.y}),
    subtract: (a: Point, b: Point) => ({x: a.x - b.x, y: a.y - b.y}),
    scale: (a: Point, s: number) => ({x: a.x * s, y: a.y * s}),
    magnitude: (a: Point) => Math.sqrt(a.x * a.x + a.y * a.y),
    magnitudeSquared: (a: Point) => a.x * a.x + a.y * a.y,
    distance: (a: Point, b: Point) => Vector.magnitude(Vector.subtract(a, b)),
    distanceSquared: (a: Point, b: Point) => Vector.magnitudeSquared(Vector.subtract(a, b)),
}

export type PathFunc = (t: number) => Point;
export type EventAction = () => void;
export type EasingFunction = (t: number) => number;
export const Easing = {
    linear: (t: number) => t,
    easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
}
export function interpolate(a: number, b: number, t:number, easing: EasingFunction = Easing.linear) {
    return a + (b - a) * easing(t);
}
export function interpolatePoint(a: Point, b: Point, t:number, easing: EasingFunction = Easing.linear) {
    return {x: interpolate(a.x, b.x, t, easing), y: interpolate(a.y, b.y, t, easing)};
}
export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}
export function lerpPoint(a: Point, b: Point, t: number) {
    return {x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t)};
}

export type Task = Generator<void, void, number>;
export function *wait(time: number) : Task {
    let counter = time;
    while(counter > 0) {
        counter -= yield;
    }
}
export function *waitUntil(condition: () => boolean) : Task {
    while(!condition()) {
        yield;
    }
}
export function *moveTo(transform: Transform, destination: Point, time: number) : Task {
    let counter = time;
    let start = transform.position;
    while(counter > 0) {
        counter -= yield;
        transform.position = lerpPoint(start, destination, 1-counter/time);
    }
}

export function *moveToEase(transform: Transform, destination: Point, time: number, easing: EasingFunction = Easing.linear) : Task {
    let counter = time;
    let start = transform.position;
    while(counter > 0) {
        counter -= yield;
        transform.position = interpolatePoint(start, destination, 1-counter/time, easing);
    }
}

export function randomPoint(bounds: {x: number, y: number, width: number, height: number}) : Point {
    return {x: bounds.x + Math.random() * bounds.width, y: bounds.y + Math.random() * bounds.height};
}
export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}