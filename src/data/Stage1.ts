import { Game } from "../Game";
import { IScript, Task, rand, wait } from "../Utils";
//recreating stage 1 midboss nospell attack from Servants of Harvest Wish
export class Minoriko implements IScript {
    game: Game;
    objEnemy: any;
    constructor(game: Game) {
        this.game = game;
    }
    initialize(): void {
        // objEnemy = initializeBoss(BOSS_MINORIKO);
        // ObjEnemy_SetDamageRate(objEnemy, 1, 1);
        // clearScreen(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),10);
        // Work;
        // End;
    };
    *mainLoop(): Task {
        // Enemy_SetIntersectionCircleToShot(objEnemy, ObjMove_GetX(objEnemy), ObjMove_GetY(objEnemy), 32);
        // ObjEnemy_SetIntersectionCircleToPlayer(objEnemy, ObjMove_GetX(objEnemy), ObjMove_GetY(objEnemy), 24);
        yield;
    };

    *work(): Task {
        // ObjMove_SetPosition(objEnemy,-100,0);
        // Move(objEnemy, 192, 140, 120);
        yield *wait(2_000);


        // NzChargeAll(objEnemy,BOSS_MINORIKO);
        yield *wait(1250); //75 frames / 60 fps = 1.25 seconds
        // ObjEnemy_SetDamageRate(objEnemy, 100, 100);
        while(/**ObjEnemy_GetInfo(objEnemy, INFO_LIFE) > 0*/true){
            let rnd = rand(0,360);
        //     PlaySFX(SE_SHOT_LOW,75);
        //     ascent(i in 0..18){
        for(let i = 0; i < 18; i++) {
        //         HandleBullet(createShot(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),2,rnd+i*20,10,RICE_M,ORANGE,20,BLEND_ALPHA));
        }
        wait(2_000);
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
        //         wait(15-3*difficulty);
            }
        //     Move(objEnemy, GetPlayerX+rand(-20,20), rand(110,170), 60);
            wait(1_000);
        }
    }

    finalize(): void {
        throw new Error("Function not implemented.");
    };
};