"use strict";
class Input {
    constructor() {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.fire = false;
        Input.instance = this;
        document.onkeydown = (e) => this.keyDown(e);
        document.onkeyup = (e) => this.keyUp(e);
    }
    keyDown(e) {
        switch (e.key) {
            case "w":
                this.up = true;
                break;
            case "s":
                this.down = true;
                break;
            case "a":
                this.left = true;
                break;
            case "d":
                this.right = true;
                break;
            case " ":
                this.fire = true;
                break;
        }
    }
    keyUp(e) {
        switch (e.key) {
            case "w":
                this.up = false;
                break;
            case "s":
                this.down = false;
                break;
            case "a":
                this.left = false;
                break;
            case "d":
                this.right = false;
                break;
            case " ":
                this.fire = false;
                break;
        }
    }
}
new Input();
class BulletPath {
    constructor(x, y, pathfunc, color, radius) {
        this.activebullets = []; //bullet times
        this.x = x;
        this.y = y;
        this.pathFunction = pathfunc;
        this.color = color;
        this.radius = radius;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.activebullets.length; i++) {
            let bullet = this.pathFunction(this.activebullets[i]);
            ctx.beginPath();
            ctx.arc(this.x + bullet.x, this.y + bullet.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    update() {
        for (let i = 0; i < this.activebullets.length; i++) {
            this.activebullets[i]++;
            if (this.activebullets[i] > 100) {
                this.activebullets.splice(i, 1);
                i--;
            }
        }
    }
    fire() {
        this.activebullets.push(0);
    }
}
const presetPaths = {
    straight: (x, y, speed) => {
        return (t) => ({ x: t * speed, y: 0 });
    },
    sin: (x, y, speed) => {
        return (t) => ({ x: t * speed, y: Math.sin(t * speed * Math.PI / 180) * 50 });
    },
    cos: (x, y, speed) => {
        return (t) => ({ x: t * speed, y: Math.cos(t * speed * Math.PI / 180) * 50 });
    },
};
class Player {
    constructor() {
        this.cooldown = 0;
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.color = "red";
        this.speed = 5;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
        if (Input.instance.up) {
            this.y -= this.speed;
        }
        if (Input.instance.down) {
            this.y += this.speed;
        }
        if (Input.instance.left) {
            this.x -= this.speed;
        }
        if (Input.instance.right) {
            this.x += this.speed;
        }
        if (Input.instance.fire) {
            this.fire();
        }
        this.cooldown--;
    }
    fire() {
        if (this.cooldown > 0) {
            return;
        }
        this.cooldown = 10;
        //shoot straight forward
        let bullet = new BulletPath(this.x, this.y, presetPaths.sin(this.x, this.y, 4), "black", 5);
        Game.instance.spawn(bullet);
        bullet.fire();
    }
}
class Game {
    constructor() {
        this.entities = [];
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
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
    spawn(entity) {
        this.entities.push(entity);
    }
}
let game = new Game();
game.loop();
