import {
	WALK_SPEED,
	BombermanStateType,
	frames,
	animations,
	starAnimation,
} from '../constants/bomberman.js';
import { Direction } from '../constants/entities.js';
import { TILE_SIZE, FRAME_TIME, DEBUG } from '../constants/game.js';
import { BombPlacementPayload, GameEventType, LevelMapChangePayload } from '../constants/events.js';
import { CollisionTile } from '../constants/levelData.js';
import { Control } from '../constants/control.js';
import { dispatchEvent, subscribeEvent } from '../engine/eventHandler.js';
import { playSound, stopSound } from '../engine/soundHandler.js';
import { FrameData, FrameScale, GameTime, Position, Tile, ValueOf } from '../engine/types.js';
import * as control from '../engine/inputHandler.js';
import { Camera } from '../engine/Camera.js';
import { drawFrameOrigin, drawText } from '../engine/context.js';
import { isZero } from '../utils/utils.js';
import { LevelEntity } from './LevelEntity.js';
import { Enemy } from './enemies/Enemy.js';
import { rectsOverlap } from '../utils/collisions.js';
import { EnemyStateType } from '../constants/enemies.js';

export class Bomberman extends LevelEntity<typeof BombermanStateType> {
	id: number;
	startPosition: Position;

	spawnTimer = 0;

	lastBombTile: Tile;
	enemies: Enemy[];

	animation = animations.moveAnimations[this.direction];

	private bombAmount = 1;
	private bombStrength = 1;

	private exitOpen = false;
	private exitAnimationFrame = 0;
	private exitAnimationTimer = 0;

	// TODO: should be private
	public exitYOffset = 0;

	// TODO: Move to gamestate
	lives = 2;
	score = 0;
	availableBombs = this.bombAmount;
	shadowOffset = { x: -7, y: 2 } as const;

	image = document.querySelector<HTMLImageElement>('img#bomberman');
	private soundWalk = document.querySelector<HTMLAudioElement>('audio#walk');
	private soundDeath = document.querySelector<HTMLAudioElement>('audio#death');
	private soundExplosion = document.querySelector<HTMLAudioElement>('audio#bomb-explode');

	constructor(
		id: number,
		position: Position,
		collisionMap: ValueOf<typeof CollisionTile>[][],
		enemies: Enemy[],
		time: GameTime,
	) {
		super(position, WALK_SPEED, collisionMap);

		this.id = id;
		this.startPosition = { ...this.position };
		this.enemies = enemies;

		this.states = {
			[BombermanStateType.IDLE]: {
				type: BombermanStateType.IDLE,
				init: this.handleIdleInit,
				update: this.handleIdleState,
			},
			[BombermanStateType.MOVING]: {
				type: BombermanStateType.MOVING,
				init: this.handleMovingInit,
				update: this.handleMovingState,
			},
			[BombermanStateType.DEATH]: {
				type: BombermanStateType.DEATH,
				init: this.handleDeathInit,
				update: this.handleDeathState,
			},
			[BombermanStateType.EXIT_STAGE]: {
				type: BombermanStateType.EXIT_STAGE,
				init: this.handleExitStageInit,
				update: this.handleExitStageState,
			},
		};

		subscribeEvent(GameEventType.BOMB_EXPLODED, this.constructor.name, this.handleBombExplodedEvent);
		subscribeEvent(GameEventType.REQUEST_EXIT_OPEN, this.constructor.name, this.handleExitDoorOpenEvent);

		this.changeState(BombermanStateType.IDLE, time);
	}

	private isControllable = () =>
		[String(BombermanStateType.IDLE), String(BombermanStateType.MOVING)].includes(this.currentState.type);

	protected changeState(newState: string, time?: GameTime) {
		super.changeState(newState, time);
		this.animationTimer = time.previous + (8 * FRAME_TIME); //frames.get(this.animation[this.animationFrame]);
	}

	public reset(time: GameTime) {
		this.animationFrame = 0;
		this.direction = Direction.DOWN;
		this.velocity = { x: 0, y: 0 };
		this.position = { ...this.startPosition };
		this.changeState(BombermanStateType.IDLE, time);
	}

