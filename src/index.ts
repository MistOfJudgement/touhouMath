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
        
let game = new Game();

window.requestAnimationFrame(Game.instance.loop.bind(Game.instance));