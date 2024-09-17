import { EnemyAnimationList, EnemyStateType } from '../../constants/enemies.js';
import { Direction, MovementLookup } from '../../constants/entities.js';
import { GameEventType } from '../../constants/events.js';
import { FRAME_TIME, TILE_SIZE } from '../../constants/game.js';
import { CollisionTile } from '../../constants/levelData.js';
import { Camera } from '../../engine/Camera.js';
import { dispatchEvent } from '../../engine/eventHandler.js';
import { GameTime, Position, ValueOf, onEntityEndHandler } from '../../engine/types.js';
import { LevelEntity } from '../LevelEntity.js';

export class Enemy extends LevelEntity<typeof EnemyStateType> {
	image = document.querySelector<HTMLImageElement>('img#enemies');

	onEnd: onEntityEndHandler<Enemy>;
	animations: EnemyAnimationList;

	constructor(
		position: Position, baseSpeedTime: number,
		collisionMap: ValueOf<typeof CollisionTile>[][], onEnd: onEntityEndHandler<Enemy>,
	) {
		super(position, baseSpeedTime, collisionMap);

		this.onEnd = onEnd;
		this.changeDirection();
	}

	protected changeState(newState: string, time?: GameTime) {
		super.changeState(newState, time);
		this.animationTimer = time.previous + this.animations[this.currentState.type][this.animationFrame][1] * FRAME_TIME;
	}

	protected changeDirection() {
		this.direction = Object.values(Direction)[Math.floor(Math.random() * 4)];
		this.velocity = {
			x: MovementLookup[this.direction].x * this.speedMultiplier,
			y: MovementLookup[this.direction].y * this.speedMultiplier,
		};
	}

	protected getMovement(): [ValueOf<typeof Direction>, Position] {
		return this.performWallCheck(this.direction);
	}

	protected checkFlameTileCollision(time: GameTime) {
		const currentTile = {
			row: Math.floor(this.position.y / TILE_SIZE),
			column: Math.floor(this.position.x / TILE_SIZE),
		};

		if (this.getCollisionTile(currentTile) !== CollisionTile.FLAME) return;

		dispatchEvent(GameEventType.REQUEST_STATE_UPDATE, { score: 100 });
		this.changeState(EnemyStateType.DEAD, time);
	}

	protected updateAnimation(time: GameTime) {
		if (time.previous < this.animationTimer) return;

		if (this.animations[this.currentState.type][this.animationFrame][1] > -1) this.animationFrame += 1;
		if (this.animationFrame >= this.animations[this.currentState.type].length) {
			this.animationFrame = 0;
		}
		this.animationTimer = time.previous + this.animations[this.currentState.type][this.animationFrame][1] * FRAME_TIME;
	}

	public update(time: GameTime) {
		super.update(time);
		this.currentState.update(time);
		this.updateAnimation(time);
	}

	public draw(context: CanvasRenderingContext2D, camera?: Camera): void {
		super.draw(context, camera);
	}
}
