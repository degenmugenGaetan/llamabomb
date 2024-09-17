import { Camera } from '../engine/Camera.js';
import { Drawable } from '../engine/types.js';
import { Bomberman } from '../entities/Bomberman.js';
import { Enemy } from '../entities/enemies/Enemy.js';

export class ShadowSystem implements Drawable {
	players: Bomberman[];
	enemies: Enemy[];

	protected image = document.querySelector<HTMLImageElement>('img#bomberman');

	constructor(players: Bomberman[], enemies: Enemy[]) {
		this.players = players;
		this.enemies = enemies;
	}

	drawShadow(
		context: CanvasRenderingContext2D, camera: Camera, entity: Bomberman | Enemy,
	) {
		context.globalAlpha = 0.35;
		context.drawImage(
			this.image,
			144, 64, 15, 5,
			Math.floor(entity.position.x + entity.shadowOffset.x - camera.position.x),
			Math.floor(entity.position.y + entity.shadowOffset.y - camera.position.y),
			15, 5,
		);
		context.globalAlpha = 1;
	}

	public draw(context: CanvasRenderingContext2D, camera: Camera): void {
		for (const player of this.players) {
			this.drawShadow(context, camera, player);
		}

		for (const enemy of this.enemies) {
			this.drawShadow(context, camera, enemy);
		}
	}
}
