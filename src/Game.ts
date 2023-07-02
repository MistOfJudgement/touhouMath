import { Entity } from "./Entity";
import { Player } from "./Player";


export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    entities: Entity[] = [];
    bounds: {width: number, height: number};
    private lastTimestamp: DOMHighResTimeStamp = 0;
    static instance: Game;
    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.player = new Player();
        this.entities.push(this.player);
        this.bounds = {width: this.canvas.width, height: this.canvas.height};
        Game.instance = this;
    }

    update(dt: number) {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(dt);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
    }

    loop(timestamp: DOMHighResTimeStamp) {
        if (Game.instance.lastTimestamp == 0) {
            Game.instance.lastTimestamp = timestamp;
        }
        let dt = timestamp - Game.instance.lastTimestamp;
        Game.instance.lastTimestamp = timestamp;

        this.update(dt);
        this.draw();
        requestAnimationFrame(this.loop.bind(this));
    }

    spawn(entity: Entity) {
        this.entities.push(entity);
    }

    remove(entity: Entity) {
        let index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }
}
