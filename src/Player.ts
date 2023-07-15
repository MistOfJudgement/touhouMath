import { BulletPath, drawPath } from "./BulletPath";
import { Input } from "./Input";
import { presetPaths } from ".";
import { Game } from "./Game";
import { Entity } from "./Entity";
import { Point, Vector } from "./Utils";
import { drawAxis } from "./Axis";
import { Timer } from "./Timer";
import Transform from "./Transform";

export class Player implements Entity {
    transform: Transform = {position:{x: 0, y: 0}};
    width: number = 50;
    height: number = 50;
    color: string = "red";
    normalSpeed: number = 0.25;
    focusSpeed: number = 0.125;
    timeBetweenShots: number = 1000;
    shotTimer: Timer;
    hitboxRadius: number = 10;
    hitboxColor: string = "green";
    state: "inactive" | "moving" | "firing" = "moving";
    focusing: boolean = false;
    selectedPath: (t: number) => { x: number; y: number; } = t=> ({x:t*Math.cos(t/250)/100, y:t*Math.sin(t/250)/100});//presetPaths.straight(0, 0, 0.5);
    currentPath: BulletPath | null = null;
    get speed() {
        return this.focusing ? this.focusSpeed : this.normalSpeed;
    }
    constructor() {
        this.shotTimer = new Timer(this.timeBetweenShots, () => {}, false, false);
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.fillStyle = this.color;
        ctx.fillRect(this.transform.position.x - this.width / 2, this.transform.position.y - this.height / 2, this.width, this.height);
    
        //draw cooldown
        if (this.shotTimer.active) {
            ctx.fillStyle = "blue";
            ctx.fillRect(this.transform.position.x - this.width / 2, this.transform.position.y - this.height / 2, this.width, this.height * this.shotTimer.percentComplete);
        }

        if (this.focusing) {
            //draw hitbox
            ctx.fillStyle = this.hitboxColor;
            ctx.beginPath();
            ctx.arc(this.transform.position.x, this.transform.position.y, this.hitboxRadius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        
            //draw path
            drawPath(ctx, this.transform.position, this.selectedPath, 10_000, "black");
            drawAxis(ctx, this.transform.position.x, this.transform.position.y, 1000, 50, 50, "black");
        }
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
        this.transform.position = Vector.add(this.transform.position, change);
        this.checkBounds();
    }

    checkBounds() {
        if (this.transform.position.x - this.width / 2 < Game.instance.bounds.x) {
            this.transform.position.x = Game.instance.bounds.x + this.width / 2;
        } else if (this.transform.position.x + this.width / 2 > Game.instance.bounds.x + Game.instance.bounds.width) {
            this.transform.position.x = Game.instance.bounds.x + Game.instance.bounds.width - this.width / 2;
        }
        if (this.transform.position.y - this.height / 2 < Game.instance.bounds.y) {
            this.transform.position.y = Game.instance.bounds.y + this.height / 2;
        }
        else if (this.transform.position.y + this.height / 2 > Game.instance.bounds.y + Game.instance.bounds.height) {
            this.transform.position.y = Game.instance.bounds.y + Game.instance.bounds.height - this.height / 2;
        }
        
    }
    update(dt: number) {
        this.focusing = Input.instance.getState("focus");

        switch (this.state) {
            case "inactive":
                // this.state = "moving";
                break;
            case "moving":
                this.handleMove(dt);
                if (Input.instance.justPressed("fire")) {
                    this.fire();
                }
                this.shotTimer.update(dt);
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
        if (this.shotTimer.active) {
            return;
        }
        this.state = "firing";
        this.shotTimer.start();
        this.currentPath = new BulletPath(this.transform.position, this.selectedPath, "blue", 5);
        this.currentPath.timeToLive = 10_000;
        Game.instance.spawn(this.currentPath);
    }

    collides(point: { x: number; y: number; }) {
        return Math.sqrt((point.x - this.transform.position.x) ** 2 + (point.y - this.transform.position.y) ** 2) < this.hitboxRadius;
    }
}
