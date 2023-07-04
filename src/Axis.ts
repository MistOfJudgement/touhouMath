
export function drawAxis(ctx: CanvasRenderingContext2D, x: number, y: number, length: number, xScale: number = 50, yScale: number = 50, color: string = "black") {
    //draw x axis
    ctx.beginPath();
    ctx.moveTo(x - length, y);
    ctx.lineTo(x + length, y);
    ctx.strokeStyle = color;
    ctx.stroke();
    //draw y axis
    ctx.beginPath();
    ctx.moveTo(x, y + length);
    ctx.lineTo(x, y - length);
    ctx.strokeStyle = color;
    ctx.stroke();
    //draw x axis scale from -length to length
    for (let i = -length/xScale; i < length / xScale; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * xScale, y - 5);
        ctx.lineTo(x + i * xScale, y + 5);
        ctx.strokeStyle = color;
        ctx.stroke();
        //number
        ctx.font = "10px Arial";
        ctx.fillText((i*xScale).toString(), x + i * xScale - 5, y + 15);
        
    }
    //draw y axis scale
    for (let i = -length/yScale; i < length / yScale; i++) {
        ctx.beginPath();
        ctx.moveTo(x - 5, y - i * yScale);
        ctx.lineTo(x + 5, y - i * yScale);
        ctx.strokeStyle = color;
        ctx.stroke();
        //number
        ctx.font = "10px Arial";
        ctx.fillText((i*yScale).toString(), x - 15, y - i * yScale + 5);
    }
}