	private resetLastBombTile(currentTile: Tile) {
		if (!this.lastBombTile) return;

		if (
			currentTile.row !== this.lastBombTile.row || currentTile.column !== this.lastBombTile.column
			|| this.collisionMap[this.lastBombTile.row][this.lastBombTile.column] !== CollisionTile.BOMB
		) {
			this.lastBombTile = undefined;
		}
	}

	protected getCollisionTile(tile: Tile): ValueOf<typeof CollisionTile> {
		if (
			this.lastBombTile && tile.row === this.lastBombTile.row &&
			tile.column === this.lastBombTile.column
		) return CollisionTile.EMPTY;

		return super.getCollisionTile(tile);
	}

	public addBombStrength(amount: number) {
		this.bombStrength += amount;
	}

	public addBombsAmount(amount: number) {
		this.bombAmount += amount;
		this.availableBombs += amount;
	}

	private checkDroppedTileCollision(tile: Tile, time: GameTime) {
		const collisionTile = this.getCollisionTile(tile);

		if (collisionTile === CollisionTile.EMPTY || !this.isControllable()) return;

		switch (collisionTile) {
			case CollisionTile.PICKUP_FLAME:
				this.addBombStrength(1);
				break;

			case CollisionTile.PICKUP_BOMB:
				this.addBombsAmount(1);
				break;

			case CollisionTile.EXIT:
				if (!this.exitOpen) return;

				this.changeState(BombermanStateType.EXIT_STAGE, time);
				return;
		}

		dispatchEvent<LevelMapChangePayload>(GameEventType.REMOVE_PICKUP, {
			tiles: [{
				position: { ...tile },
				type: CollisionTile.EMPTY,
			}],
			time,
		});
	}

	private checkFlameTileCollision(tile: Tile, time: GameTime) {
		if (
			this.getCollisionTile(tile) !== CollisionTile.FLAME
			|| this.currentState.type === BombermanStateType.DEATH
		) return;

		stopSound(this.soundExplosion);
		this.changeState(BombermanStateType.DEATH, time);
	}

	private getMovement(): [ValueOf<typeof Direction>, Position] {
		if (control.isLeft(this.id)) {
			return this.performWallCheck(Direction.LEFT);
		} else if (control.isRight(this.id)) {
			return this.performWallCheck(Direction.RIGHT);
		} else if (control.isDown(this.id)) {
			return this.performWallCheck(Direction.DOWN);
		} else if (control.isUp(this.id)) {
			return this.performWallCheck(Direction.UP);
		}

		return [this.direction, { x: 0, y: 0 }];
	}

	private handleBombPlacement(time: GameTime) {
		if (this.availableBombs <= 0) return;

		const tile = { row: Math.floor(this.position.y / TILE_SIZE), column: Math.floor(this.position.x / TILE_SIZE) };
		if (this.collisionMap[tile.row][tile.column] !== CollisionTile.EMPTY) return;

		this.lastBombTile = tile;
		this.availableBombs -= 1;

		dispatchEvent<BombPlacementPayload>(GameEventType.BOMB_PLACEMENT, {
			tile: this.lastBombTile, strength: this.bombStrength, ownerId: this.id, time,
		});
	}

	private handleBombExplodedEvent = (payload: BombPlacementPayload) => {
		if (payload.ownerId !== this.id) return;

		if (this.availableBombs < this.bombAmount) this.availableBombs += 1;
	};

	private handleExitDoorOpenEvent = () => {
		this.exitOpen = true;
	};

	private handleIdleInit = () => {
		stopSound(this.soundWalk);
		this.velocity = { x: 0, y: 0 };
	};

	private handleMovingInit = () => {
		playSound(this.soundWalk, { loop: true });
	};

	private handleDeathInit = () => {
		this.handleIdleInit();
		this.animation = animations.deathAnimation;
		playSound(this.soundDeath);
		dispatchEvent(GameEventType.REQUEST_STATE_UPDATE, { lives: -1 });
	};

	private handleExitStageInit = (time: GameTime) => {
		this.handleIdleInit();
		this.animation = animations.exitAnimation;
		this.exitAnimationTimer = time.previous + starAnimation[0][1] * FRAME_TIME;
	};

