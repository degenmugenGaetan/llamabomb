import { GameEventType } from '../constants/events.js';
import { Entity } from '../engine/Entity.js';
import { subscribeEvent } from '../engine/eventHandler.js';
import { drawText } from '../utils/context.js';
export class Panel extends Entity {
    image = document.querySelector('img#panel');
    clock = [4, 0];
    clockTimer = 0;
    lives = 2;
    hiScore = 0;
    score = 0;
    constructor(time) {
        super({ x: 0, y: 0 }, noPlayers, clock);
        this.clockTimer = time.previous + 1000;
        subscribeEvent(GameEventType.REQUEST_STATE_UPDATE, this.constructor.name, this.handleStateUpdate);
    }
    update(time) {
        if (time.previous < this.clockTimer)
            return;
        this.clock[1] -= 1;
        if (this.clock[1] < 0) {
            this.clock[1] = 59;
            if (this.clock[0] > 0)
                this.clock[0] -= 1;
        }
        this.clockTimer = time.previous + 1000;
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, 256, 24, 0, 0, 256, 24);
        drawText(context, String(this.score), 88 - String(this.score).length * 8, 8, 8);
        drawText(context, `${String(this.clock[0])}:${String(this.clock[1]).padStart(2, '0')}`, 104, 8, 8);
        drawText(context, String(this.lives), 152, 8, 8);
        drawText(context, String(this.hiScore), 240, 8, 8);
    }
    handleStateUpdate = ({ lives = 0, score = 0 }) => {
        this.score += score;
        this.lives += lives;
    };
}
//# sourceMappingURL=Panel.js.map