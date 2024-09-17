import { GameTime, Tile } from '../engine/types.js';
import { CollisionMapTile } from '../constants/levelData.js';
import { OrangeOneEnemy } from '../entities/enemies/OrangeOneEnemy.js';

export type TilePayload = {
	tile: Tile,
	time: GameTime,
};

export type BombPlacementPayload = TilePayload & {
	strength: number,
	ownerId: number,
};

export type LevelMapChangePayload = {
	tiles: CollisionMapTile[],
	time?: GameTime,
};

export type EnemiesPayload = {
	time: GameTime,
	enemies: {
		Class: typeof OrangeOneEnemy,
		position: Tile,
	}[],
};

export const GameEventType = {
	ADD_PLAYER: 'add-player',
	BOMB_PLACEMENT: 'bomb-placement',
	BOMB_EXPLODED: 'bomb-exploded',

	ADD_ENEMIES: 'add-enemies',
	REMOVE_ENEMIES: 'remove-enemies',

	REMOVE_PICKUP: 'remove-pickup',

	COLLISION_CHANGE: 'collision-change',
	BLOCK_CHANGE: 'levelblock-change',

	BLOCK_DESTROYED: 'block-destroyed',
	BLOCK_REMOVED: 'block-removed',

	REQUEST_STATE_UPDATE: 'request-state-update',
	REQUEST_BOMB_EXPLODE: 'request-bomb-explode',
	REQUEST_EXIT_OPEN: 'request-exit-open',
} as const;
