import { enemyAnimations, enemyFrames } from '../../constants/enemies.js';
import { GAME_OFFSET_Y, TILE_SIZE } from '../../constants/game.js';
import { drawFrameOrigin } from '../../utils/context.js';
import { Enemy } from './Enemy.js';
export class OrangeOneEnemy extends Enemy {
    image = document.querySelector('img#enemies');
    constructor(position) {
        super({
            x: position.column * TILE_SIZE,
            y: position.row * TILE_SIZE,
        }, 50);
        console.log(position, this.position);
    }
    updateAnimation(time) {
        if (time.previous < this.animationTimer)
            return;
        this.animationFrame += 1;
        if (this.animationFrame >= enemyAnimations[0].length)
            this.animationFrame = 0;
        this.animationTimer = time.previous + 200;
    }
    update(time) {
        this.updateAnimation(time);
    }
    draw(context, camera) {
        const [frameKey] = enemyAnimations[0][this.animationFrame];
        const frame = enemyFrames.get(frameKey);
        drawFrameOrigin(context, this.image, frame, this.position.x, this.position.y - camera.position.y + GAME_OFFSET_Y);
    }
}
//# sourceMappingURL=OrangeOne.js.map