export class ShadowSystem {
    players;
    enemies;
    image = document.querySelector('img#bomberman');
    constructor(players, enemies) {
        this.players = players;
        this.enemies = enemies;
    }
    drawShadow(context, camera, entity) {
        context.globalAlpha = 0.35;
        context.drawImage(this.image, 144, 64, 15, 5, Math.floor(entity.position.x + entity.shadowOffset.x - camera.position.x), Math.floor(entity.position.y + entity.shadowOffset.y - camera.position.y), 15, 5);
        context.globalAlpha = 1;
    }
    draw(context, camera) {
        for (const player of this.players) {
            this.drawShadow(context, camera, player);
        }
        for (const enemy of this.enemies) {
            this.drawShadow(context, camera, enemy);
        }
    }
}
//# sourceMappingURL=ShadowSystem.js.map