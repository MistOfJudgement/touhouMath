
export interface Entity {
    draw(ctx: CanvasRenderingContext2D): void;
    update(dt: number): void;
}
