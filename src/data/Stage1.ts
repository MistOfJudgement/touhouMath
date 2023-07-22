import { Game } from "../Game";
import { EnemyObject, MoveObject } from "../Objects";
import { Sprite } from "../Sprite";
import { IScript, Point, Task, Vector, rand, wait } from "../Utils";


function move(obj: MoveObject, destination: Point, time: number) : void {
    //referencing Move function from common_shot.dnh
    const start = obj.position;
    const dist = Vector.distance(start, destination);
    const angle = Math.atan2(destination.y - start.y, destination.x - start.x);
    const speed = 2 * dist / time;
    obj.speed = speed;
    obj.angle = angle;
    obj.acceleration = -speed / time;
}
//recreating stage 1 midboss nospell attack from Servants of Harvest Wish
export class Minoriko implements IScript {
    game: Game;
    objEnemy: EnemyObject | null = null;
    constructor(game: Game) {
        console.log(this);
        this.game = game;
    }
    initialize(): void {
        // objEnemy = initializeBoss(BOSS_MINORIKO);
        this.objEnemy = new EnemyObject(this.game);
        // ObjEnemy_SetDamageRate(objEnemy, 1, 1);
        // clearScreen(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),10);
        this.game.startTask(this, this.work());
        this.game.startTask(this, this.end());
    };
    *mainLoop(): Task {
        // Enemy_SetIntersectionCircleToShot(objEnemy, ObjMove_GetX(objEnemy), ObjMove_GetY(objEnemy), 32);
        // ObjEnemy_SetIntersectionCircleToPlayer(objEnemy, ObjMove_GetX(objEnemy), ObjMove_GetY(objEnemy), 24);
        yield;
    };

    *work(): Task {
        let failTimer = 3_000;//if the boss isn't initialized in 3 seconds, fail
        while(this.objEnemy === null) {
            failTimer -= yield;
            if(failTimer <= 0) {
                throw new Error("Spell was not initialized in time");
            }
        }
        this.objEnemy.setPosition({x: -100, y: 0});
        move(this.objEnemy.moveObject, {x: 192, y: 140}, 2_000);

        yield *wait(2_000);

        // NzChargeAll(objEnemy,BOSS_MINORIKO);
        console.log("charging")
        yield *wait(1250); //75 frames / 60 fps = 1.25 seconds
        // ObjEnemy_SetDamageRate(objEnemy, 100, 100);
        while(/**ObjEnemy_GetInfo(objEnemy, INFO_LIFE) > 0*/true){
            let rnd = rand(0,360);
        //     PlaySFX(SE_SHOT_LOW,75);
        //     ascent(i in 0..18){
        for(let i = 0; i < 18; i++) {
        //         HandleBullet(createShot(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),2,rnd+i*20,10,RICE_M,ORANGE,20,BLEND_ALPHA));
        }
        yield *wait(2_000);
        //     let ang = GetAngleToPlayer(objEnemy);
        let difficulty = 2;
        //     ascent(i in 0..3+difficulty){
        for(let i = 0; i < 3 + difficulty; i++) {
        //         ascent(j in 0..8){
            for(let j = 0; j < 8; j++) {
        //             if(ObjEnemy_GetInfo(objEnemy, INFO_LIFE) > 0){
        //                 PlaySFX(SE_SHOT_LOW,75);
        //                 createShot(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),2+difficulty*0.3,ang+j*45,10,BALL_M,ORANGE,20,BLEND_ALPHA);
        //                 createShot(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),2-difficulty*0.1,22.5+ang+j*45,10,BALL_M,ORANGE,20,BLEND_ALPHA);
                        if(difficulty >= 3){
        //                     createShot(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),2.5,11.25+ang+j*45,10,BALL_M,RED,20,BLEND_ALPHA);
        //                     createShot(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),2.5,33.75+ang+j*45,10,BALL_M,RED,20,BLEND_ALPHA);
                        }
        //             }
                }
                yield *wait(15-3*difficulty);
            }
            const moveTo = {x:this.game.player.transform.position.x+rand(-20,20), y:rand(110,170)};
            console.log("moving to (" + moveTo.x + ", " + moveTo.y + ")");
            move(this.objEnemy.moveObject, moveTo, 1_000);
            yield *wait(1_000);
        }
        
    }
    *end(): Task {
        // while(ObjEnemy_GetInfo(objEnemy, INFO_LIFE) > 0)
        // {
        //     yield;
        // }
        // clearScreen(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),10);
        // if(GetGameMode() == MODE_SPELL){
        //     wait(80);
        // }
        // yield;
        // Obj_Delete(objEnemy);

        // yield *wait(1_000);

        // CloseScript(GetOwnScriptID());
    }
    finalize(): void {
        throw new Error("Function not implemented.");
    };
};