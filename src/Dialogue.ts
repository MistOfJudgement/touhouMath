import { Entity } from "./Entity";
import { Input } from "./Input";
export type DialogueLine = {
    speaker: string,
    text: string,
}
export class DialogueSystem implements Entity {

    lines: DialogueLine[] = [
        {speaker: "Player", text: "Hello!"},
        {speaker: "Player", text: "This is a test dialogue system."},
    ];
    currentLine: number = 0;

    bounds: { x: number; y: number; width: number; height: number; };

    constructor(lines?: DialogueLine[]) {
        this.lines = lines ?? this.lines;
        this.bounds = {x: 200, y: 400, width: 500, height: 600};
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "white";
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(this.lines[this.currentLine].speaker, this.bounds.x + 10, this.bounds.y + 30);
        ctx.font = "20px Arial";
        ctx.fillText(this.lines[this.currentLine].text, this.bounds.x + 10, this.bounds.y + 60);
    }
    update(dt: number): void {
        if(Input.instance.justPressed("fire")) {
            this.currentLine++;
            if(this.currentLine >= this.lines.length) {
                this.currentLine = 0;
            }
        }
        // throw new Error("Method not implemented.");
    }

}