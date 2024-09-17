import { TILE_SIZE } from '../../constants/game.js';
import { PickUpLookUp } from '../../constants/levelData.js';
import { PickUpType } from '../../constants/pickups.js';
import { Camera } from '../../engine/Camera.js';
import { Entity } from '../../engine/Entity.js';
import { IEntity, Position, ValueOf } from '../../engine/types.js';
import { drawTile } from '../../engine/context.js';

export class ExitDoor extends Entity implements IEntity {
	baseFrame: number;
	animation: { frame: number, timer: number };

	image = document.querySelector<HTMLImageElement>('img#pickups');

	constructor(position: Position, type: ValueOf<typeof PickUpType>, animation: { frame: number, timer: number }) {
		super(position);
		this.baseFrame = PickUpLookUp[type].baseFrame;
		this.animation = animation;
	}

	update = () => undefined;

	draw(context: CanvasRenderingContext2D, camera?: Camera): void {
		const frame = this.baseFrame === 0 ? 0 : this.baseFrame + this.animation.frame;

		drawTile(
			context, this.image,
			(this.position.x * TILE_SIZE) - camera.position.x, (this.position.y * TILE_SIZE) - camera.position.y,
			frame, TILE_SIZE,
		);
	}
}
