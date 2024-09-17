import { Entity } from '../../engine/Entity.js';
export class Panel extends Entity {
    image = document.querySelector('img#panel');
    clock;
    clockTimer = 0;
    constructor(position, time) {
        super(position);
        this.clockTimer = time.previous + 1000;
    }
    updateClock(time) {
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
}
//# sourceMappingURL=Panel.js.map