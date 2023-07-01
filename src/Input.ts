export class Input {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    fire: boolean;
    static instance: Input;

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

    keyDown(e: KeyboardEvent) {
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

    keyUp(e: KeyboardEvent) {
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
    static {
        new Input();
    }
}
