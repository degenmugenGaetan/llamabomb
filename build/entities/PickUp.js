import { TILE_SIZE } from '../constants/game.js';
import { Entity } from '../engine/Entity.js';
import { drawTile } from '../utils/context.js';
import { PickUpLookUp } from '../constants/levelData.js';
export class PickUp extends Entity {
    baseFrame;
    image = document.querySelector('img#pickups');
    constructor(position, type) {
        super(position);
        this.baseFrame = PickUpLookUp[type].baseFrame;
    }
    update = () => undefined;
    draw(context, camera) {
        drawTile(context, this.image, (this.position.x * TILE_SIZE) - camera.position.x, (this.position.y * TILE_SIZE) - camera.position.y, this.baseFrame + this.animationFrame, TILE_SIZE);
    }
}
//# sourceMappingURL=PickUp.js.map