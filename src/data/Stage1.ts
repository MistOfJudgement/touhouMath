import { Game } from "../Game";
import { EnemyObject, MoveObject, ShotObject } from "../Objects";
import { Sprite } from "../Sprite";
import { IScript, Point, Task, Vector, deg2rad, rad2deg, rand, wait, waitUntil } from "../Utils";


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
    private scale: number = 1/20;
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
            this.game.startTask(this, this.HandleBullet(
                ShotObject.createShot(this.game, this.objEnemy.moveObject.position, 2/10, deg2rad(rnd + i * 20), 10, "green", 1/3)));
        }
        yield *wait(2_000);
        // let ang = GetAngleToPlayer(objEnemy);
        const ang = Vector.angle(this.objEnemy.moveObject.position, this.game.player.transform.position);
        let difficulty = 2;
        //     ascent(i in 0..3+difficulty){
        for(let i = 0; i < 3 + difficulty; i++) {
        //         ascent(j in 0..8){
            for(let j = 0; j < 8; j++) {
        //             if(ObjEnemy_GetInfo(objEnemy, INFO_LIFE) > 0){
        //                 PlaySFX(SE_SHOT_LOW,75);
            ShotObject.createShot(this.game,
                                 this.objEnemy.moveObject.position,
                                  (2 + difficulty * 0.3) * (this.scale),
                                   deg2rad(ang + j * 45), 
                                   10, 
                                   "green",
                                    1/3);
        //                 createShot(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),2-difficulty*0.1,22.5+ang+j*45,10,BALL_M,ORANGE,20,BLEND_ALPHA);
        ShotObject.createShot(this.game, this.objEnemy.moveObject.position, (2 - difficulty * 0.1) * (this.scale), deg2rad(22.5 + ang + j * 45), 10, "green", 1/3);
                        if(difficulty >= 3){
        //                     createShot(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),2.5,11.25+ang+j*45,10,BALL_M,RED,20,BLEND_ALPHA);
        //                     createShot(ObjMove_GetX(objEnemy),ObjMove_GetY(objEnemy),2.5,33.75+ang+j*45,10,BALL_M,RED,20,BLEND_ALPHA);
                        }
        //             }
                }
                yield *wait((15-3*difficulty)*1000/60);
            }
            const moveTo = {x:this.game.player.transform.position.x+rand(-20,20), y:rand(110,170)};
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

    *HandleBullet(shot: ShotObject): Task {
        yield *wait(333);
        // ObjMove_SetAcceleration(shot,-0.04);
        shot.moveObject.acceleration = -0.004 / 10;
        // ObjMove_SetMaxSpeed(shot, 0);
        // while(ObjMove_GetSpeed(shot) > 0){yield;}
        yield *waitUntil(() => shot.moveObject.speed <= 0);
        yield *wait(333);
        // if(!Obj_IsDeleted(shot)){
            // PlaySFX(SE_SPARKLE,75);
            // HandleBullet2(createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),2,ObjMove_GetAngle(shot)-45,0,RICE_M,RED,20,BLEND_ALPHA));
            this.game.startTask(this, this.HandleBullet2(
                ShotObject.createShot(this.game, shot.moveObject.position, 2 * (this.scale), deg2rad(rad2deg(shot.moveObject.angle) - 45), 0, "green", 1/3)));
            // HandleBullet2(createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),2,ObjMove_GetAngle(shot)+45,0,RICE_M,RED,20,BLEND_ALPHA));
            this.game.startTask(this, this.HandleBullet2(
                ShotObject.createShot(this.game, shot.moveObject.position, 2 * (this.scale), shot.moveObject.angle + deg2rad(45), 0, "green", 1/3)));
            // if(difficulty >= 2){
            // HandleBullet2(createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),1,ObjMove_GetAngle(shot)-180,0,RICE_M,RED,20,BLEND_ALPHA));
            // }
            // if(difficulty == 4){
            // HandleBullet2(createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),1,ObjMove_GetAngle(shot)-90,0,RICE_M,RED,20,BLEND_ALPHA));
            // HandleBullet2(createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),1,ObjMove_GetAngle(shot)+90,0,RICE_M,RED,20,BLEND_ALPHA));
            // }
        // }
        // Obj_Delete(shot);
        this.game.remove(shot);
    }

    *HandleBullet2(shot: ShotObject): Task {
        yield *wait(333);
        // ObjMove_SetAcceleration(shot,-0.04);
        shot.moveObject.acceleration = -0.004 / 10;
        // ObjMove_SetMaxSpeed(shot, 0);
        // while(ObjMove_GetSpeed(shot) > 0){yield;}
        yield *waitUntil(() => shot.moveObject.speed <= 0);
        yield *wait(333);
        // if(!Obj_IsDeleted(shot)){
        //     PlaySFX(SE_SPARKLE,75);
        //     createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),1.8,ObjMove_GetAngle(shot)+45,0,RICE_S,RED,20,BLEND_ALPHA);
        ShotObject.createShot(this.game, shot.moveObject.position, 1.8 * (this.scale), shot.moveObject.angle + deg2rad(45), 0, "green", 1/3);
        //     createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),1.8,ObjMove_GetAngle(shot)-45,0,RICE_S,RED,20,BLEND_ALPHA);
        ShotObject.createShot(this.game, shot.moveObject.position, 1.8 * (this.scale), shot.moveObject.angle - deg2rad(45), 0, "green", 1/3);
        //     if(difficulty >= 1){
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),1.6,ObjMove_GetAngle(shot)+45,0,RICE_S,RED,20,BLEND_ALPHA);
        ShotObject.createShot(this.game, shot.moveObject.position, 1.6 * (this.scale), shot.moveObject.angle + deg2rad(45), 0, "green", 1/3);
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),1.6,ObjMove_GetAngle(shot)-45,0,RICE_S,RED,20,BLEND_ALPHA);
        ShotObject.createShot(this.game, shot.moveObject.position, 1.6 * (this.scale), shot.moveObject.angle - deg2rad(45), 0, "green", 1/3);
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),1.4,ObjMove_GetAngle(shot)+45,0,RICE_S,RED,20,BLEND_ALPHA);
        ShotObject.createShot(this.game, shot.moveObject.position, 1.4 * (this.scale), shot.moveObject.angle + deg2rad(45), 0, "green", 1/3);
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),1.4,ObjMove_GetAngle(shot)-45,0,RICE_S,RED,20,BLEND_ALPHA);
        ShotObject.createShot(this.game, shot.moveObject.position, 1.4 * (this.scale), shot.moveObject.angle - deg2rad(45), 0, "green", 1/3);
        //     }
        //     if(difficulty >= 2){
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),2.2,ObjMove_GetAngle(shot)+65,0,RICE_S,ORANGE,20,BLEND_ALPHA);
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),2.2,ObjMove_GetAngle(shot)-65,0,RICE_S,ORANGE,20,BLEND_ALPHA);
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),2,ObjMove_GetAngle(shot)+65,0,RICE_S,ORANGE,20,BLEND_ALPHA);
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),2,ObjMove_GetAngle(shot)-65,0,RICE_S,ORANGE,20,BLEND_ALPHA);
        //     }
        //     if(difficulty >= 3){
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),2.8,ObjMove_GetAngle(shot)+120,0,RICE_S,YELLOW,20,BLEND_ALPHA);
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),2.8,ObjMove_GetAngle(shot)-120,0,RICE_S,YELLOW,20,BLEND_ALPHA);
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),2.6,ObjMove_GetAngle(shot)+120,0,RICE_S,YELLOW,20,BLEND_ALPHA);
        //         createShot(ObjMove_GetX(shot),ObjMove_GetY(shot),2.6,ObjMove_GetAngle(shot)-120,0,RICE_S,YELLOW,20,BLEND_ALPHA);
        //     }
        // }
        // Obj_Delete(shot);
        this.game.remove(shot);
    }
    finalize(): void {
        throw new Error("Function not implemented.");
    };
};
