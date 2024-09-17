import { Control } from '../constants/control.js';
import { GameScene } from '../constants/game.js';
import { isControlPressed } from '../engine/inputHandler.js';
import { drawText } from '../engine/context.js';
export class DisclaimerScene {
    onEnd;
    constructor(time, onEnd) {
        this.onEnd = onEnd;
    }
    update() {
        if (!(isControlPressed(0, Control.ACTION) || isControlPressed(0, Control.START)))
            return;
        this.onEnd(GameScene.TITLE);
    }
    draw(context) {
        drawText(context, 'LLAMABOMB WIP', -1, 50, 8);
        drawText(context, 'NOTE: GAME MADE FOR', -1, 110, 8);
        drawText(context, 'THE AO GAME JAM 2024', -1, 120, 8);
        drawText(context, 'PRESS ENTER', -1, 190, 8);
        drawText(context, 'TO CONTINUE', -1, 200, 8);
    }
    cleanUp = () => undefined;
}
//# sourceMappingURL=DisclaimerScene.js.map