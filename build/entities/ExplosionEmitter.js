import { FRAME_TIME, TILE_SIZE } from '../constants/game.js';
import { Entity } from '../engine/Entity.js';
import { drawTile } from '../engine/context.js';
const EXPLOSION_FRAME_DELAY = 4 * FRAME_TIME;
const EXPLOSION_ANIMATION = [3, 5, 6, 7, 6, 5, 4];
const FLAME_ANIMATION = [0, 1, 2, 3, 2, 1, 0];
export class ExplosionEmitter extends Entity {
    onEnd;
    flameTiles;
    image = document.querySelector('img#bomb');
    constructor(position, flameTiles, time, onEnd) {
        super(position);
        this.flameTiles = flameTiles;
        this.animationTimer = time.previous + EXPLOSION_FRAME_DELAY;
        this.onEnd = onEnd;
    }
    getStartingFrame(flame) {
        if (!flame.isVertical && !flame.isLast) {
            return 28;
        }
        else if (flame.isVertical && !flame.isLast) {
            return 24;
        }
        else if (!flame.isVertical && flame.isLast) {
            return flame.position.column < this.position.x ? 20 : 16;
        }
        else if (flame.isVertical && flame.isLast) {
            return flame.position.row < this.position.y ? 8 : 12;
        }
    }
    updateAnimation(time) {
        if (time.previous < this.animationTimer)
            return;
        this.animationFrame += 1;
        this.animationTimer = time.previous + EXPLOSION_FRAME_DELAY;
        if (this.animationFrame < EXPLOSION_ANIMATION.length)
            return;
        this.animationFrame = 0;
        this.onEnd(this);
    }
    update(time) {
        this.updateAnimation(time);
    }
    draw(context, camera) {
        drawTile(context, this.image, (this.position.x * TILE_SIZE) - camera.position.x, (this.position.y * TILE_SIZE) - camera.position.y, EXPLOSION_ANIMATION[this.animationFrame], TILE_SIZE);
        for (const flame of this.flameTiles) {
            const startingFrame = this.getStartingFrame(flame);
            drawTile(context, this.image, (flame.position.column * TILE_SIZE) - camera.position.x, (flame.position.row * TILE_SIZE) - camera.position.y, startingFrame + FLAME_ANIMATION[this.animationFrame], TILE_SIZE);
        }
    }
}
//# sourceMappingURL=ExplosionEmitter.js.map