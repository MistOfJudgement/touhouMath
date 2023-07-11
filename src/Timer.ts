import { EventAction } from "./Utils";

export class Timer {
    totalTime: number;
    currentTime: number;
    active: boolean = true;
    loop: boolean = false;
    onComplete: EventAction
    constructor(totalTime: number, action: EventAction, loop: boolean = false, active: boolean = true) {
        this.totalTime = totalTime;
        this.currentTime = totalTime;
        // this.onComplete = onComplete;
        this.loop = loop;
        this.onComplete = action;
        this.active = active;
    }

    update(dt: number) {
        if (!this.active) return;
        this.currentTime -= dt;
        if (this.currentTime <= 0) {
            this.onComplete();
            if (this.loop) {
                this.reset();
            } else {
                this.active = false;
            }
        }
    }
    reset() {
        this.currentTime = this.totalTime;
        this.active = true;
    }

    get percentComplete() {
        return this.currentTime / this.totalTime;
    }
}