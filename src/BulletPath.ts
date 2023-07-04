import { Enemy } from "./Enemy";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { PathFunc, Point, Vector } from "./Utils";

export function drawPath(ctx: CanvasRenderingContext2D, origin: Point, pathFunc : PathFunc, length: number = 1000, color: string = "black") {
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    for (let i = 0; i < length; i+=1) {
        let bullet = pathFunc(i);
        ctx.lineTo(origin.x + bullet.x, origin.y + bullet.y);
    }
    ctx.stroke();
}
export class BulletPath implements Entity {
    origin: Point;
    pathFunction: (t: number) => { x: number; y: number; };
    color: string;
    radius: number;
    count: number;
    spawnrate: number;

    spawnTimer: number = 0;
    activebullets: number[] = []; //bullet times
    timeToLive: number = 6_000;
    constructor(origin: Point,
                pathfunc: PathFunc, 
                color: string = "blue", 
                radius: number = 5, 
                count: number = 5, 
                spawnrate: number = 100) {
        this.origin = origin;
        this.pathFunction = pathfunc;
        this.color = color;
        this.radius = radius;
        this.count = count;
        this.spawnrate = spawnrate;
    }

    draw(ctx: CanvasRenderingContext2D) {
        drawPath(ctx, this.origin, this.pathFunction, 1000, this.color);
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.activebullets.length; i++) {
            let bullet = this.bulletAtTime(this.activebullets[i]);
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
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
            let bullet = this.bulletAtTime(this.activebullets[i]);
            if (this.activebullets[i] > this.timeToLive) {
                this.activebullets.splice(i, 1);
                i--;
            } else if (this.boundsCheck(bullet, 40)) {
                this.activebullets.splice(i, 1);
                i--;

                //change the time to live to the time it took to get to the edge
                //TODO i want to set time to live such that it is set initially
                if(this.timeToLive > this.activebullets[i]) {
                    this.timeToLive = this.activebullets[i];
                }
            }
            if (this.color == "blue") {//friendly bullets collide with enemies
                for(const enemy of Game.instance.enemies) {
                    if (enemy.collides(bullet)) {
                        this.activebullets.splice(i, 1);
                        i--;
                        Game.instance.remove(enemy);
                    }
                }
            } else if (this.color == "red") {//enemy bullets collide with player
                if (Game.instance.player.collides(bullet)) {
                    this.activebullets.splice(i, 1);
                    i--;
                    Game.instance.timesHit++;
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

    bulletAtTime(t: number) {
        return Vector.add(this.origin, this.pathFunction(t));
    }
}
