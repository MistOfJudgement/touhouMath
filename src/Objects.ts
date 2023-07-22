import { Entity } from "./Entity";
import { Game } from "./Game";
import { Point, Task, deg2rad, wait } from "./Utils";

export class MoveObject{
    position: Point = {x: 0, y: 0};
    private _velocity: Point = {x: 0, y: 0};
    private _speed: number = 0;
    private _angle: number = 0;
    acceleration: number = 0;
    angularVelocity: number = 0;
    get speed() {
        return this._speed;
    }
    set speed(speed: number) {
        const angle = this.angle;
        this._speed = speed;
        if (speed < 0) {
            this._speed = 0;
        }
        this._velocity.x = speed * Math.cos(angle);
        this._velocity.y = speed * Math.sin(angle);
    }
    get angle() {
        return this._angle;
    }
    set angle(angle: number) {
        const speed = this.speed;
        this._angle = angle;
        this._velocity.x = speed * Math.cos(angle);
        this._velocity.y = speed * Math.sin(angle);
    }

    get velocity() {
        return this._velocity;
    }

    set velocity(velocity: Point) {
        this._velocity = velocity;
        this._speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        this._angle = Math.atan2(velocity.y, velocity.x);
    }

    update(dt: number): void {
        const timeScale = 1;
        this.position.x += this.velocity.x * dt * timeScale;
        this.position.y += this.velocity.y * dt * timeScale;
        this.speed += this.acceleration * dt * timeScale;
    
        this.angle += this.angularVelocity * dt* timeScale;
    }
}

export class EnemyObject implements Entity {
    game: Game;
    moveObject: MoveObject;
    constructor(game: Game) {
        this.moveObject = new MoveObject();
        this.game = game;
        this.game.spawn(this);
    }
    draw(ctx: CanvasRenderingContext2D): void {
        //just drwa a square for now
        ctx.fillStyle = "red";
        ctx.fillRect(this.moveObject.position.x - 25, this.moveObject.position.y - 25, 50, 50);
    }
    update(dt: number): void {
        this.moveObject.update(dt);
    }

    setPosition(position: Point) {
        this.moveObject.position = position;
    }
}

export class ShotObject implements Entity {
    game: Game;
    moveObject: MoveObject;
    color: string = "green";
    constructor(game: Game) {
        this.moveObject = new MoveObject();
        this.game = game;
        this.game.spawn(this);
    }
    draw(ctx: CanvasRenderingContext2D): void {
        //green circle (2px)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.moveObject.position.x, this.moveObject.position.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        // //line to show direction
        // ctx.beginPath();
        // ctx.moveTo(this.moveObject.position.x, this.moveObject.position.y);
        // ctx.lineTo(this.moveObject.position.x + Math.cos(this.moveObject.angle) * 10, this.moveObject.position.y + Math.sin(this.moveObject.angle) * 10);
        // ctx.stroke();
    }
    update(dt: number): void {
        this.moveObject.update(dt);
    }
    
    static createShot(game: Game, pos: Point, speed: number, angle: number, distance: number, color: string, delay: number = 0) {
        const shot = new ShotObject(game);
        pos = {x: pos.x + Math.cos(angle) * distance, y: pos.y + Math.sin(angle) * distance};
        shot.moveObject.position = pos;
        shot.moveObject.angle = angle;
        shot.color = color;
        if(delay > 0) {
            Game.instance.startTask(shot, (function *():Task {
                yield *wait(delay);
                shot.moveObject.speed = speed;
            })());
        } else {
            shot.moveObject.speed = speed;
        }
        return shot;
    }
}