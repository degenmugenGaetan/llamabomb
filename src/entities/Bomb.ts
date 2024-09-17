import { FRAME_TIME, TILE_SIZE } from '../constants/game.js';
import { Camera } from '../engine/Camera.js';
import { Entity } from '../engine/Entity.js';
import { GameTime, IEntity, Position } from '../engine/types.js';
import { drawFrame } from '../engine/context.js';

const BOMB_FRAME_DELAY = 16 * FRAME_TIME;
const BOMB_ANIMATION = [0, 1, 2, 1] as const;
const FUSE_TIMER = 3000;

export class Bomb extends Entity implements IEntity {
	ownerId: number;

	onEnd: (bomb: Bomb, time: GameTime) => void;
	strength: number;
	fuseTimer: DOMHighResTimeStamp;

	animationFrame = 0;

	image = document.querySelector<HTMLImageElement>('img#bomb');

	constructor(position: Position, strength: number, ownerId: number, time: GameTime, onEnd: () => void) {
		super(position);

		this.ownerId = ownerId;
		this.strength = strength;
		this.onEnd = onEnd;

		this.animationTimer = time.previous + BOMB_FRAME_DELAY;
		this.fuseTimer = time.previous + FUSE_TIMER;
	}

	updateAnimation(time: GameTime) {
		if (time.previous < this.animationTimer) return;

		this.animationFrame += 1;
		if (this.animationFrame >= BOMB_ANIMATION.length) this.animationFrame = 0;
		this.animationTimer = time.previous + BOMB_FRAME_DELAY;
	}

	updateFuse(time: GameTime) {
		if (time.previous < this.fuseTimer) return;
		this.onEnd(this, time);
	}

	update(time: GameTime) {
		this.updateAnimation(time);
		this.updateFuse(time);
	}

	draw(context: CanvasRenderingContext2D, camera?: Camera): void {
		drawFrame(
			context, this.image, [BOMB_ANIMATION[this.animationFrame] * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE],
			(this.position.x * TILE_SIZE) - camera.position.x,
			(this.position.y * TILE_SIZE) - camera.position.y,
		);
	}
}
