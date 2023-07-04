import { BulletPath } from "./BulletPath";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { Point, Vector } from "./Utils";
 
export class Enemy implements Entity{
    position: Point = {x: 0, y: 0};
    width: number = 30;
    height: number = 30;
    color: string = "blue";
    speed: number = 0.15;
    timeBetweenShots: number = 1000;

    cooldown: number = 0;
    constructor();
    constructor(spawn: Point = {x:0, y:0},
                width: number = 30, height: number = 30,
                color: string = "blue", speed: number = 0.15,
                timeBetweenShots: number = 1000) {
        this.position = spawn;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.timeBetweenShots = timeBetweenShots;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
    }
    update(dt: number): void {
        //buzzes around randomly for now
        // this.x += (Math.random() - 0.5) * this.speed * dt;
        // this.y += (Math.random() - 0.5) * this.speed * dt;
        this.position = {x: this.position.x + (Math.random() - 0.5) * this.speed * dt,
                            y: this.position.y + (Math.random() - 0.5) * this.speed * dt};
        if (this.cooldown > 0) {
            this.cooldown -= dt;
        } else {
            this.fire();
            this.cooldown = this.timeBetweenShots;
        }
    }
    collides(point: Point) {
        return point.x > this.position.x - this.width / 2 &&
            point.x < this.position.x + this.width / 2 &&
            point.y > this.position.y - this.height / 2 &&
            point.y < this.position.y + this.height / 2;
            
    }
    fire() {
        //single aimed shot
        let player = Game.instance.player;
        let slope = Vector.subtract(player.position, this.position);
        let angle = Math.atan2(slope.y, slope.x);
        let bullet = new BulletPath(this.position, (t) => {
            let speed = 0.4;
            return {x: speed * t * Math.cos(angle), y: speed * t * Math.sin(angle)};
        }
        , "red", 5, 1, 50);
        Game.instance.spawn(bullet);

    }
}