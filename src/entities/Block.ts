import { GameEventType, LevelMapChangePayload } from '../constants/events.js';
import { FRAME_TIME, TILE_SIZE } from '../constants/game.js';
import { CollisionTile } from '../constants/levelData.js';
import { Camera } from '../engine/Camera.js';
import { Entity } from '../engine/Entity.js';
import { dispatchEvent } from '../engine/eventHandler.js';
import { Drawable, GameTime, Position, Updateable, ValueOf } from '../engine/types.js';
import { drawTile } from '../engine/context.js';

const BLOCK_FRAME_DELAY = 4 * FRAME_TIME;

export class Block extends Entity implements Drawable, Updateable {
	onEnd: (bomb: Block) => void;

	animationFrame = 24;
	bonusCollisionType?: ValueOf<typeof CollisionTile>;

	image = document.querySelector<HTMLImageElement>('img#tiles');

	constructor(
		position: Position, bonusCollisionType: ValueOf<typeof CollisionTile>,
		time: GameTime, onEnd: (bomb: Block) => void,
	) {
		super(position);

		this.onEnd = onEnd;
		this.bonusCollisionType = bonusCollisionType;
		this.animationTimer = time.previous + BLOCK_FRAME_DELAY;
	}

	updateAnimation(time: GameTime) {
		if (time.previous < this.animationTimer) return;

		this.animationFrame += 1;
		this.animationTimer = time.previous + BLOCK_FRAME_DELAY;

		if (this.animationFrame < 30) return;

		this.animationFrame = 0;
		this.onEnd(this);

		dispatchEvent<LevelMapChangePayload>(
			GameEventType.BLOCK_REMOVED, {
			tiles: [{
				position: { row: this.position.y, column: this.position.x },
				type: this.bonusCollisionType,
			}], time,
		});
	}

	update(time: GameTime) {
		this.updateAnimation(time);
	}

	draw(context: CanvasRenderingContext2D, camera?: Camera): void {
		drawTile(
			context, this.image,
			(this.position.x * TILE_SIZE) - camera.position.x,
			(this.position.y * TILE_SIZE) - camera.position.y,
			this.animationFrame, TILE_SIZE,
		);
	}
}
