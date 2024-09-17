import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants/game.js';
import { Position, Size } from './types.js';

export class Camera {
	position: Position;
	startPosition: Position;
	dimensions: Size;

	constructor(x: number, y: number, width = SCREEN_WIDTH, height = SCREEN_HEIGHT) {
		this.position = { x, y };
		this.startPosition = { x, y };
		this.dimensions = { width, height };
	}

	setDimentions(width: number, height: number) {
		this.dimensions = { width, height };
	}

	update() {
		// MAX LIMITS
		if (this.position.x < 0) this.position.x = 0;
		if (this.position.y < 0) this.position.y = 0;
	}

	reset() {
		this.position = { ...this.startPosition };
	}
}
