import { BulletPath } from "./BulletPath";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { DrawnRectSprite, Sprite } from "./Sprite";
import Transform from "./Transform";
import { Point, Vector } from "./Utils";

export class Boss implements Entity {
    transform: Transform = new Transform({x: 80, y: 80});
    sprite: Sprite = new DrawnRectSprite(this.transform, 50, 50, "green");
    state: "moving" | "attacking" = "moving";
    destination: Point = {x: 0, y: 0};
    attack: BulletPath | null = null;
    attackPath = (t: number) => ({x: -t/10, y: 0});
    draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.destination.x, this.destination.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    update(dt: number): void {
        if (this.state == "moving") {
            let distance = Vector.magnitude(Vector.subtract(this.destination, this.transform.position));
            if (distance < 1) {
                this.state = "attacking";
            }
            else {
                let direction = Vector.subtract(this.destination, this.transform.position);
                let velocity = Vector.scale(direction, 3 / distance);
                this.transform.position = Vector.add(this.transform.position, velocity);
            }
        } else if (this.state == "attacking") {
            if(!this.attack) {
                this.attack = new BulletPath(this.transform.position, this.attackPath, "red", 5, 1, 50);
                Game.instance.spawn(this.attack);
            }
            this.attack.update(dt);
            if(this.attack.count == 0) {
                this.attack = null;
                this.state = "moving";
                this.destination = {x: Math.random() * 800, y: Math.random() * 600};
            }

        }

    }
}