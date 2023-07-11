import { Entity } from "./Entity";
import { DrawnRectSprite, Sprite } from "./Sprite";
import Transform from "./Transform";
import { Point } from "./Utils";

export class Boss implements Entity {
    transform: Transform = new Transform({x: 80, y: 80});
    sprite: Sprite = new DrawnRectSprite(this.transform, 50, 50, "green");

    draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
    }
    update(dt: number): void {

    }
}