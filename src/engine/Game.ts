import { Camera } from './Camera.js';
import { createContext } from './context.js';
import { pollGamepads, registerGamepadEvents, registerKeyEvents } from './inputHandler.js';
import { GameTime, Scene } from './types.js';

export abstract class Game {
	protected scene: Scene;
	protected camera = new Camera(0, 0);
	protected context: CanvasRenderingContext2D;

	protected frameTime: GameTime = {
		previous: 0,
		secondsPassed: 0,
	};

	constructor(width: number, height: number, selector?: string) {
		this.context = createContext(width, height, selector);
		this.camera.setDimentions(width, height);
	}

	private frame = (time) => {
		window.requestAnimationFrame(this.frame);

		this.frameTime.secondsPassed = (time - this.frameTime.previous) / 1000;
		this.frameTime.previous = time;

		pollGamepads();
		this.scene.update(this.frameTime, this.context, this.camera);
		this.scene.draw(this.context, this.camera);
	};

	public start() {
		registerKeyEvents();
		registerGamepadEvents();

		window.requestAnimationFrame(this.frame);
	}
}
