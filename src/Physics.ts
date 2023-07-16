import { Boss } from "./Boss";
import { BulletPath } from "./BulletPath";
import { Enemy } from "./Enemy";
import { Game } from "./Game";
import { Player } from "./Player";
import Transform from "./Transform";
import { Point } from "./Utils";

export type PhysicsEntity = Enemy | BulletPath | Player | Boss;
export class PhysicsSystem {
    enemies: (Enemy|Boss)[] = [];
    friendlyBullets: BulletPath[] = [];
    enemyBullets: BulletPath[] = [];
    player: Player;
    constructor() {
        this.player = Game.instance.player;
    }

    reset() {
        this.enemies = [];
        this.friendlyBullets = [];
        this.enemyBullets = [];
    }
    add(entity: PhysicsEntity) {
        if(entity instanceof Enemy || entity instanceof Boss) {
            this.addEnemy(entity);
        } else if (entity instanceof BulletPath) {
            if(entity.friendly) {
                this.addFriendlyBullet(entity);
            } else {
                this.addEnemyBullet(entity);
            }
        }
    }
    addEnemy(enemy: Enemy|Boss) {
        this.enemies.push(enemy);
    }
    addFriendlyBullet(bullet: BulletPath) {
        this.friendlyBullets.push(bullet);
    }
    addEnemyBullet(bullet: BulletPath) {
        this.enemyBullets.push(bullet);
    }

    remove(entity: PhysicsEntity) {
        if(entity instanceof Enemy|| entity instanceof Boss) {
            this.removeEnemy(entity);
        } else if (entity instanceof BulletPath) {
            if(entity.friendly) {
                this.removeFriendlyBullet(entity);
            } else {
                this.removeEnemyBullet(entity);
            }
        }
    }

    removeEnemy(enemy: Enemy|Boss) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
    }
    removeFriendlyBullet(bullet: BulletPath) {
        this.friendlyBullets.splice(this.friendlyBullets.indexOf(bullet), 1);
    }
    removeEnemyBullet(bullet: BulletPath) {
        this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
    }

    update(dt: number) {
        //check if friendly bullets hit enemies
        this.checkFriendlyBulletCollisions();
        this.checkEnemyBulletCollisions();
    }

    checkFriendlyBulletCollisions() {
        for(const path of this.friendlyBullets) {
            const points = path.points;
            for(let i = points.length - 1; i >= 0; i--) {
                for(let j = this.enemies.length -1; j >= 0; j--) {
                    if(this.enemies[j].collides(points[i])) {
                        this.enemies[j].health -= path.damage;
                        if(this.enemies[j].health <= 0) {
                            if(this.enemies[j] instanceof Enemy) {
                                Game.instance.remove(this.enemies[j]);
                            } else if (this.enemies[j] instanceof Boss) {
                                //kill boss
                                (this.enemies[j] as Boss).nextEvent();
                            }
                        }
                        path.activebullets.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    checkEnemyBulletCollisions() {
        for(const path of this.enemyBullets) {
            const points = path.points;
            for(let i = points.length - 1; i >= 0; i--) {
                if(this.player.collides(points[i])) {
                    Game.instance.timesHit++;
                    path.activebullets.splice(i, 1);
                    break;
                }
            }
        }
    }

}