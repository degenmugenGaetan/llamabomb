export const EnemyStateType = {
    ALIVE: 'alive',
    DEAD: 'dead',
};
export const EnemyType = {
    ORANGE_ONE: 'orange-one',
};
export const enemyFrames = new Map([
    ['orange-one-1', [[5, 4, 14, 16], [7, 11]]],
    ['orange-one-2', [[22, 4, 14, 15], [7, 11]]],
    ['orange-one-3', [[38, 4, 16, 14], [8, 11]]],
    ['orange-death-1', [[55, 4, 16, 16], [8, 11]]],
    ['orange-death-2', [[72, 4, 16, 16], [8, 11]]],
    ['death-cross-1', [[14, 412, 14, 16], [7, 11]]],
    ['death-cross-2', [[32, 413, 12, 14], [6, 10]]],
    ['death-cross-3', [[50, 414, 10, 11], [5, 9]]],
    ['death-cross-4', [[68, 414, 8, 11], [4, 9]]],
    ['death-cross-5', [[86, 416, 6, 7], [3, 8]]],
]);
export const orangeOneAnimations = {
    [EnemyStateType.ALIVE]: [['orange-one-1', 12], ['orange-one-2', 12], ['orange-one-3', 12], ['orange-one-2', 12]],
    [EnemyStateType.DEAD]: [
        ['orange-death-1', 80], ['orange-death-2', 11], ['death-cross-1', 11], ['death-cross-2', 11],
        ['death-cross-3', 11], ['death-cross-4', 11], ['death-cross-5', 11], ['death-cross-5', -1],
    ],
};
export const explodeFrames = new Map([
    ['explode-1', [[66, 510, 22, 12], [7, 3]]],
    ['explode-2', [[97, 506, 26, 16], [7, 3]]],
    ['explode-3', [[133, 497, 20, 25], [8, 3]]],
    ['explode-4', [[163, 495, 26, 27], [8, 3]]],
    ['explode-5', [[197, 497, 23, 25], [8, 3]]],
    ['explode-6', [[231, 499, 20, 23], [8, 3]]],
    ['explode-7', [[260, 513, 14, 9], [8, 3]]],
]);
//# sourceMappingURL=enemies.js.map