	private handleGeneralState = (time: GameTime): Position => {
		const [direction, velocity] = this.getMovement();
		if (control.isControlPressed(this.id, Control.ACTION)) this.handleBombPlacement(time);

		this.animation = animations.moveAnimations[direction];
		this.direction = direction;

		return velocity;
	};

	private handleIdleState = (time: GameTime) => {
		const velocity = this.handleGeneralState(time);
		if (isZero(velocity)) return;

		this.changeState(BombermanStateType.MOVING, time);
	};

	private handleMovingState = (time: GameTime) => {
		this.velocity = this.handleGeneralState(time);
		if (!isZero(this.velocity)) return;

		this.changeState(BombermanStateType.IDLE, time);
	};

	private handleDeathState = (time: GameTime) => {
		if (this.animationFrame >= animations.deathAnimation.length - 1) this.reset(time);
	};

	private handleExitStageState = (time: GameTime) => {
		if (time.previous < this.exitAnimationTimer) return;

		this.exitAnimationFrame += 1;
		if (this.exitAnimationFrame >= starAnimation.length) this.exitAnimationFrame = 0;
		this.exitAnimationTimer = time.previous + starAnimation[this.exitAnimationFrame][1] * FRAME_TIME;
	};

	private updateAnimation(time: GameTime) {
		if (time.previous < this.animationTimer || isZero(this.velocity) && this.isControllable()) return;

		this.animationFrame += 1;
		if (this.animationFrame >= this.animation.length) {
			this.animationFrame = 0;
			if (this.currentState.type === BombermanStateType.EXIT_STAGE) this.exitYOffset += 1;
		}
		this.animationTimer = time.previous + (this.animation[this.animationFrame][1] * FRAME_TIME);
	}

	private updateTileUnderneath(time) {
		const playerTile = {
			row: Math.floor(this.position.y / TILE_SIZE),
			column: Math.floor(this.position.x / TILE_SIZE),
		};

		this.resetLastBombTile(playerTile);
		this.checkFlameTileCollision(playerTile, time);
		this.checkDroppedTileCollision(playerTile, time);
	}

	private updateEnemyCollision(time: GameTime) {
		if (this.currentState.type === BombermanStateType.DEATH) return;

		for (const enemy of this.enemies) {
			if (
				enemy.currentState.type === EnemyStateType.DEAD
				|| !rectsOverlap(
					this.position.x - 5, this.position.y - 6, 10, 10,
					enemy.position.x - 5, enemy.position.y - 6, 10, 10,
				)
			) continue;

			this.changeState(BombermanStateType.DEATH, time);
		}
	}

	public override update(time: GameTime) {
		super.update(time);
		this.currentState.update(time);
		this.updateAnimation(time);
		this.updateTileUnderneath(time);
		this.updateEnemyCollision(time);
	}

	public override draw(context: CanvasRenderingContext2D, camera: Camera) {
		const [frameKey, , frameDirection] = this.animation[this.animationFrame];
		const frame = frames.get(frameKey);

		const getFrameDetails = (): readonly [FrameData, FrameScale] => {
			if (this.currentState.type === BombermanStateType.EXIT_STAGE) {
				const [dimensions, origin] = frame;
				return [
					[
						[dimensions[0], dimensions[1] + this.exitYOffset, dimensions[2], dimensions[3] - this.exitYOffset],
						origin,
					],
					frameDirection,
				];
			}

			return [frame, [this.direction === Direction.RIGHT ? -1 : 1, 1]];
		};

		const [modifiedFrame, scale] = getFrameDetails();

		drawFrameOrigin(
			context, this.image, modifiedFrame,
			Math.floor(this.position.x - camera.position.x),
			Math.floor(this.position.y - camera.position.y + this.exitYOffset),
			scale,
		);

		if (this.currentState.type === BombermanStateType.EXIT_STAGE) {
			const [exitFrameKey] = starAnimation[this.exitAnimationFrame];
			const exitFrame = frames.get(exitFrameKey);

			drawFrameOrigin(
				context, this.image, exitFrame,
				Math.floor(this.position.x - camera.position.x),
				Math.floor(this.position.y - 8 - camera.position.y),
			);
		}

		super.draw(context, camera);

		if (!DEBUG) return;
		drawText(context, `BOMBS:${this.availableBombs}/${this.bombAmount} STRENGTH:${this.bombStrength}`, 0, 240);
	}
}
