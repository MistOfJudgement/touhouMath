import { Entity } from "./Entity";
import { Player } from "./Player";



export const presetPaths = {
    straight: (x: number, y: number, speed: number) => {
        return (t: number) => ({x: t * speed, y: 0});
    },
    sin: (x: number, y: number, speed: number) => {
        return (t: number) => ({x: t * speed, y: Math.sin(t*speed*Math.PI/180)*50});
    },
    cos: (x: number, y: number, speed: number) => {
        return (t: number) => ({x: t * speed, y: Math.cos(t*speed*Math.PI/180)*50});
    },
}
        
export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    entities: Entity[] = [];
    static instance: Game;
    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.player = new Player();
        this.entities.push(this.player);
        Game.instance = this;
    }

    update() {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    spawn(entity: Entity) {
        this.entities.push(entity);
    }
}

let game = new Game();


game.loop();