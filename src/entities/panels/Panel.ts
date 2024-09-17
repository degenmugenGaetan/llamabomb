import { Entity } from '../../engine/Entity.js';
import { GameTime, Position } from '../../engine/types.js';

export abstract class Panel extends Entity {
	image = document.querySelector<HTMLImageElement>('img#panel');

	clock: number[];
	clockTimer = 0;

	constructor(position: Position, time: GameTime) {
		super(position);

		this.clockTimer = time.previous + 1000;
	}

	updateClock(time: GameTime) {
		if (time.previous < this.clockTimer) return;

		this.clock[1] -= 1;
		if (this.clock[1] < 0) {
			this.clock[1] = 59;
			if (this.clock[0] > 0) this.clock[0] -= 1;
		}

		this.clockTimer = time.previous + 1000;
	}
}
