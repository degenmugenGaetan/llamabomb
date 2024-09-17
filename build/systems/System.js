export class System {
    entries = [];
    collisionMap;
    constructor(collisionMap) {
        this.collisionMap = collisionMap;
    }
    remove(entry) {
        const index = this.entries.indexOf(entry);
        if (index < 0)
            return;
        this.entries.splice(index, 1);
    }
    update(time, context, camera) {
        for (const entry of this.entries) {
            entry.update(time, context, camera);
        }
    }
    draw(context, camera) {
        for (const entry of this.entries) {
            entry.draw(context, camera);
        }
    }
}
//# sourceMappingURL=System.js.map