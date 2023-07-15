import { presetPaths } from ".";
import { BulletPath } from "./BulletPath";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { DrawnRectSprite, Sprite } from "./Sprite";
import { Timer } from "./Timer";
import Transform from "./Transform";
import { PathFunc, Point, Task, Vector, lerpPoint, wait, moveTo } from "./Utils";
type Spellcard = {
    name: string,
    complete: boolean,
    init: (boss: Boss) => void,
    update: (boss: Boss) => Task
}
    

export class Boss implements Entity {
    transform: Transform = new Transform({x: 80, y: 80});
    sprite: Sprite = new DrawnRectSprite(this.transform, 50, 50, "green");
    state: "inactive" | "moving" | "attacking" = "inactive";
    destination: Point = {x: 0, y: 0};
    prevLocation: Point = {x: 0, y: 0};
    attack: BulletPath | null = null;
    moveTime: number = 2000;
    waitAfterAttack: number = 1000;
    attackPath: PathFunc = presetPaths.sin(0, 0, -1/4);
    waitTimer: Timer;
    health: number = 100;
    spellcards: Spellcard[] = [YoumuSpellcard01];
    activeSpellcard: Spellcard | null = this.spellcards[0];
    get alive() {
        return this.health > 0;
    }
    constructor() {
        this.waitTimer = new Timer(1000, () => {}, true);
        // this.startMove();
        this.waitTimer.active = false;
        
    }
    draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.destination.x, this.destination.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    startAttack() {
        if(Game.instance.debug) {
            this.state = "inactive";
            Game.instance.tasks.push(this.activeSpellcard!.update(this));
            return;
        }
        this.state = "attacking";
        this.prevLocation = this.transform.position;
        this.attack = new BulletPath(this.transform.position, this.attackPath, "red", 5, 10, 150);
        Game.instance.spawn(this.attack);
        this.waitTimer.onComplete = this.startMove.bind(this);
        this.waitTimer.totalTime = this.waitAfterAttack;
        this.waitTimer.active = false;
        console.log("start attack");
        console.log(this.waitTimer);
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
}


export const YoumuSpellcard01: Spellcard = {
    name: "Linear Slash [y=0]",
    complete: false,
    init: (boss: Boss) => {
        boss.state = "inactive";
    },

    *update(boss: Boss) : Task {
        let t = 0;
        while(true) {
            yield *wait(1000);
            let attack = new BulletPath(boss.transform.position, presetPaths.straight(0, 0, -1/4), "red", 5, 10, 150);
            Game.instance.spawn(attack);
            yield *wait(1000);
            // boss.transform.position = {x: Math.random() * 800, y: Math.random() * 600};
            Game.instance.tasks.push(moveTo(boss.transform, {x: Math.random() * 800, y: Math.random() * 600}, 500));
        }
    }

}
