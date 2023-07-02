import { BulletPath } from "./BulletPath";
import { Input } from "./Input";
import { presetPaths } from ".";
import { Game } from "./Game";
import { Entity } from "./Entity";

export class Player implements Entity {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;
    cooldown: number = 0;
    timeBetweenShots: number = 1000;
    state: "inactive" | "moving" | "firing" = "moving";
    currentPath: BulletPath | null = null;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.color = "red";
        this.speed = 0.25;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    handleMove(dt: number) {
        if (Input.instance.up) {
            this.y -= this.speed * dt;
        }
        if (Input.instance.down) {
            this.y += this.speed * dt;
        }
        if (Input.instance.left) {
            this.x -= this.speed * dt;
        }
        if (Input.instance.right) {
            this.x += this.speed * dt;
        }
    }
    update(dt: number) {
        switch (this.state) {
            case "inactive":
                this.state = "moving";
                break;
            case "moving":
                this.handleMove(dt);
                if (Input.instance.fire) {
                    this.fire();
                }
                if (this.cooldown > 0) {
                    this.cooldown -= dt;
                }
                break;
            case "firing":
                if (this.currentPath) {
                    // this.currentPath.update(dt);
                    if(this.currentPath.count == 0){
                        this.state = "moving";
                        this.currentPath = null;
                    }
                }
                break;
        }
        
    }

    fire() {
        if (this.cooldown > 0) {
            return;
        }
        this.state = "firing";
        this.cooldown = this.timeBetweenShots;
        this.currentPath = new BulletPath(this.x, this.y, presetPaths.sin(this.x, this.y, 0.5), "blue", 5);
        Game.instance.spawn(this.currentPath);
    }
}
