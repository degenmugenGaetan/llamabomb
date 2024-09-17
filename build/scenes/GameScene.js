import { LevelMap } from '../entities/LevelMap.js';
import { Bomberman } from '../entities/Bomberman.js';
import { Camera } from '../engine/Camera.js';
import { Panel } from '../entities/Panel.js';
import { Shadow } from '../entities/Shadow.js';
import { playSound } from '../engine/soundHandler.js';
import { BombSystem } from '../systems/BombSystem.js';
import { EnemySystem } from '../systems/EnemySystem.js';
export class GameScene {
    level;
    panel;
    player;
    playerShadow;
    camera;
    systems;
    music = document.querySelector('audio#bgm');
    constructor(time) {
        this.systems = [
            new BombSystem(),
            new EnemySystem(),
        ];
        this.level = new LevelMap(0);
        this.panel = new Panel(time);
        this.player = new Bomberman(0, 2, 1, this.level.colData, time);
        this.playerShadow = new Shadow(this.player, -7, 2);
        this.camera = new Camera(8, 0);
        playSound(this.music, { volume: 0.6 });
    }
    update(time) {
        this.systems.forEach((system) => system.update(time));
        this.player.update(time);
        this.panel.update(time);
    }
    draw(context) {
        this.level.draw(context, this.camera);
        this.playerShadow.draw(context, this.camera);
        this.systems.forEach((system) => system.draw(context, this.camera));
        this.player.draw(context, this.camera);
        this.panel.draw(context);
    }
    cleanup = () => undefined;
}
//# sourceMappingURL=GameScene.js.map