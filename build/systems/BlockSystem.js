import { GameEventType } from '../constants/events.js';
import { CollisionTile } from '../constants/levelData.js';
import { subscribeEvent, dispatchEvent } from '../engine/eventHandler.js';
import { Block } from '../entities/Block.js';
import { System } from './System.js';
export class BlockSystem extends System {
    bonusTiles;
    constructor(levelData, bonusTiles) {
        super(levelData);
        this.bonusTiles = bonusTiles;
        subscribeEvent(GameEventType.BLOCK_DESTROYED, this.constructor.name, this.add);
    }
    getBonusIndex(row, column) {
        for (const bonusTile of this.bonusTiles) {
            if (bonusTile.position.row === row && bonusTile.position.column === column) {
                return this.bonusTiles.indexOf(bonusTile);
            }
        }
        return -1;
    }
    remove = (block) => {
        super.remove(block);
        dispatchEvent(GameEventType.BLOCK_CHANGE, [{ column: block.position.x, row: block.position.y }]);
    };
    add = (blocks) => {
        for (const block of blocks) {
            const bonusIndex = this.getBonusIndex(block.row, block.column);
            this.entries.push(new Block({ x: block.column, y: block.row }, this.bonusTiles[bonusIndex]?.type ?? CollisionTile.EMPTY, block.time, this.remove));
            if (bonusIndex > -1)
                this.bonusTiles.splice(bonusIndex, 1);
        }
    };
}
//# sourceMappingURL=BlockSystem.js.map