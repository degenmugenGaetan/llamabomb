import { AnimationFrame, FrameDataMap, ValueOf } from '../engine/types.js';
import { Direction } from './entities.js';

export const WALK_SPEED = 40;

export const BombermanColor = {
	WHITE: 'white',
	BLACK: 'black',
	RED: 'red',
	BLUE: 'blue',
	GREEN: 'green',
} as const;

export const BombermanStateType = {
	IDLE: 'idle',
	MOVING: 'moving',
	DEATH: 'die',
	EXIT_STAGE: 'exit-stage',
} as const;

export const frames: FrameDataMap = new Map([
	['idle-down', [[4, 5, 17, 20], [8, 15]]],
	['move-down-1', [[30, 5, 17, 21], [7, 15]]],
	['move-down-2', [[61, 5, 17, 21], [9, 15]]],
	['idle-side', [[80, 5, 17, 20], [6, 15]]],
	['move-side-1', [[104, 5, 17, 21], [8, 15]]],
	['move-side-2', [[129, 5, 18, 20], [8, 15]]],
	['idle-up', [[154, 4, 17, 20], [8, 15]]],
	['move-up-1', [[180, 4, 17, 21], [7, 15]]],
	['move-up-2', [[211, 4, 17, 21], [9, 15]]],
	['idle-down-left', [[5, 55, 17, 20], [6, 15]]],
	['idle-up-left', [[30, 55, 17, 20], [6, 15]]],

	['death-1', [[10, 30, 21, 20], [10, 15]]],
	['death-2', [[44, 30, 19, 19], [9, 15]]],
	['death-3', [[75, 30, 22, 20], [11, 15]]],
	['death-4', [[108, 30, 22, 21], [11, 15]]],
	['death-5', [[142, 31, 20, 20], [10, 15]]],
	['death-6', [[175, 32, 20, 19], [10, 15]]],
	['death-7', [[207, 33, 21, 19], [11, 15]]],
	['death-8', [[240, 32, 22, 21], [11, 15]]],
	['death-9', [[273, 32, 22, 21], [11, 15]]],

	['exit-stars-1', [[6, 519, 25, 15], [12, 8]]],
	['exit-stars-2', [[40, 518, 29, 12], [14, 8]]],
	['exit-stars-3', [[74, 518, 28, 15], [14, 8]]],
	['exit-stars-4', [[104, 518, 28, 16], [14, 8]]],
]);

export const animations: {
	moveAnimations: Record<ValueOf<typeof Direction>, AnimationFrame[]>,
	deathAnimation: AnimationFrame[],
	exitAnimation: AnimationFrame[],
} = {
	moveAnimations: {
		[Direction.LEFT]: [
			['idle-side', 8], ['move-side-1', 8], ['idle-side', 8], ['move-side-2', 8],
		],
		[Direction.RIGHT]: [
			['idle-side', 8], ['move-side-1', 8], ['idle-side', 8], ['move-side-2', 8],
		],
		[Direction.UP]: [
			['idle-up', 8], ['move-up-1', 8], ['idle-up', 8], ['move-up-2', 8],
		],
		[Direction.DOWN]: [
			['idle-down', 8], ['move-down-1', 8], ['idle-down', 8], ['move-down-2', 8],
		],
	},
	deathAnimation: [
		['death-1', 8], ['death-2', 8], ['death-1', 8], ['death-2', 8], ['death-1', 8], ['death-2', 8], ['death-3', 8],
		['death-4', 8], ['death-5', 8], ['death-6', 8], ['death-7', 8], ['death-8', 8], ['death-9', 8], ['death-9', -1],
	],
	exitAnimation: [
		['idle-up-left', 2, [-1, 1]], ['idle-side', 2], ['idle-down-left', 2, [-1, 1]], ['idle-down', 2],
		['idle-down-left', 2], ['idle-side', 2, [-1, 1]], ['idle-up-left', 2], ['idle-up', 2],
	],
};

export const starAnimation: AnimationFrame[] =
	[['exit-stars-1', 4], ['exit-stars-2', 4], ['exit-stars-3', 4], ['exit-stars-4', 4]];
