import { orangeOneAnimations, enemyFrames, EnemyStateType } from '../../constants/enemies.js';
import { drawFrameOrigin } from '../../engine/context.js';
import { Enemy } from './Enemy.js';
import { isZero } from '../../utils/utils.js';
export class OrangeOneEnemy extends Enemy {
    animations = orangeOneAnimations;
    shadowOffset = { x: -7, y: 2 };
    speedMultiplier = 1.3;
    constructor(position, collisionMap, time, onEnd, speedMultiplier) {
        super(position, 50, collisionMap, onEnd);
        this.speedMultiplier = speedMultiplier;
        this.states = {
            [EnemyStateType.ALIVE]: {
                type: EnemyStateType.ALIVE,
                init: this.resetVelocities,
                update: this.handleAliveState,
            },
            [EnemyStateType.DEAD]: {
                type: EnemyStateType.DEAD,
                init: this.resetVelocities,
                update: this.handleDeadState,
            },
        };
        this.changeState(EnemyStateType.ALIVE, time);
    }
    updateMovement() {
        if (isZero(this.velocity))
            this.changeDirection();
        const [, velocity] = this.getMovement();
        this.velocity = velocity;
    }
    handleAliveState = (time) => {
        this.updateMovement();
        this.checkFlameTileCollision(time);
    };
    handleDeadState = () => {
        if (this.animationFrame >= this.animations[this.currentState.type].length - 1) {
            this.onEnd(this);
        }
    };
    draw(context, camera) {
        const [frameKey] = this.animations[this.currentState.type][this.animationFrame];
        const frame = enemyFrames.get(frameKey);
        drawFrameOrigin(context, this.image, frame, Math.floor(this.position.x - camera.position.x), Math.floor(this.position.y - camera.position.y));
        super.draw(context, camera);
    }
}
//# sourceMappingURL=OrangeOneEnemy.js.map