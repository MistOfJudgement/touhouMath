import { Spellcard, Boss } from "./Boss";

import { presetPaths } from ".";
import { BulletPath } from "./BulletPath";
import { Game } from "./Game";
import { Task, wait, moveTo, randomPoint, waitUntil } from "./Utils";


export const YoumuSpellcard01: Spellcard = {
    name: "Linear Slash [y=0]",
    complete: false,
    init: (boss: Boss) => {
        boss.state = "inactive";
        Game.instance.player.state = "moving"; //TODO: AAAAAAAA I NEED A BETTER SYSTEM
    },

    *update(boss: Boss): Task {
        let t = 0;
        while (true) {
            yield* wait(1000);
            let attack = new BulletPath(boss.transform.position, presetPaths.straight(-1 / 4), "red", 5, 10, 150);
            Game.instance.spawn(attack);
            yield* wait(1000);
            // boss.transform.position = {x: Math.random() * 800, y: Math.random() * 600};
            Game.instance.startTask(this, moveTo(boss.transform, { x: Math.random() * 800, y: Math.random() * 600 }, 500));
        }
    }
};

export const LyricaSpellcard01: Spellcard = {
    name: "Sine Sign [y=sin(x)]",
    complete: false,
    init: (boss: Boss) => {
        boss.state = "inactive";
        Game.instance.player.state = "moving";
    },
    *update(boss: Boss): Task {
        while(true) {
            let period = 100;
            yield* wait(1000);
            const bossLine = 500;
            //random spot
            Game.instance.startTask(this, moveTo(boss.transform, randomPoint({x: bossLine, y: 0, width: Game.instance.bounds.width-bossLine, height: Game.instance.bounds.height}), 1000));
            yield* wait(1000);
            let attack = new BulletPath(boss.transform.position, presetPaths.sin(-1 / 8, 50, 50), "red", 5, 10, 150);
            Game.instance.spawn(attack);
            yield* waitUntil(() => attack.count === 0);
            yield* wait(250);

            period /= 2;
            //Aimed attack
            let playerPos = Game.instance.player.transform.position;
            let min = Math.floor(playerPos.x/period)+2;
            let max = Math.floor(800/period) - 1;
            if(min > max) {
                continue;
            }
            let pos = {x: (Math.floor(Math.random() * (max - min)) + min)*period + playerPos.x, y: playerPos.y};
            while(pos.x > Game.instance.bounds.width) {
                pos.x -= period;
            }
            while(pos.x < bossLine) {
                pos.x += period;
            }
            Game.instance.startTask(this, moveTo(boss.transform, pos, 1000));
            yield* wait(1000);
            attack = new BulletPath(boss.transform.position, presetPaths.sin(-1 / 8, 50, 50), "red", 5, 10, 150);
            Game.instance.spawn(attack);
            yield* waitUntil(() => attack.count === 0);
            yield* wait(250);
        }
    }
}