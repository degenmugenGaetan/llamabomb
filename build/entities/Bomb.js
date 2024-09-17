import { FRAME_TIME, TILE_SIZE } from '../constants/game.js';
import { Entity } from '../engine/Entity.js';
import { drawFrame } from '../engine/context.js';
const BOMB_FRAME_DELAY = 16 * FRAME_TIME;
const BOMB_ANIMATION = [0, 1, 2, 1];
const FUSE_TIMER = 3000;
export class Bomb extends Entity {
    ownerId;
    onEnd;
    strength;
    fuseTimer;
    animationFrame = 0;
    image = document.querySelector('img#bomb');
    constructor(position, strength, ownerId, time, onEnd) {
        super(position);
        this.ownerId = ownerId;
        this.strength = strength;
        this.onEnd = onEnd;
        this.animationTimer = time.previous + BOMB_FRAME_DELAY;
        this.fuseTimer = time.previous + FUSE_TIMER;
    }
    updateAnimation(time) {
        if (time.previous < this.animationTimer)
            return;
        this.animationFrame += 1;
        if (this.animationFrame >= BOMB_ANIMATION.length)
            this.animationFrame = 0;
        this.animationTimer = time.previous + BOMB_FRAME_DELAY;
    }
    updateFuse(time) {
        if (time.previous < this.fuseTimer)
            return;
        this.onEnd(this, time);
    }
    update(time) {
        this.updateAnimation(time);
        this.updateFuse(time);
    }
    draw(context, camera) {
        drawFrame(context, this.image, [BOMB_ANIMATION[this.animationFrame] * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE], (this.position.x * TILE_SIZE) - camera.position.x, (this.position.y * TILE_SIZE) - camera.position.y);
    }
}
//# sourceMappingURL=Bomb.js.map