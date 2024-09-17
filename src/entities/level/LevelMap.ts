import {
	CollisionTile, CollisionMapTile, levelData, playerStartCoords, PickUpLookUp,
} from '../../constants/levelData.js';
import { GameEventType, LevelMapChangePayload } from '../../constants/events.js';
import { FRAME_TIME, TILE_SIZE } from '../../constants/game.js';
import { Drawable, GameTime, Tile, Updateable, ValueOf } from '../../engine/types.js';
import { subscribeEvent } from '../../engine/eventHandler.js';
import { Camera } from '../../engine/Camera.js';
import { Entity } from '../../engine/Entity.js';
import { drawTile } from '../../engine/context.js';

export class LevelMap extends Entity implements Drawable, Updateable {
	id = 0;
	tileImageDimensions: { rows: number, columns: number };

	mapData: number[][] = [];
	colData: ValueOf<typeof CollisionTile>[][] = [];
	bonusTiles: CollisionMapTile[] = [];
	levelImage: OffscreenCanvas;

	bonusTileFlashEnabled = false;
	bonusTileFlashFrame = 0;
	bonusTileFlashTimer: DOMHighResTimeStamp;

	constructor(tileImageSelector: string, id: number) {
		super({ x: 0, y: 0 });

		this.id = id;
		this.levelImage = new OffscreenCanvas(1024, 1024);
		this.image = document.querySelector<HTMLImageElement>(tileImageSelector);

		this.tileImageDimensions = {
			columns: this.image.width / TILE_SIZE,
			rows: this.image.height / TILE_SIZE,
		};

		this.buildStage();

		subscribeEvent(GameEventType.BLOCK_CHANGE, this.constructor.name, this.handleBlockChangeEvent);
		subscribeEvent(GameEventType.COLLISION_CHANGE, this.constructor.name, this.handleCollisionChangeEvent);
		subscribeEvent(GameEventType.BLOCK_REMOVED, this.constructor.name, this.handleCollisionChangeEvent);
		subscribeEvent(GameEventType.REMOVE_PICKUP, this.constructor.name, this.handleCollisionChangeEvent);
		subscribeEvent(GameEventType.REQUEST_EXIT_OPEN, this.constructor.name, this.handleExitOpenEvent);
	}

	private getCollisionTile(tile: number) {
		if (tile < 3) return CollisionTile.EMPTY;
		if (tile === 4) return CollisionTile.BLOCK;

		return CollisionTile.WALL;
	}

	private updateLevelMapAt(row: number, column: number, tile: number) {
		if (row > 0 && tile === 1 && this.mapData[row - 1][column] > 2) {
			tile = 2;
		}

		this.mapData[row][column] = tile;
		this.colData[row][column] = this.getCollisionTile(tile);

		const context = this.levelImage.getContext('2d');

		drawTile(context, this.image, column * TILE_SIZE, row * TILE_SIZE, tile, TILE_SIZE);
	}

	private addBlockTileAt(row: number, column: number): boolean {
		const isStartZone = playerStartCoords.some(([startColumn, startRow]) => startColumn === column && startRow === row);
		if (isStartZone || this.colData[row][column] !== CollisionTile.EMPTY) return false;

		this.updateLevelMapAt(row, column, 4);
		if (this.mapData[row + 1][column] === 1) this.updateLevelMapAt(row + 1, column, 2);

		return true;
	}

	private hasBlockGotBonus(row: number, column: number): boolean {
		for (const bonusTile of this.bonusTiles) {
			if (bonusTile.position.column === column && bonusTile.position.row === row) return true;
		}

		return false;
	}

	private addBlocks(): Tile[] {
		const blocks: Tile[] = [];

		while (blocks.length < levelData[this.id].noBlocks) {
			const row = 1 + Math.floor(Math.random() * 11);
			const column = 2 + Math.floor(Math.random() * 13);

			if (this.addBlockTileAt(row, column)) blocks.push({ row, column });
		}

		return blocks;
	}

	private addBonusTile(blocks: Tile[], type: ValueOf<typeof CollisionTile>) {
		let block = Math.round(Math.random() * (blocks.length - 1));

		while (this.hasBlockGotBonus(blocks[block].row, blocks[block].column)) {
			block += 1;
			if (block >= blocks.length) block = 0;
		}

		this.bonusTiles.push({
			type,
			position: { row: blocks[block].row, column: blocks[block].column },
		});
	}

	private addPickupsToBlockTiles(blocks: Tile[]) {
		for (const [pickup, amount] of Object.entries(levelData[this.id].pickups)) {
			for (let index = 0; index < amount; index++) {
				this.addBonusTile(blocks, PickUpLookUp[pickup].collisionTile);
			}
		}
	}

	private removeBlockTileAt(row: number, column: number) {
		if (this.colData[row][column] !== CollisionTile.BLOCK) return;

		this.updateLevelMapAt(row, column, 1);
		if (this.mapData[row + 1][column] === 2) this.updateLevelMapAt(row + 1, column, 1);
	}

	private buildStageMap() {
		for (let rowIndex = 0; rowIndex < levelData[this.id].tileMap.length; rowIndex++) {
			this.mapData.push([]);
			this.colData.push([]);

			for (let columnIndex = 0; columnIndex < levelData[this.id].tileMap[rowIndex].length; columnIndex++) {
				const baseTile = levelData[this.id].tileMap[rowIndex][columnIndex];
				this.updateLevelMapAt(rowIndex, columnIndex, baseTile);
			}
		}
	}

	private buildStage() {
		this.buildStageMap();
		const blocks = this.addBlocks();
		this.addPickupsToBlockTiles(blocks);
		this.addBonusTile(blocks, CollisionTile.EXIT);
	}

	public update(time: GameTime) {
		if (!this.bonusTileFlashEnabled || time.previous < this.bonusTileFlashTimer) return;

		this.bonusTileFlashFrame = 1 - this.bonusTileFlashFrame;
		this.bonusTileFlashTimer = time.previous + 16 * FRAME_TIME;
	}

	public draw(context: CanvasRenderingContext2D, camera: Camera) {
		context.drawImage(this.levelImage, -camera.position.x, -camera.position.y);
		if (!this.bonusTileFlashEnabled) return;

		for (const bonusTile of this.bonusTiles) {
			if (this.bonusTileFlashFrame === 0) continue;

			drawTile(
				context, this.image,
				(bonusTile.position.column * TILE_SIZE) - camera.position.x,
				(bonusTile.position.row * TILE_SIZE) - camera.position.y,
				24, TILE_SIZE,
			);
		}
	}

	private handleCollisionChangeEvent = (payload: LevelMapChangePayload) => {
		for (const tile of payload.tiles) {
			this.colData[tile.position.row][tile.position.column] = tile.type;
		}
	};

	private handleBlockChangeEvent = (tiles: Tile[]) => {
		for (const tile of tiles) {
			this.removeBlockTileAt(tile.row, tile.column);
		}
	};

	private handleExitOpenEvent = () => {
		this.bonusTileFlashEnabled = true;
	};
}
