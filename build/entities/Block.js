import { GameEventType } from '../constants/events.js';
import { FRAME_TIME, TILE_SIZE } from '../constants/game.js';
import { Entity } from '../engine/Entity.js';
import { dispatchEvent } from '../engine/eventHandler.js';
import { drawTile } from '../engine/context.js';
const BLOCK_FRAME_DELAY = 4 * FRAME_TIME;
export class Block extends Entity {
    onEnd;
    animationFrame = 24;
    bonusCollisionType;
    image = document.querySelector('img#tiles');
    constructor(position, bonusCollisionType, time, onEnd) {
        super(position);
        this.onEnd = onEnd;
        this.bonusCollisionType = bonusCollisionType;
        this.animationTimer = time.previous + BLOCK_FRAME_DELAY;
    }
    updateAnimation(time) {
        if (time.previous < this.animationTimer)
            return;
        this.animationFrame += 1;
        this.animationTimer = time.previous + BLOCK_FRAME_DELAY;
        if (this.animationFrame < 30)
            return;
        this.animationFrame = 0;
        this.onEnd(this);
        dispatchEvent(GameEventType.BLOCK_REMOVED, {
            tiles: [{
                    position: { row: this.position.y, column: this.position.x },
                    type: this.bonusCollisionType,
                }], time,
        });
    }
    update(time) {
        this.updateAnimation(time);
    }
    draw(context, camera) {
        drawTile(context, this.image, (this.position.x * TILE_SIZE) - camera.position.x, (this.position.y * TILE_SIZE) - camera.position.y, this.animationFrame, TILE_SIZE);
    }
}
//# sourceMappingURL=Block.js.map