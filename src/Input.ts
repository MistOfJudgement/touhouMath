export const Actions = ["up", "down", "left", "right", "fire", "focus"] as const;
export type Action = typeof Actions[number];
export class Input {
    mapping: {[key: string]: Action} = {
        "KeyW": "up",
        "ArrowUp": "up",
        "KeyS": "down",
        "ArrowDown": "down",
        "KeyA": "left",
        "ArrowLeft": "left",
        "KeyD": "right",
        "ArrowRight": "right",
        "Space": "fire",
        "KeyZ": "fire",
        "ShiftLeft": "focus",
    }
    currentState: {[key: string]: boolean};
    previousState: {[key: string]: boolean};
    static instance: Input;

    constructor() {
        Input.instance = this;
        this.currentState = {};
        this.previousState = {};
        for (let action of Actions) {
            this.currentState[action] = false;
            this.previousState[action] = false;
        }
        document.onkeydown = (e) => this.keyDown(e);
        document.onkeyup = (e) => this.keyUp(e);
    }

    keyDown(e: KeyboardEvent) {
        let action = this.mapping[e.code];
        if (action) {
            this.currentState[action] = true;
        }
    }

    keyUp(e: KeyboardEvent) {
        let action = this.mapping[e.code];
        if (action) {
            this.currentState[action] = false;
        }
    }
    getState(action: Action) {
        return this.currentState[action];
    }
    justPressed(action: Action) {
        return this.currentState[action] && !this.previousState[action];
    }
    update() {
        this.previousState = {...this.currentState};
    }

    static {
        new Input();
    }
}
