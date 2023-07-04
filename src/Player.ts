import { BulletPath, drawPath } from "./BulletPath";
import { Input } from "./Input";
import { presetPaths } from ".";
import { Game } from "./Game";
import { Entity } from "./Entity";
import { Point, Vector } from "./Utils";
import { drawAxis } from "./Axis";

export class Player implements Entity {
    
    position: Point = {x: 0, y: 0};
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
        ctx.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
    
        //draw cooldown
        if (this.cooldown > 0) {
            ctx.fillStyle = "blue";
            ctx.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height * (this.cooldown / this.timeBetweenShots));
        }
        //draw hitbox
        ctx.fillStyle = this.hitboxColor;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.hitboxRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        //draw path
        drawPath(ctx, this.position, this.selectedPath, 1000, "black");
        drawAxis(ctx, this.position.x, this.position.y, 1000, 50, 50, "black");
    }

    handleMove(dt: number) {
        let change = {x: 0, y: 0};
        if (Input.instance.getState("up")) {
            change.y -= this.speed * dt;
        }
        if (Input.instance.getState("down")) {
            change.y += this.speed * dt;
        }
        if (Input.instance.getState("left")) {
            change.x -= this.speed * dt;
        }
        if (Input.instance.getState("right")) {
            change.x += this.speed * dt;
        }
        this.position = Vector.add(this.position, change);
        this.checkBounds();
    }

    checkBounds() {
        if (this.position.x - this.width / 2 < Game.instance.bounds.x) {
            this.position.x = Game.instance.bounds.x + this.width / 2;
        } else if (this.position.x + this.width / 2 > Game.instance.bounds.x + Game.instance.bounds.width) {
            this.position.x = Game.instance.bounds.x + Game.instance.bounds.width - this.width / 2;
        }
        if (this.position.y - this.height / 2 < Game.instance.bounds.y) {
            this.position.y = Game.instance.bounds.y + this.height / 2;
        }
        else if (this.position.y + this.height / 2 > Game.instance.bounds.y + Game.instance.bounds.height) {
            this.position.y = Game.instance.bounds.y + Game.instance.bounds.height - this.height / 2;
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
        this.currentPath = new BulletPath(this.position, this.selectedPath, "blue", 5);
        Game.instance.spawn(this.currentPath);
    }

    collides(point: { x: number; y: number; }) {
        return Math.sqrt((point.x - this.position.x) ** 2 + (point.y - this.position.y) ** 2) < this.hitboxRadius;
    }
}
