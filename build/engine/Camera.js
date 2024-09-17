import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants/game.js';
export class Camera {
    position;
    startPosition;
    dimensions;
    constructor(x, y, width = SCREEN_WIDTH, height = SCREEN_HEIGHT) {
        this.position = { x, y };
        this.startPosition = { x, y };
        this.dimensions = { width, height };
    }
    setDimentions(width, height) {
        this.dimensions = { width, height };
    }
    update() {
        // MAX LIMITS
        if (this.position.x < 0)
            this.position.x = 0;
        if (this.position.y < 0)
            this.position.y = 0;
    }
    reset() {
        this.position = { ...this.startPosition };
    }
}
//# sourceMappingURL=Camera.js.map