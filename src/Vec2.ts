class Vec2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x; this.y = y;
    }

    add(p: Vec2): Vec2 {
        return new Vec2(this.x + p.x, this.y + p.y);
    }

    multiply(s: number): Vec2 {
        return new Vec2(this.x * s, this.y * s);
    }

    distance(p: Vec2): number {
        return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
    }

    normalize(): Vec2 {
        return this.multiply(1 / this.distance(new Vec2(0, 0)));
    }

    copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }


}
