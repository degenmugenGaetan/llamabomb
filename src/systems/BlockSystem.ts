import { GameEventType } from '../constants/events.js';
import { CollisionMapTile, CollisionTile } from '../constants/levelData.js';
import { subscribeEvent, dispatchEvent } from '../engine/eventHandler.js';
import { ValueOf } from '../engine/types.js';
import { Block } from '../entities/Block.js';
import { System } from './System.js';

export class BlockSystem extends System<Block> {
	bonusTiles: CollisionMapTile[];

	constructor(levelData: ValueOf<typeof CollisionTile>[][], bonusTiles: CollisionMapTile[]) {
		super(levelData);
		this.bonusTiles = bonusTiles;

		subscribeEvent(GameEventType.BLOCK_DESTROYED, this.constructor.name, this.add);
	}

	getBonusIndex(row: number, column: number): number | undefined {
		for (const bonusTile of this.bonusTiles) {
			if (bonusTile.position.row === row && bonusTile.position.column === column) {
				return this.bonusTiles.indexOf(bonusTile);
			}
		}

		return -1;
	}

	remove = (block: Block) => {
		super.remove(block);

		dispatchEvent(GameEventType.BLOCK_CHANGE, [{ column: block.position.x, row: block.position.y }]);
	};

	add = (blocks: any) => {
		for (const block of blocks) {
			const bonusIndex = this.getBonusIndex(block.row, block.column);

			this.entries.push(
				new Block(
					{ x: block.column, y: block.row },
					this.bonusTiles[bonusIndex]?.type ?? CollisionTile.EMPTY,
					block.time, this.remove,
				),
			);

			if (bonusIndex > -1) this.bonusTiles.splice(bonusIndex, 1);
		}
	};
}
