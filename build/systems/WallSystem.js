import { System } from './System.js';
export class WallSystem extends System {
    constructor(levelData) {
        super(levelData);
    }
    remove(enemy) {
        super.remove(enemy);
    }
    add = (enemies) => {
        for (const enemy of enemies) {
            this.entries.push(new enemy.Class(enemy.position.x, enemy.position.y));
        }
    };
}
//# sourceMappingURL=WallSystem.js.map