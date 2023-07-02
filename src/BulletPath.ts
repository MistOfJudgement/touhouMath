import { Entity } from "./Entity";
import { Game } from "./Game";

export class BulletPath implements Entity {
    x: number;
    y: number;
    pathFunction: (t: number) => { x: number; y: number; };
    color: string;
    radius: number;
    count: number = 5;
    spawnrate: number = 10;
    spawnTimer: number = 0;
    activebullets: number[] = []; //bullet times
    constructor(x: number, y: number, pathfunc: (t: number) => { x: number; y: number; }, color: string, radius: number) {
        this.x = x;
        this.y = y;
        this.pathFunction = pathfunc;
        this.color = color;
        this.radius = radius;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.drawPath(ctx);
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.activebullets.length; i++) {
            let bullet = this.pathFunction(this.activebullets[i]);
            ctx.beginPath();
            ctx.arc(this.x + bullet.x, this.y + bullet.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    drawPath(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        for (let i = 0; i < 100; i++) {
            let bullet = this.pathFunction(i);
            ctx.lineTo(this.x + bullet.x, this.y + bullet.y);
        }
        ctx.stroke();
    }

    update(dt :number) {
        if (this.completed) {
            Game.instance.remove(this);
            return;
        }
        for (let i = 0; i < this.activebullets.length; i++) {
            this.activebullets[i]++;
            if (this.activebullets[i] > 100) {
                this.activebullets.splice(i, 1);
                i--;
            }
        }

        if (this.count > 0) {
            if (this.spawnTimer > 0) {
                this.spawnTimer--;
            }
            else {
                this.activebullets.push(0);
                this.spawnTimer = this.spawnrate;
                this.count--;
            }
        }
    }

    get completed() {
        return this.count == 0 && this.activebullets.length == 0;
    }
}
