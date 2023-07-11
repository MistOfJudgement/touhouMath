import Transform from "./Transform";

export interface Sprite {
    draw(ctx: CanvasRenderingContext2D): void;
}

export class DrawnRectSprite implements Sprite {
    constructor(public transform: Transform, public width: number, public height: number, public color: string) {
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.transform.position.x - this.width / 2, this.transform.position.y - this.height / 2, this.width, this.height);
    }
}