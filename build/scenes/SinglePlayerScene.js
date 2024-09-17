import { SinglePlayerPanel } from '../entities/panels/SinglePlayerPanel.js';
import { LevelMap } from '../entities/level/LevelMap.js';
import { Bomberman } from '../entities/Bomberman.js';
import { playSound, stopSound } from '../engine/soundHandler.js';
import { clearEvents } from '../engine/eventHandler.js';
import { isKeyDown } from '../engine/inputHandler.js';
import { Camera } from '../engine/Camera.js';
import { BombSystem, EnemySystem, ExplosionEmitterSystem, PickUpSystem } from '../systems/index.js';
import { ShadowSystem } from '../systems/ShadowSystem.js';
import { BlockSystem } from '../systems/BlockSystem.js';
import { GAME_OFFSET_Y, GameScene } from '../constants/game.js';
import { Scene } from './Scene.js';
import { sendScore } from '../ao.js';
export class SinglePlayerScene extends Scene {
    level;
    panel;
    player;
    camera;
    systems;
    enemySystem;
    shadowSystem;
    onEnd;
    music = document.querySelector('audio#bgm');
    difficulty;
    constructor(time, onEnd, difficulty) {
        super();
        this.difficulty = difficulty;
        this.level = new LevelMap('img#tiles', 0);
        this.camera = new Camera(8, -GAME_OFFSET_Y);
        const enemyCount = this.getEnemyCount();
        const enemySpeed = this.getEnemySpeed();
        this.enemySystem = new EnemySystem(this.level.colData, time, enemyCount, enemySpeed);
        this.player = new Bomberman(0, { x: 2, y: 1 }, this.level.colData, this.enemySystem.entries, time);
        this.shadowSystem = new ShadowSystem([this.player], this.enemySystem.entries);
        this.systems = [
            new PickUpSystem(this.level.colData, [this.player]),
            new BombSystem(this.level.colData),
            new ExplosionEmitterSystem(this.level.colData),
            this.enemySystem,
            new BlockSystem(this.level.colData, this.level.bonusTiles),
        ];
        this.panel = new SinglePlayerPanel(time);
        this.onEnd = onEnd;
        playSound(this.music, { volume: 0.5 });
        this.fade.fadeIn(0.5);
    }
    async afterGame() {
        console.log(`Game over. Difficulty: ${this.difficulty}, Score: ${this.panel.score}, Address: ${globalThis.walletAddress}`);
        try {
            await sendScore(this.panel.score.toString());
            console.log('Score sent successfully');
            // Dispatch a custom event to display the message in the navbar
            const event = new CustomEvent('scoreSubmitted', {
                detail: { score: this.panel.score }
            });
            window.dispatchEvent(event);
        }
        catch (error) {
            console.error('Failed to send score:', error);
        }
    }
    update(time) {
        if (isKeyDown('Escape') || this.panel.lives < 0 || this.player.exitYOffset > 20) {
            this.afterGame(); // Call afterGame before ending the scene
            this.onEnd(GameScene.TITLE);
            return;
        }
        this.level.update(time);
        this.systems.forEach((system) => system.update(time));
        this.player.update(time);
        this.panel.update(time);
        this.fade.update(time);
    }
    draw(context) {
        this.level.draw(context, this.camera);
        this.shadowSystem.draw(context, this.camera);
        this.systems.forEach((system) => system.draw(context, this.camera));
        this.player.draw(context, this.camera);
        this.fade.draw(context);
        this.panel.draw(context);
    }
    cleanUp() {
        stopSound(this.music);
        clearEvents();
    }
    getEnemyCount() {
        switch (this.difficulty) {
            case 'EASY': return 2;
            case 'NORMAL': return 4;
            case 'HARD': return 6;
            default: return 4;
        }
    }
    getEnemySpeed() {
        switch (this.difficulty) {
            case 'EASY': return 0.7;
            case 'NORMAL': return 1;
            case 'HARD': return 1.2;
            default: return 1;
        }
    }
}
//# sourceMappingURL=SinglePlayerScene.js.map