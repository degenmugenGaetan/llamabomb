import { GAME_OFFSET_Y, TILE_SIZE } from '../constants/game.js';
import { CollisionTile, levelData, playerStartCoords } from '../constants/levelData.js';
import { subscribeEvent } from '../engine/eventHandler.js';
import { GameEventType } from '../constants/events.js';
import { isZero } from '../utils/utils.js';
export class LevelMap {
    position;
    image = document.querySelector('img#tiles');
    animationFrame;
    animationTimer;
    tilesGrid = {
        columns: this.image.width / TILE_SIZE,
        rows: this.image.height / TILE_SIZE,
    };
    id = 0;
    mapData = [];
    colData = [];
    constructor(id) {
        this.id = id;
        this.createLevelMap();
        subscribeEvent(GameEventType.BLOCK_CHANGE, this.constructor.name, this.handleBlockChangeEvent);
        subscribeEvent(GameEventType.COLLISION_CHANGE, this.constructor.name, this.handleCollisionChangeEvent);
    }
    addBlockTile(row, column) {
        const isStartZone = playerStartCoords.some(([startColumn, startRow]) => startColumn === column && startRow === row);
        if (isStartZone)
            return;
        this.colData[row][column] = CollisionTile.BLOCK;
        this.mapData[row][column] = 4;
        if (this.mapData[row + 1][column] === 1)
            this.mapData[row + 1][column] = 2;
    }
    getCollisionTile(tile) {
        if (tile < 3)
            return CollisionTile.EMPTY;
        if (tile === 4)
            return CollisionTile.BLOCK;
        return CollisionTile.WALL;
    }
    getTilePosition(tile) {
        return {
            x: (tile % this.tilesGrid.columns) * TILE_SIZE,
            y: Math.floor(tile / this.tilesGrid.columns) * TILE_SIZE,
        };
    }
    createLevelMap() {
        for (let rowIndex = 0; rowIndex < levelData[this.id].tileMap.length; rowIndex++) {
            this.mapData.push([]);
            this.colData.push([]);
            for (let columnIndex = 0; columnIndex < levelData[this.id].tileMap[rowIndex].length; columnIndex++) {
                const tile = levelData[this.id].tileMap[rowIndex][columnIndex];
                this.mapData[rowIndex][columnIndex] = tile;
                this.colData[rowIndex][columnIndex] = this.getCollisionTile(tile);
                if (this.colData[rowIndex][columnIndex] === CollisionTile.EMPTY && this.colData[rowIndex - 1][columnIndex] === CollisionTile.WALL) {
                    this.mapData[rowIndex][columnIndex] = 2;
                }
            }
        }
        // Add blocks
        for (let i = 0; i < levelData[0].blocks; i++) {
            let row = 0, column = 0;
            while (this.colData[row][column] !== CollisionTile.EMPTY) {
                row = 1 + Math.floor(Math.random() * 11);
                column = 2 + Math.floor(Math.random() * 13);
            }
            this.addBlockTile(row, column);
        }
    }
    resetLevelDataAt(tile) {
        if (this.colData[tile.row][tile.column] !== CollisionTile.BLOCK)
            return;
        this.colData[tile.row][tile.column] = CollisionTile.EMPTY;
        this.mapData[tile.row][tile.column] = this.mapData[tile.row - 1][tile.column] > 2 ? 2 : 1;
        if (this.mapData[tile.row + 1][tile.column] === 2)
            this.mapData[tile.row + 1][tile.column] = 1;
    }
    update = () => undefined;
    drawLevelMap(context, camera) {
        for (let rowIndex = 0; rowIndex < levelData[0].tileMap.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < levelData[0].tileMap[rowIndex].length; columnIndex++) {
                const tileImagePosition = this.getTilePosition(this.mapData[rowIndex][columnIndex]);
                if (isZero(tileImagePosition))
                    continue;
                context.drawImage(this.image, tileImagePosition.x, tileImagePosition.y, TILE_SIZE, TILE_SIZE, (columnIndex * TILE_SIZE) - camera.position.x, (rowIndex * TILE_SIZE) - camera.position.y + GAME_OFFSET_Y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    draw(context, camera) {
        this.drawLevelMap(context, camera);
    }
    handleCollisionChangeEvent = (payload) => {
        for (const tile of payload.tiles) {
            this.colData[tile.position.row][tile.position.column] = tile.type;
        }
    };
    handleBlockChangeEvent = (tiles) => {
        for (const tile of tiles) {
            this.resetLevelDataAt(tile);
        }
    };
}
//# sourceMappingURL=LevelMap.js.map