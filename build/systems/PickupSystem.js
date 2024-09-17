import { GameEventType } from '../constants/events.js';
import { FRAME_TIME } from '../constants/game.js';
import { CollisionTile, CollisionToPickupLookUp } from '../constants/levelData.js';
import { subscribeEvent, dispatchEvent } from '../engine/eventHandler.js';
import { playSound } from '../engine/soundHandler.js';
import { PickUp } from '../entities/bonuses/index.js';
import { System } from './System.js';
const FLASH_DELAY = 8 * FRAME_TIME;
export class PickUpSystem extends System {
    soundPickup = document.querySelector('audio#pickup');
    players;
    animation = { frame: 0, timer: 0 };
    constructor(levelData, players) {
        super(levelData);
        this.players = players;
        subscribeEvent(GameEventType.BLOCK_REMOVED, this.constructor.name, this.add);
        subscribeEvent(GameEventType.REMOVE_PICKUP, this.constructor.name, this.removePickup);
    }
    updateAnimation(time) {
        if (time.previous < this.animation.timer)
            return;
        this.animation.frame = 1 - this.animation.frame;
        this.animation.timer = time.previous + FLASH_DELAY;
    }
    update(time) {
        this.updateAnimation(time);
    }
    removePickup = (payload) => {
        for (const tile of payload.tiles) {
            const pickup = this.entries.find((entry) => entry.position.x === tile.position.column && entry.position.y === tile.position.row);
            if (!pickup)
                continue;
            super.remove(pickup);
            playSound(this.soundPickup);
            dispatchEvent(GameEventType.REQUEST_STATE_UPDATE, { score: 1000 });
        }
    };
    add = (payload) => {
        for (const tile of payload.tiles) {
            if (tile.type === CollisionTile.EMPTY)
                continue;
            this.entries.push(new PickUp({ x: tile.position.column, y: tile.position.row }, CollisionToPickupLookUp[tile.type], this.animation));
        }
    };
}
//# sourceMappingURL=PickupSystem.js.map