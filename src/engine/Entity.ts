import { Position } from './types.js';

export abstract class Entity {
	public position: Position;

	protected animationFrame: number;
	protected animationTimer: DOMHighResTimeStamp;

	protected image: HTMLImageElement;

	constructor(position: Position) {
		this.position = position;
		this.animationFrame = 0;
	}
}
