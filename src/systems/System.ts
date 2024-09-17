import { CollisionTile } from '../constants/levelData.js';
import { Camera } from '../engine/Camera.js';
import { Drawable, GameTime, IEntity, Updateable, ValueOf } from '../engine/types.js';

export abstract class System<TEntry extends IEntity> implements Updateable, Drawable {
	entries: TEntry[] = [];
	collisionMap: ValueOf<typeof CollisionTile>[][];

	constructor(collisionMap: ValueOf<typeof CollisionTile>[][]) {
		this.collisionMap = collisionMap;
	}

	remove(entry: TEntry) {
		const index = this.entries.indexOf(entry);

		if (index < 0) return;
		this.entries.splice(index, 1);
	}

	update(time: GameTime, context?: CanvasRenderingContext2D, camera?: Camera) {
		for (const entry of this.entries) {
			entry.update(time, context, camera);
		}
	}

	draw(context: CanvasRenderingContext2D, camera?: Camera) {
		for (const entry of this.entries) {
			entry.draw(context, camera);
		}
	}
}
