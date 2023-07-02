import { Entity } from "./Entity";

export class Enemy implements Entity{

    draw(ctx: CanvasRenderingContext2D): void {
        throw new Error("Method not implemented.");
    }
    update(dt: number): void {
        throw new Error("Method not implemented.");
    }
    
}