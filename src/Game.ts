import { Boss } from "./Boss";
import { LyricaSpellcard01, LyricaSpellcard02, YoumuSpellcard01 } from "./data";
import { BulletPath } from "./BulletPath";
import { DialogueSystem } from "./Dialogue";
import { Enemy } from "./Enemy";
import { Entity } from "./Entity";
import { Input } from "./Input";
import { PhysicsSystem } from "./Physics";
import { Player } from "./Player";
import { Point, Task } from "./Utils";


export class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    enemies : Enemy[] = [];
    entities: Entity[] = [];
    bounds: {x: number, y: number, width: number, height: number};
    state: "playing" | "paused" | "title" = "title";
    timesHit: number = 0;

    debug: boolean = true;
    mouse: Point = {x: 0, y: 0};
    tasks: {source: any, task: Task}[] = [];
    physicsSystem: PhysicsSystem;
    readonly timeBeforePause: number = 400;
    private lastTimestamp: DOMHighResTimeStamp = 0;
    static instance: Game;
    dialogueSystem: DialogueSystem = new DialogueSystem();
    constructor() {
        Game.instance = this;

        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.player = new Player();
        this.physicsSystem = new PhysicsSystem();
        // this.entities.push(this.player);
        this.bounds = {x: 0, y: 0, width: this.canvas.width, height: this.canvas.height};
        // this.spawn(new Boss());
        this.canvas.addEventListener("mousemove", (e) => {
            this.mouse = {x: e.offsetX, y: e.offsetY};
        });
    }

    changeToPlaying() {
        this.state = "playing";
        this.entities = [];
        this.spawn(this.player);
        this.spawn(this.dialogueSystem)
        const boss = new Boss();
        this.spawn(boss);
        boss.maxHealth = 5;
        boss.health = 5;
        this.player.state = "inactive";
        boss.state = "inactive";
        boss.events = [
            {speaker: "Cirno", text: "Hello!"},
            {speaker: "Cirno", text: "This is a test dialogue system."},
            YoumuSpellcard01,
            () => {this.player.state = "inactive";
                this.clearBulletPaths();

                    this.clearTasks(boss);
                },
            {speaker: "Cirno", text: "Try this trig function!"},
            LyricaSpellcard01,
            () => {this.player.state = "inactive";
                this.clearBulletPaths();
                this.clearTasks(boss);
            },
            // {speaker: "Cirno", text: "That's all for now!"},
            () => {this.player.state = "inactive";
                this.clearBulletPaths();
                this.clearTasks(boss);
            },
            {speaker: "debug", text: "debugging"},
            LyricaSpellcard02

        ];
        boss.processEvent();
        // this.dialogueSystem.active = true;
        // this.dialogueSystem.onFinish = () => {
        //     this.player.state = "moving";
        //     this.startTask(boss.activeSpellcard!.update(boss));
        // };
        // setInterval(() => {
        //     let enemy = new Enemy();
        //     // enemy.x = Math.random() * this.canvas.width;
        //     // enemy.y = Math.random() * this.canvas.height;
        //     enemy.position = {x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height};
        //     this.spawn(enemy);
        // }, 6000);
        //i think using a interval here is funny for debugging
    }
    changeToTitle() {
        this.state = "title";
        this.entities = [];
        this.physicsSystem.reset();
        this.tasks = [];
    }
    update(dt: number) {
        switch (this.state) {
            case "title":
                if(Input.instance.justPressed("fire")) {
                    this.changeToPlaying();
                }
                break;
            case "playing":
                if (dt > this.timeBeforePause) { //This might break if the game gets too laggy
                    this.state = "paused";
                    break;
                }
                for (let i = 0; i < this.entities.length; i++) {
                    this.entities[i].update(dt);
                }
                for (let i = 0; i < this.tasks.length; i++) {
                    if (this.tasks[i].task.next(dt).done) {
                        this.tasks.splice(i, 1);
                        i--;
                    }
                }
                this.physicsSystem.update(dt);
                break;
            case "paused":
                if(Input.instance.justPressed("fire")) {
                    this.state = "playing";
                }
                break;
        }
        Input.instance.update();

    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.state == "title") {
            ctx.fillStyle = "black";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Cirno's Advanced Math Class", this.canvas.width / 2, this.canvas.height / 2);
            ctx.fillText("WASD to move, space to shoot, shift to focus", this.canvas.width / 2, this.canvas.height / 2 + 30)
            ctx.fillText("Press space to start", this.canvas.width / 2, this.canvas.height / 2 + 60);
        }
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
        this.drawHitcount(ctx);
        this.drawPauseScreen(ctx);
        if (this.debug) {
            this.drawCoordinates(ctx);
        }
    }
    //hitcount is drawn at the top left
    drawHitcount(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.textAlign = "left";
        ctx.fillText("Times hit: " + this.timesHit, 10, 30);
    }

    //frame rate is drawn at the top right
    drawFramerate(ctx: CanvasRenderingContext2D, dt: number) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.textAlign = "left";
        ctx.fillText("FPS: " + Math.round(1000 / dt), this.canvas.width - 120, 30);
    }

    drawCoordinates(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.textAlign = "left";
        ctx.fillText("x: " + this.mouse.x + " y: " + this.mouse.y, this.mouse.x, this.mouse.y);
    }

    private drawPauseScreen(ctx: CanvasRenderingContext2D) {
        if (this.state == "paused") {
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Paused", this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    loop(timestamp: DOMHighResTimeStamp) {
        if (Game.instance.lastTimestamp == 0) {
            Game.instance.lastTimestamp = timestamp;
        }
        let dt = timestamp - Game.instance.lastTimestamp;
        Game.instance.lastTimestamp = timestamp;

        this.update(dt);
        this.draw(this.ctx);
        this.drawFramerate(this.ctx, dt);
        requestAnimationFrame(this.loop.bind(this));
    }

    spawn(entity: Entity) {
        this.entities.push(entity);
        if(entity instanceof Enemy || entity instanceof BulletPath || entity instanceof Boss) {
            this.physicsSystem.add(entity);
        }
        // if (entity instanceof Enemy) {
        //     this.enemies.push(entity);
        // }
    }

    remove(entity: Entity) {
        let index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
        if(entity instanceof Enemy || entity instanceof BulletPath || entity instanceof Boss) {
            this.physicsSystem.remove(entity);
        }
    }

    startTask(origin: any, task: Task) {
        this.tasks.push({source: origin, task: task});
    }

    clearTasks(origin: any) {
        this.tasks = this.tasks.filter(task => task.source != origin);
    }
    clearBulletPaths() {
        this.physicsSystem.enemyBullets = [];
        this.physicsSystem.friendlyBullets = [];
        this.entities = this.entities.filter(entity => !(entity instanceof BulletPath));
    }
}
