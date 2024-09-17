import { CounterDirectionsLookup, Direction, MovementLookup } from '../constants/entities.js';
import { DEBUG, HALF_TILE_SIZE, TILE_SIZE } from '../constants/game.js';
import { CollisionTile } from '../constants/levelData.js';
import { Camera } from '../engine/Camera.js';
import { Entity } from '../engine/Entity.js';
import { AnimationFrame, GameTime, IEntity, Position, StateMachine, StateMachineEntry, Tile, ValueOf } from '../engine/types.js';
import { drawBox, drawCross } from '../utils/debug.js';

export abstract class LevelEntity<T> extends Entity implements IEntity {
	velocity: Position;

	direction: ValueOf<typeof Direction>;
	collisionMap: ValueOf<typeof CollisionTile>[][];
	animation: AnimationFrame[];

	baseSpeedTime: number;
	speedMultiplier: number;
	shadowOffset: Position;

	currentState: StateMachineEntry<T>;
	states: StateMachine<T>;

	constructor(position: Position, baseSpeedTime: number, collisionMap: ValueOf<typeof CollisionTile>[][]) {
		super({ x: (position.x * TILE_SIZE) + HALF_TILE_SIZE, y: (position.y * TILE_SIZE) + HALF_TILE_SIZE });

		this.velocity = { x: 0, y: 0 };
		this.animationFrame = 0;
		this.direction = Direction.DOWN;
		this.baseSpeedTime = baseSpeedTime;
		this.collisionMap = collisionMap;
		this.speedMultiplier = 1;
	}

	protected resetVelocities = () => {
		this.velocity.x = 0;
		this.velocity.y = 0;
	};

	protected changeState(newState: string, time?: GameTime) {
		this.currentState = this.states[newState];
		this.currentState.init(time);

		this.animationFrame = 0;
	}

	protected getCollisionTile(tile: Tile): ValueOf<typeof CollisionTile> {
		return this.collisionMap[tile.row][tile.column];
	}

	protected getCollisionCoords(direction: ValueOf<typeof Direction>): Tile[] {
		switch (direction) {
			case Direction.UP:
				return [
					{ row: Math.floor((this.position.y - 9) / TILE_SIZE), column: Math.floor((this.position.x - 8) / TILE_SIZE) },
					{ row: Math.floor((this.position.y - 9) / TILE_SIZE), column: Math.floor((this.position.x + 7) / TILE_SIZE) },
				];
			case Direction.LEFT:
				return [
					{ row: Math.floor((this.position.y - 8) / TILE_SIZE), column: Math.floor((this.position.x - 9) / TILE_SIZE) },
					{ row: Math.floor((this.position.y + 7) / TILE_SIZE), column: Math.floor((this.position.x - 9) / TILE_SIZE) },
				];
			case Direction.RIGHT:
				return [
					{ row: Math.floor((this.position.y - 8) / TILE_SIZE), column: Math.floor((this.position.x + 8) / TILE_SIZE) },
					{ row: Math.floor((this.position.y + 7) / TILE_SIZE), column: Math.floor((this.position.x + 8) / TILE_SIZE) },
				];
			default:
			case Direction.DOWN:
				return [
					{ row: Math.floor((this.position.y + 8) / TILE_SIZE), column: Math.floor((this.position.x - 8) / TILE_SIZE) },
					{ row: Math.floor((this.position.y + 8) / TILE_SIZE), column: Math.floor((this.position.x + 7) / TILE_SIZE) },
				];
		}
	}

	protected shouldBlockMovement(tileCoords: Tile[]): boolean {
		const tileCoordsMatch = tileCoords[0].row === tileCoords[1].row && tileCoords[0].column === tileCoords[1].column;
		const tiles = [this.getCollisionTile(tileCoords[0]), this.getCollisionTile(tileCoords[1])];

		if (
			(tileCoordsMatch && tiles[0] >= CollisionTile.WALL)
			|| (tiles[0] >= CollisionTile.WALL && tiles[1] >= CollisionTile.WALL)
		) return true;

		return false;
	}

	protected performWallCheck(direction: ValueOf<typeof Direction>): [ValueOf<typeof Direction>, Position] {
		const collisionCoords = this.getCollisionCoords(direction);

		if (this.shouldBlockMovement(collisionCoords)) return [direction, { x: 0, y: 0 }];

		const counterDirections = CounterDirectionsLookup[direction];
		if (this.getCollisionTile(collisionCoords[0]) >= CollisionTile.WALL) {
			return [counterDirections[0], { ...MovementLookup[counterDirections[0]] }];
		}
		if (this.getCollisionTile(collisionCoords[1]) >= CollisionTile.WALL) {
			return [counterDirections[1], { ...MovementLookup[counterDirections[1]] }];
		}

		return [direction, { ...MovementLookup[direction] }];
	}

	updatePosition(time: GameTime) {
		this.position.x += (this.velocity.x * this.baseSpeedTime * this.speedMultiplier) * time.secondsPassed;
		this.position.y += (this.velocity.y * this.baseSpeedTime * this.speedMultiplier) * time.secondsPassed;

		if (this.position.x < 0) this.position.x = 0;
		if (this.position.y < 0) this.position.y = 0;
		if (this.position.x > (this.collisionMap[0].length - 1) * TILE_SIZE) {
			this.position.x > (this.collisionMap[0].length - 1) * TILE_SIZE;
		}
		if (this.position.y > (this.collisionMap.length - 1) * TILE_SIZE) {
			this.position.y > (this.collisionMap.length - 1) * TILE_SIZE;
		}
	}

	update(time: GameTime) {
		this.updatePosition(time);
	}

	draw(context: CanvasRenderingContext2D, camera?: Camera) {
		if (!DEBUG) return;

		drawBox(context, camera, [
			this.position.x - HALF_TILE_SIZE, this.position.y - HALF_TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1,
		], '#FFFF00');
		drawBox(context, camera, [
			this.position.x - 5, this.position.y - 6, 10, 10,
		], '#FF0000');
		drawCross(context, camera, { x: this.position.x, y: this.position.y }, '#FFF');
	}
}
