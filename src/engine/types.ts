import { Control, GamepadThumbstick } from '../constants/control.js';
import { GameScene } from '../constants/game.js';
import { Camera } from '../engine/Camera.js';

export type ValueOf<T> = T[keyof T];

export type ControlConfig = {
	gamePad: Partial<(Record<ValueOf<typeof Control>, number> | Record<ValueOf<typeof GamepadThumbstick>, number>)>;
	keyboard: Partial<Record<ValueOf<typeof Control>, string>>;
}

export type GameTime = {
	previous: number,
	secondsPassed: number,
};

export type Position = {
	x: number,
	y: number,
};

export type Size = {
	width: number,
	height: number,
};

export type Rect = Position & Size;

export type Tile = {
	row: number,
	column: number,
};

export type FrameDimensions = [number, number, number, number];
export type FrameOrigin = [number, number];
export type FrameScale = [number, number];
export type FrameData = [FrameDimensions, FrameOrigin];
export type FrameDataMap = Map<string, FrameData>;

export type AnimationFrame = readonly [string, number, FrameScale?];

export interface Updateable {
	update(time: GameTime, context?: CanvasRenderingContext2D, camera?: Camera): void;
}

export interface Drawable {
	draw(context: CanvasRenderingContext2D, camera?: Camera): void;
}

export interface Scene extends Updateable, Drawable {
	onEnd: onSceneEndHandler;
	cleanUp(): void;
}

export type onSceneEndHandler = (newScene: ValueOf<typeof GameScene>, difficulty?: string) => void;

export type onEntityEndHandler<T> = (entity: T) => void;

export interface IEntity extends Updateable, Drawable {
	position: Position;
}

export type StateMachineEntry<T> = {
	type: ValueOf<T>,
	init?: (time?: GameTime) => void,
	update: (time?: GameTime) => void,
}

export type StateMachine<T> = Record<string, StateMachineEntry<T>>;
