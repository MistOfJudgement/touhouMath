import { presetPaths } from ".";
import { BulletPath } from "./BulletPath";
import { DialogueLine, DialogueSystem } from "./Dialogue";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { DrawnRectSprite, Sprite } from "./Sprite";
import { Timer } from "./Timer";
import Transform from "./Transform";
import { PathFunc, Point, Task, Vector, lerpPoint } from "./Utils";
export type Spellcard = {
    name: string,
    complete: boolean,
    init: (boss: Boss) => void,
    update: (boss: Boss) => Task
}
    

export class Boss implements Entity {
    width: number = 50;
    height: number = 50;
    transform: Transform = new Transform({x: 80, y: 80});
    sprite: Sprite = new DrawnRectSprite(this.transform, this.width, this.height, "green");
    state: "inactive" | "moving" | "attacking" = "inactive";
    destination: Point = {x: 0, y: 0};
    prevLocation: Point = {x: 0, y: 0};
    attack: BulletPath | null = null;
    moveTime: number = 2000;
    waitAfterAttack: number = 1000;
    attackPath: PathFunc = presetPaths.sin(0, 0, -1/4);
    waitTimer: Timer;
    health: number = 100;
    maxHealth: number = 100;
    dialogueSystem: DialogueSystem = Game.instance.dialogueSystem;
    events: (Spellcard|DialogueLine|Function)[] = [];
    currentEvent: number = 0;
    get alive() {
        return this.health > 0;
    }
    getCurrentEvent() {
        return this.events[this.currentEvent];
    }
    nextEvent() {
        this.currentEvent++;
        if(this.currentEvent >= this.events.length) {
            this.currentEvent = 0;
            Game.instance.changeToTitle();
        } else {
            this.processEvent();
        }
    }
    processEvent() {
        let event = this.getCurrentEvent();
        if ("speaker" in event) {
            event = event as DialogueLine;
            this.dialogueSystem.loadSingleLine(event);
            this.dialogueSystem.active = true;
            this.dialogueSystem.onFinish = () => {
                this.nextEvent();
            }
        } else if(event instanceof Function) {
            event();
            this.nextEvent();
        } else {
            event = event as Spellcard;
            this.dialogueSystem.active = false;
            event.init(this);
            Game.instance.startTask(this, event.update(this));
        }
    }
    constructor() {
        this.waitTimer = new Timer(1000, () => {}, true);
        // this.startMove();
        this.waitTimer.active = false;
        // Game.instance.tasks.push(this!.activeSpellcard!.update(this));
        
    }
    draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.destination.x, this.destination.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        //healthbar is on the right side of the screen
        const height = ctx.canvas.height;
        const width = 5;
        ctx.fillStyle = "red";
        ctx.fillRect(ctx.canvas.width - width, 0, width, height * (this.health / this.maxHealth));
        
        //spellcard name is on the right under the fps counter
        let event = this.getCurrentEvent() as any;
        if(event.name) {
            event = event as Spellcard;
            
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText(event.name, ctx.canvas.width - ctx.measureText(event.name).width - 10, 50);
        }
    }
    startAttack() {
        // if(Game.instance.debug) {
        //     this.state = "inactive";
        //     Game.instance.tasks.push(this.activeSpellcard!.update(this));
        //     return;
        // }
        // this.state = "attacking";
        // this.prevLocation = this.transform.position;
        // this.attack = new BulletPath(this.transform.position, this.attackPath, "red", 5, 10, 150);
        // Game.instance.spawn(this.attack);
        // this.waitTimer.onComplete = this.startMove.bind(this);
        // this.waitTimer.totalTime = this.waitAfterAttack;
        // this.waitTimer.active = false;
        // console.log("start attack");
        // console.log(this.waitTimer);
    }

    startMove() {
        this.state = "moving";
        this.attack = null;
        this.destination = {x: Math.random() * 800, y: Math.random() * 600};
        this.waitTimer.onComplete = this.startAttack.bind(this);
        this.waitTimer.totalTime = this.moveTime;
        this.waitTimer.start();
        console.log("start move");
        console.log(this.waitTimer);
    }

    update(dt: number): void {
        if (this.state == "inactive") return;
        if (this.state == "moving") {
            this.transform.position = lerpPoint(this.prevLocation, this.destination, 1-this.waitTimer.percentComplete);

        } else if (this.state == "attacking") {
            if(!this.attack) {
            this.attack = new BulletPath(this.transform.position, this.attackPath, "red", 5, 10, 150);
            this.attack = new BulletPath(this.transform.position, this.attackPath, "red", 5, 10, 150);
                Game.instance.spawn(this.attack);
                this.attack = new BulletPath(this.transform.position, this.attackPath, "red", 5, 10, 150);
                Game.instance.spawn(this.attack);
            }
            if(this.attack.count == 0) {
                this.waitTimer.start();
            }

        }
        this.waitTimer.update(dt);

    }

    collides(point: Point) {
        return point.x > this.transform.position.x - this.width / 2 &&
            point.x < this.transform.position.x + this.width / 2 &&
            point.y > this.transform.position.y - this.height / 2 &&
            point.y < this.transform.position.y + this.height / 2;
            
    }
}


