import { Position } from '../engine/types.js';

export const isZero = (value: Position): boolean => value.x === 0 && value.y === 0;
