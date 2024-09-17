import { Control } from '../constants/control.js';
import { FPS, FRAME_TIME, GameScene, SCREEN_HEIGHT } from '../constants/game.js';
import { playSound, stopSound } from '../engine/soundHandler.js';
import { drawFrameOrigin, drawText } from '../engine/context.js';
import * as control from '../engine/inputHandler.js';
import { Scene } from './Scene.js';
const TitleState = {
    SCENERY: 'scenery',
    LOGO: 'logo',
    READY: 'ready',
    DIFFICULTY: 'difficulty',
};
export class TitleScene extends Scene {
    onEnd;
    music = document.querySelector('audio#title');
    image = document.querySelector('img#title');
    frames = new Map([
        ['big-cloud', [[8, 89, 115, 80], [0, 0]]],
        ['left-cloud', [[136, 90, 45, 21], [0, 0]]],
        ['right-cloud', [[136, 120, 58, 24], [0, 0]]],
        ['scenery', [[8, 176, 256, 152], [0, 0]]],
        ['logo', [[8, 8, 227, 71], [0, 0]]],
    ]);
    clouds = [{
            y: 172,
            x: 190,
            velocity: -2.5,
            frame: 'right-cloud',
        }, {
            y: 181,
            x: -5,
            velocity: 1.5,
            frame: 'left-cloud',
        }];
    scenery = {
        y: 0,
        velocity: FPS,
    };
    currentState = TitleState.SCENERY;
    logoEffectTimer = 0;
    logoEffectPosition = 0;
    optionsAlpha = 0;
    difficultyOptions = ['EASY', 'NORMAL', 'HARD'];
    selectedDifficulty = 1; // Default to NORMAL
    constructor(_, onEnd) {
        super();
        this.onEnd = onEnd;
        playSound(this.music, { volume: 0.5 });
        this.fade.fadeIn(1);
    }
    updateLogo(time) {
        if (this.currentState !== TitleState.LOGO || time.previous < this.logoEffectTimer)
            return;
        this.logoEffectPosition += 1;
        this.logoEffectTimer = time.previous + FRAME_TIME * 2;
        if (this.logoEffectPosition > 71)
            this.currentState = TitleState.READY;
    }
    updateClouds(time) {
        for (const cloud of this.clouds) {
            cloud.x += cloud.velocity * time.secondsPassed;
        }
    }
    updateScenery(time) {
        if (this.currentState !== TitleState.SCENERY)
            return;
        this.scenery.y += this.scenery.velocity * time.secondsPassed;
        if (this.scenery.y > 152)
            this.currentState = TitleState.LOGO;
    }
    updateOptions(time) {
        if (this.currentState !== TitleState.READY)
            return;
        this.optionsAlpha = Math.min(1, this.optionsAlpha + 2 * time.secondsPassed);
    }
    updateControls() {
        if (!control.isControlPressed(0, Control.START))
            return;
        if (this.currentState !== TitleState.READY && this.currentState !== TitleState.DIFFICULTY) {
            this.currentState = TitleState.READY;
            this.optionsAlpha = 1;
            this.scenery.y = 158;
            this.logoEffectPosition = 72;
            return;
        }
        if (!this.fade.hasCompleted())
            return;
        if (this.currentState === TitleState.READY) {
            this.currentState = TitleState.DIFFICULTY;
            return;
        }
        if (this.currentState === TitleState.DIFFICULTY) {
            this.onEnd(GameScene.SINGLE_PLAYER, this.difficultyOptions[this.selectedDifficulty]);
        }
    }
    updateDifficultySelection() {
        if (this.currentState !== TitleState.DIFFICULTY)
            return;
        if (control.isControlPressed(0, Control.UP)) {
            this.selectedDifficulty = (this.selectedDifficulty - 1 + this.difficultyOptions.length) % this.difficultyOptions.length;
        }
        if (control.isControlPressed(0, Control.DOWN)) {
            this.selectedDifficulty = (this.selectedDifficulty + 1) % this.difficultyOptions.length;
        }
    }
    drawDifficultyOptions(context) {
        if (this.currentState !== TitleState.DIFFICULTY)
            return;
        drawText(context, 'SELECT DIFFICULTY', -1, 100);
        this.difficultyOptions.forEach((difficulty, index) => {
            const y = 132 + index * 16;
            if (index === this.selectedDifficulty) {
                drawText(context, '>', 65, y);
            }
            drawText(context, difficulty, 75, y);
        });
    }
    drawSkyBackground(context) {
        context.fillStyle = 'rgb(85 115 175)';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
    drawClouds(context) {
        drawFrameOrigin(context, this.image, this.frames.get('big-cloud'), 73, (SCREEN_HEIGHT + 106) - this.scenery.y * 2);
        for (const cloud of this.clouds) {
            drawFrameOrigin(context, this.image, this.frames.get(cloud.frame), Math.floor(cloud.x), Math.floor(cloud.y - this.scenery.y / 2));
        }
    }
    drawLogo(context) {
        context.drawImage(this.image, 8, 79 - this.logoEffectPosition, 227, this.logoEffectPosition, 15, 15 + 71 - this.logoEffectPosition, 227, this.logoEffectPosition);
        if (this.logoEffectPosition > 71)
            return;
        context.drawImage(this.image, 8, 79 - this.logoEffectPosition, 227, 1, 15, 0, 227, 88 - this.logoEffectPosition);
    }
    drawOptions(context) {
        if (this.currentState !== TitleState.READY)
            return;
        context.globalAlpha = this.optionsAlpha;
        drawText(context, 'PUSH START BUTTON!', -1, 116);
        drawText(context, '>', 65, 132);
        drawText(context, '1P START', 75, 132);
        context.globalAlpha = 1;
    }
    update(time) {
        this.updateScenery(time);
        this.updateLogo(time);
        this.updateClouds(time);
        this.updateOptions(time);
        this.updateControls();
        this.updateDifficultySelection();
        this.updateControls();
        this.fade.update(time);
    }
    draw(context) {
        this.drawSkyBackground(context);
        this.drawClouds(context);
        drawFrameOrigin(context, this.image, this.frames.get('scenery'), 0, SCREEN_HEIGHT - this.scenery.y);
        this.drawLogo(context);
        this.drawOptions(context);
        drawText(context, 'FROM NEC ©1991 HUDSON SOFT', -1, 222);
        this.drawDifficultyOptions(context);
        this.fade.draw(context);
    }
    cleanUp() {
        stopSound(this.music);
    }
}
//# sourceMappingURL=TitleScene.js.map