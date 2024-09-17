export function getContext(width, height) {
    const canvasElement = document.querySelector('canvas');
    const context = canvasElement.getContext('2d');
    if (!context) {
        throw new Error('Unable to find canvas context');
    }
    context.canvas.width = width;
    context.canvas.height = height;
    context.imageSmoothingEnabled = false;
    return context;
}
export function drawFrame(context, image, dimensions, x, y, direction = 1) {
    const [sourceX, sourceY, sourceWidth, sourceHeight] = dimensions;
    context.scale(direction, 1);
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x * direction, y, sourceWidth, sourceHeight);
    context.setTransform(1, 0, 0, 1, 0, 0);
}
export function drawFrameOrigin(context, image, frame, x, y, direction = 1) {
    const [dimensions, [originX, originY]] = frame;
    drawFrame(context, image, dimensions, x - originX * direction, y - originY, direction);
}
const alphaFrames = new Map([
    ['alpha->', [[0, 40, 8, 8], [0, 0]]],
    ['alpha-0', [[8, 0, 8, 8], [0, 0]]],
    ['alpha-1', [[16, 0, 8, 8], [0, 0]]],
    ['alpha-2', [[24, 0, 8, 8], [0, 0]]],
    ['alpha-3', [[32, 0, 8, 8], [0, 0]]],
    ['alpha-4', [[40, 0, 8, 8], [0, 0]]],
    ['alpha-5', [[48, 0, 8, 8], [0, 0]]],
    ['alpha-6', [[56, 0, 8, 8], [0, 0]]],
    ['alpha-7', [[64, 0, 8, 8], [0, 0]]],
    ['alpha-8', [[72, 0, 8, 8], [0, 0]]],
    ['alpha-9', [[80, 0, 8, 8], [0, 0]]],
    ['alpha-:', [[88, 0, 8, 8], [0, 0]]],
    ['alpha-A', [[0, 8, 8, 8], [0, 0]]],
    ['alpha-B', [[8, 8, 8, 8], [0, 0]]],
    ['alpha-C', [[16, 8, 8, 8], [0, 0]]],
    ['alpha-D', [[24, 8, 8, 8], [0, 0]]],
    ['alpha-E', [[32, 8, 8, 8], [0, 0]]],
    ['alpha-F', [[40, 8, 8, 8], [0, 0]]],
    ['alpha-G', [[48, 8, 8, 8], [0, 0]]],
    ['alpha-H', [[56, 8, 8, 8], [0, 0]]],
    ['alpha-I', [[64, 8, 8, 8], [0, 0]]],
    ['alpha-J', [[72, 8, 8, 8], [0, 0]]],
    ['alpha-K', [[80, 8, 8, 8], [0, 0]]],
    ['alpha-L', [[88, 8, 8, 8], [0, 0]]],
    ['alpha-M', [[96, 8, 8, 8], [0, 0]]],
    ['alpha-N', [[0, 16, 8, 8], [0, 0]]],
    ['alpha-O', [[8, 16, 8, 8], [0, 0]]],
    ['alpha-P', [[16, 16, 8, 8], [0, 0]]],
    ['alpha-Q', [[24, 16, 8, 8], [0, 0]]],
    ['alpha-R', [[32, 16, 8, 8], [0, 0]]],
    ['alpha-S', [[40, 16, 8, 8], [0, 0]]],
    ['alpha-T', [[48, 16, 8, 8], [0, 0]]],
    ['alpha-U', [[56, 16, 8, 8], [0, 0]]],
    ['alpha-V', [[64, 16, 8, 8], [0, 0]]],
    ['alpha-W', [[72, 16, 8, 8], [0, 0]]],
    ['alpha-X', [[80, 16, 8, 8], [0, 0]]],
    ['alpha-Y', [[88, 16, 8, 8], [0, 0]]],
    ['alpha-Z', [[96, 16, 8, 8], [0, 0]]],
    ['alpha-©', [[0, 32, 8, 8], [0, 0]]],
    ['alpha--', [[8, 32, 8, 8], [0, 0]]],
    ['alpha-!', [[16, 32, 8, 8], [0, 0]]],
    ['alpha-/', [[24, 32, 8, 8], [0, 0]]],
]);
const fontImage = document.querySelector('img#font');
export function drawText(context, text, baseX, baseY, fontWidth = 8) {
    let x = baseX < 0 ? Math.floor((context.canvas.width / 2) - ((text.length * fontWidth) / 2)) : 0;
    for (const char of text) {
        if (char !== ' ') {
            drawFrameOrigin(context, fontImage, alphaFrames.get(`alpha-${char}`), baseX + x, baseY);
        }
        x += fontWidth;
    }
}
export function drawTile(context, image, x, y, tile, tileSize) {
    const noTilesWidth = Math.floor(image.width / tileSize);
    context.drawImage(image, (tile % noTilesWidth) * tileSize, Math.floor(tile / noTilesWidth) * tileSize, tileSize, tileSize, x, y, tileSize, tileSize);
}
//# sourceMappingURL=context.js.map