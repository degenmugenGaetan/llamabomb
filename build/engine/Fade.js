const DEFAULT_FADE_DELAY = 0.5;
export class Fade {
    delay = 0;
    time = 0;
    direction = 0;
    alpha = 0;
    isRunning = false;
    handleCompleted;
    color;
    constructor(color = [0, 0, 0]) {
        this.color = color;
    }
    #reset(delay, direction, onCompleted) {
        this.isRunning = true;
        this.time = 0;
        this.delay = (!delay ? DEFAULT_FADE_DELAY : delay);
        this.direction = direction;
        this.alpha = direction;
        if (typeof onCompleted === 'function') {
            this.handleCompleted = onCompleted;
        }
        else {
            this.handleCompleted = undefined;
        }
    }
    fadeIn(delay, onCompleted) {
        this.#reset(delay, 1, onCompleted);
    }
    fadeOut(delay, onCompleted) {
        this.#reset(delay, 0, onCompleted);
    }
    update(time) {
        if (!this.isRunning)
            return;
        this.time += time.secondsPassed;
        this.alpha = Math.max(0, Math.min(this.direction ? this.direction - (this.time / this.delay) : this.time / this.delay, 1));
        if (!this.hasCompleted())
            return;
        this.isRunning = false;
        if (this.handleCompleted)
            this.handleCompleted();
    }
    draw(context) {
        if (this.alpha === 0)
            return;
        const [r, g, b] = this.color;
        const { width, height } = context.canvas;
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
        context.beginPath();
        context.fillRect(0, 0, width, height);
    }
    hasCompleted() {
        return Math.max(this.alpha, 0) === 0 && this.direction === 1 ||
            Math.min(this.alpha, 1) === 1 && this.direction === 0;
    }
}
//# sourceMappingURL=Fade.js.map