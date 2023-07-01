import { Entity } from "./Entity";

export class BulletPath implements Entity {
    x: number;
    y: number;
    pathFunction: (t: number) => { x: number; y: number; };
    color: string;
    radius: number;
    activebullets: number[] = []; //bullet times
    constructor(x: number, y: number, pathfunc: (t: number) => { x: number; y: number; }, color: string, radius: number) {
        this.x = x;
        this.y = y;
        this.pathFunction = pathfunc;
        this.color = color;
        this.radius = radius;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.activebullets.length; i++) {
            let bullet = this.pathFunction(this.activebullets[i]);
            ctx.beginPath();
            ctx.arc(this.x + bullet.x, this.y + bullet.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    update() {
        for (let i = 0; i < this.activebullets.length; i++) {
            this.activebullets[i]++;
            if (this.activebullets[i] > 100) {
                this.activebullets.splice(i, 1);
                i--;
            }
        }
    }

    fire() {
        this.activebullets.push(0);
    }
}
