import { Camera } from '../engine/Camera.js';
import { IEntity, Position } from '../engine/types.js';
import { Bomberman } from './Bomberman.js';
import { Enemy } from './enemies/Enemy.js';

export class Shadow implements IEntity {
	private entity: Bomberman | Enemy;

	protected image = document.querySelector<HTMLImageElement>('img#bomberman');

	position: Position;

	constructor(entity: Bomberman | Enemy) {
		this.entity = entity;
		this.updatePosition();
	}

	updatePosition() {
		this.position = {
			x: this.entity.position.x + this.entity.shadowOffset.x,
			y: this.entity.position.y + this.entity.shadowOffset.y,
		};
	}

	update() {
		this.updatePosition();
	}

	draw(context: CanvasRenderingContext2D, camera?: Camera) {
		context.globalAlpha = 0.35;
		context.drawImage(
			this.image,
			144, 64, 15, 5,
			Math.floor(this.position.x - camera.position.x),
			Math.floor(this.position.y - camera.position.y),
			15, 5,
		);
		context.globalAlpha = 1;
	}
}
