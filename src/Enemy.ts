import { BulletPath } from "./BulletPath";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { Point } from "./Vec2";
 
export class Enemy implements Entity{
    x: number = 0;
    y: number = 0;
    width: number = 30;
    height: number = 30;
    color: string = "blue";
    speed: number = 0.15;
    timeBetweenShots: number = 1000;

    cooldown: number = 0;
    constructor();
    constructor(x: number = 0, y: number = 0,
                width: number = 30, height: number = 30,
                color: string = "blue", speed: number = 0.15,
                timeBetweenShots: number = 1000) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.timeBetweenShots = timeBetweenShots;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    update(dt: number): void {
        //buzzes around randomly for now
        this.x += (Math.random() - 0.5) * this.speed * dt;
        this.y += (Math.random() - 0.5) * this.speed * dt;

        if (this.cooldown > 0) {
            this.cooldown -= dt;
        } else {
            this.fire();
            this.cooldown = this.timeBetweenShots;
        }
    }
    collides(point: Point) {
        return point.x > this.x - this.width / 2 &&
            point.x < this.x + this.width / 2 &&
            point.y > this.y - this.height / 2 &&
            point.y < this.y + this.height / 2;
            
    }
    fire() {
        //single aimed shot
        let player = Game.instance.player;
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let angle = Math.atan2(dy, dx);
        let bullet = new BulletPath(this.x, this.y, (t) => {
            let speed = 0.4;
            return {x: speed * t * Math.cos(angle), y: speed * t * Math.sin(angle)};
        }
        , "red", 5, 1, 50);
        Game.instance.spawn(bullet);

    }
}