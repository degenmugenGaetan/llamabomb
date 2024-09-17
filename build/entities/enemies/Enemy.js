import { EnemyStateType } from '../../constants/enemies.js';
import { Direction, MovementLookup } from '../../constants/entities.js';
import { GameEventType } from '../../constants/events.js';
import { FRAME_TIME, TILE_SIZE } from '../../constants/game.js';
import { CollisionTile } from '../../constants/levelData.js';
import { dispatchEvent } from '../../engine/eventHandler.js';
import { LevelEntity } from '../LevelEntity.js';
export class Enemy extends LevelEntity {
    image = document.querySelector('img#enemies');
    onEnd;
    animations;
    constructor(position, baseSpeedTime, collisionMap, onEnd) {
        super(position, baseSpeedTime, collisionMap);
        this.onEnd = onEnd;
        this.changeDirection();
    }
    changeState(newState, time) {
        super.changeState(newState, time);
        this.animationTimer = time.previous + this.animations[this.currentState.type][this.animationFrame][1] * FRAME_TIME;
    }
    changeDirection() {
        this.direction = Object.values(Direction)[Math.floor(Math.random() * 4)];
        this.velocity = {
            x: MovementLookup[this.direction].x * this.speedMultiplier,
            y: MovementLookup[this.direction].y * this.speedMultiplier,
        };
    }
    getMovement() {
        return this.performWallCheck(this.direction);
    }
    checkFlameTileCollision(time) {
        const currentTile = {
            row: Math.floor(this.position.y / TILE_SIZE),
            column: Math.floor(this.position.x / TILE_SIZE),
        };
        if (this.getCollisionTile(currentTile) !== CollisionTile.FLAME)
            return;
        dispatchEvent(GameEventType.REQUEST_STATE_UPDATE, { score: 100 });
        this.changeState(EnemyStateType.DEAD, time);
    }
    updateAnimation(time) {
        if (time.previous < this.animationTimer)
            return;
        if (this.animations[this.currentState.type][this.animationFrame][1] > -1)
            this.animationFrame += 1;
        if (this.animationFrame >= this.animations[this.currentState.type].length) {
            this.animationFrame = 0;
        }
        this.animationTimer = time.previous + this.animations[this.currentState.type][this.animationFrame][1] * FRAME_TIME;
    }
    update(time) {
        super.update(time);
        this.currentState.update(time);
        this.updateAnimation(time);
    }
    draw(context, camera) {
        super.draw(context, camera);
    }
}
//# sourceMappingURL=Enemy.js.map