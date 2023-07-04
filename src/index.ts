import { BulletPath } from "./BulletPath";
import { Game } from "./Game";



export const presetPaths = {
    straight: (x: number, y: number, speed: number) => {
        return (t: number) => ({x: t * speed, y: 0});
    },
    sin: (x: number, y: number, speed: number) => {
        return (t: number) => ({x: t * speed, y: Math.sin(t*speed*Math.PI/180)*50});
    },
    cos: (x: number, y: number, speed: number) => {
        return (t: number) => ({x: t * speed, y: Math.cos(t*speed*Math.PI/180)*50});
    },
}

const body = document.querySelector("body");
let functionBox = document.createElement("input");
let confirmButton = document.createElement("button");
confirmButton.textContent = "Load";
body!.appendChild(functionBox);
body!.appendChild(confirmButton);
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
    let func = new Function("x", "return " + functionBox.value);
    if (!safteyCheck(func)) {
        alert("The function must be of the form f(x) = y, and defined on the Reals");
        return;
    }
    game.player.selectedPath = t=>({x:t*0.5, y: func(t*0.5)});

    console.log("loaded");
    console.log(game.player.selectedPath);
});
functionBox!.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
        confirmButton.click();
        e.preventDefault();
        functionBox.blur();
    }
});
let game = new Game();

window.requestAnimationFrame(Game.instance.loop.bind(Game.instance));