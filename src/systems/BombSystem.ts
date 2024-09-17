import { BombPlacementPayload, GameEventType, LevelMapChangePayload, TilePayload } from '../constants/events.js';
import { CollisionTile } from '../constants/levelData.js';
import { dispatchEvent, subscribeEvent } from '../engine/eventHandler.js';
import { playSound } from '../engine/soundHandler.js';
import { GameTime, ValueOf } from '../engine/types.js';
import { Bomb } from '../entities/Bomb.js';
import { System } from './System.js';

export class BombSystem extends System<Bomb> {
	soundBombPlace = document.querySelector<HTMLAudioElement>('audio#bomb-place');
	soundBombExplode = document.querySelector<HTMLAudioElement>('audio#bomb-explode');

	constructor(levelData: ValueOf<typeof CollisionTile>[][]) {
		super(levelData);
		subscribeEvent(GameEventType.BOMB_PLACEMENT, this.constructor.name, this.handleBombPlacementEvent);
		subscribeEvent(GameEventType.REQUEST_BOMB_EXPLODE, this.constructor.name, this.handleBombExplodeEvent);
	}

	removeBomb(bomb: Bomb, time?: GameTime) {
		dispatchEvent<BombPlacementPayload>(
			GameEventType.BOMB_EXPLODED,
			{
				tile: { column: bomb.position.x, row: bomb.position.y },
				strength: bomb.strength, ownerId: bomb.ownerId, time,
			},
		);

		super.remove(bomb);
		playSound(this.soundBombExplode);
	}

	handleBombPlacementEvent = (payload: BombPlacementPayload) => {
		this.entries.push(
			new Bomb(
				{ x: payload.tile.column, y: payload.tile.row },
				payload.strength, payload.ownerId, payload.time, this.removeBomb.bind(this),
			),
		);
		dispatchEvent<LevelMapChangePayload>(
			GameEventType.COLLISION_CHANGE,
			{ tiles: [{ position: payload.tile, type: CollisionTile.BOMB }] },
		);
		playSound(this.soundBombPlace);
	};

	handleBombExplodeEvent = (payload: TilePayload) => {
		for (const bomb of this.entries) {
			if (payload.tile.column === bomb.position.x && payload.tile.row === bomb.position.y) {
				this.removeBomb(bomb, payload.time);
			}
		}
	};
}
