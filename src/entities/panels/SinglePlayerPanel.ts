import { GameEventType } from '../../constants/events.js';
import { subscribeEvent } from '../../engine/eventHandler.js';
import { Drawable, GameTime, Updateable } from '../../engine/types.js';
import { drawText } from '../../engine/context.js';
import { Panel } from './Panel.js';

export class SinglePlayerPanel extends Panel implements Drawable, Updateable {
	clock = [4, 0];

	lives = 2;
	hiScore = 0;
	score = 0;

	constructor(time: GameTime) {
		super({ x: 0, y: 0 }, time);

		subscribeEvent(GameEventType.REQUEST_STATE_UPDATE, this.constructor.name, this.handleStateUpdate);
	}

	update(time: GameTime) {
		super.updateClock(time);
	}

	draw(context: CanvasRenderingContext2D) {
		context.drawImage(this.image, 8, 8, 256, 24, 0, 0, 256, 24);
		drawText(context, String(this.score), 88 - String(this.score).length * 8, 8, 8);
		drawText(context, `${String(this.clock[0])}:${String(this.clock[1]).padStart(2, '0')}`, 104, 8, 8);
		drawText(context, String(this.lives), 152, 8, 8);
		drawText(context, String(this.hiScore), 240, 8, 8);
	}

	private handleStateUpdate = ({ lives = 0, score = 0 }) => {
		this.score += score;
		this.lives += lives;
	};
}
