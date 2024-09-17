export class Shadow {
    entity;
    image = document.querySelector('img#bomberman');
    position;
    constructor(entity) {
        this.entity = entity;
        this.updatePosition();
    }
    updatePosition() {
        this.position = {
            x: this.entity.position.x + this.entity.shadowOffset.x,
            y: this.entity.position.y + this.entity.shadowOffset.y,
        };
    }
    update() {
        this.updatePosition();
    }
    draw(context, camera) {
        context.globalAlpha = 0.35;
        context.drawImage(this.image, 144, 64, 15, 5, Math.floor(this.position.x - camera.position.x), Math.floor(this.position.y - camera.position.y), 15, 5);
        context.globalAlpha = 1;
    }
}
//# sourceMappingURL=Shadow.js.map