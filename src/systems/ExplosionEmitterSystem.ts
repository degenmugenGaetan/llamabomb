import { BombPlacementPayload, GameEventType } from '../constants/events.js';
import { TILE_SIZE } from '../constants/game.js';
import { FlameMapTile, CollisionTile, CollisionMapTile } from '../constants/levelData.js';
import { dispatchEvent, subscribeEvent } from '../engine/eventHandler.js';
import { GameTime, Tile, ValueOf } from '../engine/types.js';
import { ExplosionEmitter } from '../entities/ExplosionEmitter.js';
import { System } from './System.js';

const flameDirection = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const FlameEndResult = {
	BLOCK: 'block',
	BOMB: 'bomb',
	PICKUP: 'pickup',
	RANGE: 'range',
} as const;

const BOMB_EXPLODE_DELAY = 150;

export class ExplosionEmitterSystem extends System<ExplosionEmitter>{
	constructor(levelData: ValueOf<typeof CollisionTile>[][]) {
		super(levelData);
		subscribeEvent(GameEventType.BOMB_EXPLODED, this.constructor.name, this.add);
	}

	getEndResult(tile: ValueOf<typeof CollisionTile>): ValueOf<typeof FlameEndResult> {
		if (tile === CollisionTile.BLOCK) return FlameEndResult.BLOCK;
		if (tile === CollisionTile.BOMB) return FlameEndResult.BOMB;
		if (tile >= CollisionTile.PICKUP_FLAME && tile <= CollisionTile.PICKUP_SPECIAL) return FlameEndResult.PICKUP;
		return FlameEndResult.RANGE;
	}

	getFlameTiles(
		startTile: Tile, direction: number[], strength: number,
	): { tiles: FlameMapTile[], length: number, endResult: ValueOf<typeof FlameEndResult> } {
		const flameTiles: FlameMapTile[] = [];
		let length = 1;

		while (
			this.collisionMap[startTile.row + length * direction[1]][startTile.column + length * direction[0]] === CollisionTile.EMPTY
			&& length <= strength
		) {
			flameTiles.push({
				position: {
					row: startTile.row + length * direction[1],
					column: startTile.column + length * direction[0],
				},
				type: CollisionTile.FLAME,
				isVertical: direction[1] !== 0,
				isLast: length === strength,
			});

			length += 1;
		}

		length = Math.min(length, strength);

		return {
			tiles: flameTiles,
			length: length,
			endResult: this.getEndResult(this.collisionMap[startTile.row + length * direction[1]][startTile.column + length * direction[0]]),
		};
	}

	getNeighbouringFlameTiles(startTile: Tile, strength: number, time: GameTime): FlameMapTile[] {
		const allFlameTiles: FlameMapTile[] = [];

		for (const direction of flameDirection) {
			const flameTiles = this.getFlameTiles(startTile, direction, strength);

			if (flameTiles.endResult === FlameEndResult.BLOCK) {
				dispatchEvent(GameEventType.BLOCK_DESTROYED, [{
					row: startTile.row + flameTiles.length * direction[1],
					column: startTile.column + flameTiles.length * direction[0],
					time,
				}]);
			}

			if (flameTiles.endResult === FlameEndResult.BOMB) {
				// TODO: Testing purposes, needs better solution :/
				setTimeout(() => dispatchEvent(GameEventType.REQUEST_BOMB_EXPLODE, {
					tile: {
						row: startTile.row + flameTiles.length * direction[1],
						column: startTile.column + flameTiles.length * direction[0],
					},
					time,
				}), BOMB_EXPLODE_DELAY);
			}

			if (flameTiles.tiles.length !== 0) allFlameTiles.push(...flameTiles.tiles);
		}

		return allFlameTiles;
	}

	remove(explosion: ExplosionEmitter) {
		super.remove(explosion);

		const tiles = [
			{
				position: {
					row: (explosion.position.y / TILE_SIZE) * TILE_SIZE,
					column: (explosion.position.x / TILE_SIZE) * TILE_SIZE,
				},
				type: CollisionTile.EMPTY,
			},
		];

		for (const flameTile of explosion.flameTiles) {
			tiles.push({ position: flameTile.position, type: CollisionTile.EMPTY });
		}

		dispatchEvent(GameEventType.COLLISION_CHANGE, { tiles });
	}

	add = (payload: BombPlacementPayload) => {
		const neighbouringFlameTiles = this.getNeighbouringFlameTiles(payload.tile, payload.strength, payload.time);
		const flameTiles: (CollisionMapTile | FlameMapTile)[] = [
			{
				position: {
					row: payload.tile.row,
					column: payload.tile.column,
				},
				type: CollisionTile.FLAME,
			},
			...neighbouringFlameTiles,
		];

		this.entries.push(
			new ExplosionEmitter(
				{ x: payload.tile.column, y: payload.tile.row },
				neighbouringFlameTiles, payload.time, this.remove.bind(this),
			),
		);

		dispatchEvent(GameEventType.COLLISION_CHANGE, {
			tiles: flameTiles,
		});
	};
}
