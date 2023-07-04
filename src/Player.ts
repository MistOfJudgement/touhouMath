import { BulletPath } from "./BulletPath";
import { Input } from "./Input";
import { presetPaths } from ".";
import { Game } from "./Game";
import { Entity } from "./Entity";

export class Player implements Entity {
    
    x: number = 0;
    y: number = 0;
    width: number = 50;
    height: number = 50;
    color: string = "red";
    speed: number = 0.25;
    cooldown: number = 0;
    timeBetweenShots: number = 1000;
    hitboxRadius: number = 10;
    hitboxColor: string = "green";
    state: "inactive" | "moving" | "firing" = "moving";
    selectedPath: (t: number) => { x: number; y: number; } = presetPaths.straight(0, 0, 0.5);
    currentPath: BulletPath | null = null;
    constructor() {

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    
        //draw cooldown
        if (this.cooldown > 0) {
            ctx.fillStyle = "blue";
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height * (this.cooldown / this.timeBetweenShots));
        }
        //draw hitbox
        ctx.fillStyle = this.hitboxColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.hitboxRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    handleMove(dt: number) {
        if (Input.instance.getState("up")) {
            this.y -= this.speed * dt;
        }
        if (Input.instance.getState("down")) {
            this.y += this.speed * dt;
        }
        if (Input.instance.getState("left")) {
            this.x -= this.speed * dt;
        }
        if (Input.instance.getState("right")) {
            this.x += this.speed * dt;
        }
        this.checkBounds();
    }

    checkBounds() {
        if (this.x - this.width / 2 < Game.instance.bounds.x) {
            this.x = Game.instance.bounds.x + this.width / 2;
        } else if (this.x + this.width / 2 > Game.instance.bounds.x + Game.instance.bounds.width) {
            this.x = Game.instance.bounds.x + Game.instance.bounds.width - this.width / 2;
        }
        if (this.y - this.height / 2 < Game.instance.bounds.y) {
            this.y = Game.instance.bounds.y + this.height / 2;
        }
        else if (this.y + this.height / 2 > Game.instance.bounds.y + Game.instance.bounds.height) {
            this.y = Game.instance.bounds.y + Game.instance.bounds.height - this.height / 2;
        }
        
    }
    update(dt: number) {
        switch (this.state) {
            case "inactive":
                this.state = "moving";
                break;
            case "moving":
                this.handleMove(dt);
                if (Input.instance.justPressed("fire")) {
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
        this.currentPath = new BulletPath(this.x, this.y, this.selectedPath, "blue", 5);
        Game.instance.spawn(this.currentPath);
    }

    collides(point: { x: number; y: number; }) {
        return Math.sqrt((point.x - this.x) ** 2 + (point.y - this.y) ** 2) < this.hitboxRadius;
    }
}
