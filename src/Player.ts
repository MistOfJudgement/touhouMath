import { BulletPath } from "./BulletPath";
import { Input } from "./Input";
import { presetPaths, Game } from ".";
import { Entity } from "./Entity";

export class Player implements Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;
    cooldown: number = 0;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.color = "red";
        this.speed = 5;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        if (Input.instance.up) {
            this.y -= this.speed;
        }
        if (Input.instance.down) {
            this.y += this.speed;
        }
        if (Input.instance.left) {
            this.x -= this.speed;
        }
        if (Input.instance.right) {
            this.x += this.speed;
        }
        if (Input.instance.fire) {
            this.fire();
        }
        this.cooldown--;
    }

    fire() {
        if (this.cooldown > 0) {
            return;
        }
        this.cooldown = 10;
        //shoot straight forward
        let bullet = new BulletPath(this.x, this.y, presetPaths.sin(this.x, this.y, 4), "black", 5);
        Game.instance.spawn(bullet);
        bullet.fire();
    }
}
