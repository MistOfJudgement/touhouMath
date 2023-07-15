import { Entity } from "./Entity";
import { Input } from "./Input";
import { EventAction } from "./Utils";
export type DialogueLine = {
    speaker: string,
    text: string,
}
export class DialogueSystem implements Entity {

    active: boolean = false;
    lines: DialogueLine[] = [
        {speaker: "Player", text: "Hello!"},
        {speaker: "Player", text: "This is a test dialogue system."},
    ];
    currentLine: number = 0;

    bounds: { x: number; y: number; width: number; height: number; };
    loadLines(lines: DialogueLine[]) {
        this.lines = lines;
        this.currentLine = 0;
    }
    onFinish: EventAction = () => {};
    constructor(lines?: DialogueLine[]) {
        this.lines = lines ?? this.lines;
        this.bounds = {x: 200, y: 400, width: 500, height: 600};
    }
    draw(ctx: CanvasRenderingContext2D): void {
        if(!this.active) return;
        ctx.fillStyle = "#ffffff7f";
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(this.lines[this.currentLine].speaker, this.bounds.x + 10, this.bounds.y + 30);
        ctx.font = "20px Arial";
        ctx.fillText(this.lines[this.currentLine].text, this.bounds.x + 10, this.bounds.y + 60);
    }
    update(dt: number): void {
        if(!this.active) return;
        if(Input.instance.justPressed("fire")) {
            this.currentLine++;
            if(this.currentLine >= this.lines.length) {
                this.currentLine = 0;
                this.active = false;
                this.onFinish();
            }
        }
        // throw new Error("Method not implemented.");
    }



}