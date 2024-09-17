// TODO: For possible future use
// createLevelImage(id: number): ImageBitmap {
// 	const offscreen = new OffscreenCanvas(1024, 1024);
// 	const context = offscreen.getContext('2d');
export {};
// 	for (let rowIndex = 0; rowIndex < levelData[id].tileMap.length; rowIndex++) {
// 		this.mapData.push([]);
// 		this.colData.push([]);
// 		for (let columnIndex = 0; columnIndex < levelData[id].tileMap[rowIndex].length; columnIndex++) {
// 			const tile = levelData[this.id].tileMap[rowIndex][columnIndex];
// 			const tileImagePosition = this.getTilePosition(tile);
// 			this.mapData[rowIndex][columnIndex] = tile;
// 			this.colData[rowIndex][columnIndex] = this.getCollisionTile(tile);
// 			if (this.colData[rowIndex][columnIndex] === CollisionTile.EMPTY && this.colData[rowIndex - 1][columnIndex] === CollisionTile.WALL) {
// 				this.mapData[rowIndex][columnIndex] = 2;
// 			}
// 			context.drawImage(
// 				this.image,
// 				tileImagePosition.x, tileImagePosition.y, TILE_SIZE, TILE_SIZE,
// 				columnIndex * TILE_SIZE, rowIndex * TILE_SIZE,
// 				TILE_SIZE, TILE_SIZE,
// 			);
// 		}
// 	}
// 	return offscreen.transferToImageBitmap();
// }
//# sourceMappingURL=unused.js.map