import { Camera } from './Camera.js';
import { createContext } from './context.js';
import { pollGamepads, registerGamepadEvents, registerKeyEvents } from './inputHandler.js';
export class Game {
    scene;
    camera = new Camera(0, 0);
    context;
    frameTime = {
        previous: 0,
        secondsPassed: 0,
    };
    constructor(width, height, selector) {
        this.context = createContext(width, height, selector);
        this.camera.setDimentions(width, height);
    }
    frame = (time) => {
        window.requestAnimationFrame(this.frame);
        this.frameTime.secondsPassed = (time - this.frameTime.previous) / 1000;
        this.frameTime.previous = time;
        pollGamepads();
        this.scene.update(this.frameTime, this.context, this.camera);
        this.scene.draw(this.context, this.camera);
    };
    start() {
        registerKeyEvents();
        registerGamepadEvents();
        window.requestAnimationFrame(this.frame);
    }
}
//# sourceMappingURL=Game.js.map