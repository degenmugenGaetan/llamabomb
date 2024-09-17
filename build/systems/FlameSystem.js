import { GameEventType } from '../constants/events.js';
import { subscribeEvent } from '../engine/eventHandler.js';
import { System } from './System.js';
export class ExplosionEmitterSystem extends System {
    constructor() {
        super();
        subscribeEvent(GameEventType.ADD_ENEMIES, this.add);
    }
    remove(eplosion) {
    }
    add = (enemies) => {
    };
}
//# sourceMappingURL=FlameSystem.js.map