import { EnemyType } from './enemies.js';
import { PickUpType } from './pickups.js';
export const playerStartCoords = [[2, 1], [2, 2], [3, 1]];
/**
 * Collision tile ranges
 *
 *  0 -  9 - Floor tiles (walkable tiles)
 * 10 - 14 - Hurtable tiles (walkable tiles but will hurt players)
 * 15 - 20 - Hurtable tiles (walkable tiles but will hurt everyone)
 * 20 - 29 - Walled tiles (unable to walk through and unbreakable)
 * 30 - 39 - Walled tiles (unable to walk through but are breakable)
 */
export const CollisionTile = {
    EMPTY: 0,
    EXIT: 1,
    PICKUP_FLAME: 2,
    PICKUP_BOMB: 3,
    // ...
    PICKUP_SPECIAL: 9,
    ENEMY: 10,
    FLAME: 15,
    WALL: 20,
    BOMB: 21,
    BLOCK: 30,
};
// TODO: Possible generate tileMaps from code?
export const levelData = [
    {
        tileMap: [
            [6, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8, 9],
            [6, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 9],
            [6, 15, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 16, 9],
            [6, 20, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 21, 9],
            [6, 10, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 11, 9],
            [6, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 9],
            [6, 10, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 11, 9],
            [6, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 9],
            [6, 10, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 11, 9],
            [6, 15, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 16, 9],
            [6, 20, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 21, 9],
            [6, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 9],
            [12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14],
            [17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19],
        ],
        noBlocks: 32,
        enemies: {
            [EnemyType.ORANGE_ONE]: 0, // Set to 0 as we're now handling this in EnemySystem
        },
        pickups: {
            [PickUpType.FLAME]: 4,
            [PickUpType.BOMB]: 4,
        },
    }, {
        tileMap: [
            [5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5],
            [5, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 5],
            [5, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 5],
            [5, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 5],
            [5, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 5],
            [5, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 5],
            [5, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 5],
            [5, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 5],
            [5, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 5],
            [5, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 5],
            [5, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 5],
            [5, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 5],
            [5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5],
        ],
        noBlocks: 45 - 50,
        enemies: {
            [EnemyType.ORANGE_ONE]: 2,
        },
        pickups: {},
    },
];
export const PickUpLookUp = {
    [PickUpType.EXIT]: {
        collisionTile: CollisionTile.EXIT,
        baseFrame: 0,
    },
    [PickUpType.FLAME]: {
        collisionTile: CollisionTile.PICKUP_FLAME,
        baseFrame: 2,
    },
    [PickUpType.BOMB]: {
        collisionTile: CollisionTile.PICKUP_BOMB,
        baseFrame: 4,
    },
    [PickUpType.SPEED]: {
        collisionTile: CollisionTile.EMPTY,
        baseFrame: 6,
    },
    [PickUpType.REMOTE]: {
        collisionTile: CollisionTile.EMPTY,
        baseFrame: 8,
    },
    [PickUpType.UNKNOWN]: {
        collisionTile: CollisionTile.EMPTY,
        baseFrame: 10,
    },
    [PickUpType.EXTRA]: {
        collisionTile: CollisionTile.EMPTY,
        baseFrame: 12,
    },
    [PickUpType.PASSTHROUGH]: {
        collisionTile: CollisionTile.EMPTY,
        baseFrame: 14,
    },
    [PickUpType.INVINCIBILITY]: {
        collisionTile: CollisionTile.EMPTY,
        baseFrame: 16,
    },
    [PickUpType.FREEZE]: {
        collisionTile: CollisionTile.EMPTY,
        baseFrame: 18,
    },
};
export const CollisionToPickupLookUp = {
    [CollisionTile.EXIT]: PickUpType.EXIT,
    [CollisionTile.PICKUP_FLAME]: PickUpType.FLAME,
    [CollisionTile.PICKUP_BOMB]: PickUpType.BOMB,
};
//# sourceMappingURL=levelData.js.map