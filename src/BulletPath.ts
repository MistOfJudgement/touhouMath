import { Enemy } from "./Enemy";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { Point, Vector } from "./Vec2";
export class BulletPath implements Entity {
    x: number;
    y: number;
    pathFunction: (t: number) => { x: number; y: number; };
    color: string;
    radius: number;
    count: number;
    spawnrate: number;
    spawnTimer: number = 0;
    activebullets: number[] = []; //bullet times
    timeToLive: number = 6_000;
    constructor(x: number, y: number, pathfunc: (t: number) => { x: number; y: number; }, color: string, radius: number, count: number = 5, spawnrate: number = 100) {
        this.x = x;
        this.y = y;
        this.pathFunction = pathfunc;
        this.color = color;
        this.radius = radius;
        this.count = count;
        this.spawnrate = spawnrate;
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
        for (let i = 0; i < this.timeToLive; i+=1) {
            let bullet = this.pathFunction(i);
            ctx.lineTo(this.x + bullet.x, this.y + bullet.y);
        }
        ctx.stroke();
    }
    boundsCheck(point: Point, margin: number = 0) {
        //Checks if the point is at the edge of the screen with some margin
        return point.x < Game.instance.bounds.x - margin ||
            point.x > Game.instance.bounds.x + Game.instance.bounds.width + margin ||
            point.y < Game.instance.bounds.y - margin ||
            point.y > Game.instance.bounds.y + Game.instance.bounds.height + margin;
    }
    update(dt :number) {
        if (this.completed) {
            Game.instance.remove(this);
            return;
        }
        for (let i = 0; i < this.activebullets.length; i++) {
            this.activebullets[i]+=dt;
            if (this.activebullets[i] > this.timeToLive) {
                this.activebullets.splice(i, 1);
                i--;
            } else if (this.boundsCheck(Vector.add({x: this.x, y: this.y}, this.pathFunction(this.activebullets[i])), 40)) {
                this.activebullets.splice(i, 1);
                i--;

                //change the time to live to the time it took to get to the edge
                //TODO i want to set time to live such that it is set initially
                if(this.timeToLive > this.activebullets[i]) {
                    this.timeToLive = this.activebullets[i];
                }
            }
            if (this.color == "blue") {
                for(const enemy of Game.instance.enemies) {
                    if (enemy.collides(Vector.add({x: this.x, y: this.y}, this.pathFunction(this.activebullets[i])))) {
                        this.activebullets.splice(i, 1);
                        i--;
                        Game.instance.remove(enemy);
                    }
                }
            }
        }

        if (this.count > 0) {
            if (this.spawnTimer > 0) {
                this.spawnTimer -= dt;
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

    bulletAt(t: number) {
        return Vector.add({x: this.x, y: this.y}, this.pathFunction(t));
    }
}
