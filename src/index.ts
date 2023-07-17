import { BulletPath } from "./BulletPath";
import { Game } from "./Game";



export const presetPaths = {
    straight: (speed: number) => {
        return (t: number) => ({x: t * speed, y: 0});
    },
    sin: (speed: number, amplitude: number, period: number) => {
        return (t: number) => ({x: t * speed, y: Math.sin(t*speed*Math.PI/period)*amplitude});
    },
    cos: (speed: number, amplitude: number, period: number) => {
        return (t: number) => ({x: t * speed, y: Math.cos(t*speed*Math.PI/period)*amplitude});
    },
}

const body = document.querySelector("body");
let parametricButton = document.getElementById("parametric") as HTMLInputElement;
let functionBox = document.getElementById("function") as HTMLInputElement;
let xfunctionBox = document.getElementById("xFunction") as HTMLInputElement;
let yfunctionBox = document.getElementById("yFunction") as HTMLInputElement;
let confirmButton = document.getElementById("loadFunction") as HTMLButtonElement;
let standardDiv = document.getElementById("standard");
let parametricDiv = document.getElementById("param");

//obviously doesn't check every value, but it checks the common ones
function safteyCheck(func: Function) {
    try {
        func(1); //standard check
        func(0); //stops log
        func(0.5); //functions with natural domain
        func(-1); //stops sqrt
        return true;
    } catch (e) {
        return false;
    }
}
confirmButton!.addEventListener("click", () => {
    if (parametricButton.checked) {
        let xfunc = new Function("t", "return " + xfunctionBox.value);
        let yfunc = new Function("t", "return " + yfunctionBox.value);
        if (!safteyCheck(xfunc) || !safteyCheck(yfunc)) {
            alert("The functions must only be in terms of t and use valid JavaScript syntax");
            return;
        }
        game.player.selectedPath = t=>({x:xfunc(t/3), y:-yfunc(t/3)});
    } else {
        let func = new Function("x", "return " + functionBox.value);
        if (!safteyCheck(func)) {
            alert("The function must be in terms of x and use valid JavaScript syntax");
            return;
        }
        game.player.selectedPath = t=>({x:t/3, y: -func(t/3)});
    }
    console.log("loaded");
    console.log(game.player.selectedPath);
});
function blurOnDone(element : HTMLInputElement) {
    element.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            confirmButton.click();
            e.preventDefault();
            element.blur();
        }
    });
}
blurOnDone(functionBox);
blurOnDone(xfunctionBox);
blurOnDone(yfunctionBox);

parametricButton!.addEventListener("click", () => {
    if (parametricButton.checked) {
        standardDiv!.hidden = true;
        parametricDiv!.hidden = false;
    } else {
        standardDiv!.hidden = false;
        parametricDiv!.hidden = true;
    }
});

let game = new Game();

window.requestAnimationFrame(Game.instance.loop.bind(Game.instance));