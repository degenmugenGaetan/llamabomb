import { TILE_SIZE } from '../../constants/game.js';
import { PickUpLookUp } from '../../constants/levelData.js';
import { Entity } from '../../engine/Entity.js';
import { drawTile } from '../../utils/context.js';
export class PickUp extends Entity {
    baseFrame;
    animation;
    image = document.querySelector('img#pickups');
    constructor(position, type, animation) {
        super(position);
        this.baseFrame = PickUpLookUp[type].baseFrame;
        this.animation = animation;
    }
    update = () => undefined;
    draw(context, camera) {
        const frame = this.baseFrame === 0 ? 0 : this.baseFrame + this.animation.frame;
        drawTile(context, this.image, (this.position.x * TILE_SIZE) - camera.position.x, (this.position.y * TILE_SIZE) - camera.position.y, frame, TILE_SIZE);
    }
}
//# sourceMappingURL=PickUp.js.map