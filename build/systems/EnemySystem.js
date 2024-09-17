import { GameEventType } from '../constants/events.js';
import { CollisionTile } from '../constants/levelData.js';
import { subscribeEvent, dispatchEvent } from '../engine/eventHandler.js';
import { playSound } from '../engine/soundHandler.js';
import { OrangeOneEnemy } from '../entities/enemies/OrangeOneEnemy.js';
import { System } from './System.js';
export class EnemySystem extends System {
    soundExitOpen = document.querySelector('audio#exit-open');
    enemyCount;
    enemySpeed;
    constructor(collisionMap, time, enemyCount, enemySpeed) {
        super(collisionMap);
        this.enemyCount = enemyCount;
        this.enemySpeed = enemySpeed;
        subscribeEvent(GameEventType.ADD_ENEMIES, this.constructor.name, this.add);
        this.addInitialEnemies(0, time);
    }
    addInitialEnemies(levelId, time) {
        for (let amount = 0; amount < this.enemyCount; amount++) {
            let row = 0, column = 0;
            while (this.collisionMap[row][column] !== CollisionTile.EMPTY) {
                row = 1 + Math.floor(Math.random() * (this.collisionMap.length - 3));
                column = 2 + Math.floor(Math.random() * (this.collisionMap[0].length - 4));
            }
            this.entries.push(new OrangeOneEnemy({ x: column, y: row }, this.collisionMap, time, this.remove, this.enemySpeed));
        }
    }
    remove = (enemy) => {
        super.remove(enemy);
        if (this.entries.length > 0)
            return;
        dispatchEvent(GameEventType.REQUEST_EXIT_OPEN);
        playSound(this.soundExitOpen);
    };
    add = (payload) => {
        for (const enemy of payload.enemies) {
            this.entries.push(new enemy.Class({ x: enemy.position.column, y: enemy.position.row }, this.collisionMap, payload.time, this.remove, this.enemySpeed));
        }
    };
    update(time) {
        this.entries.sort((a, b) => a.position.y - b.position.y);
        super.update(time);
    }
}
//# sourceMappingURL=EnemySystem.js.map