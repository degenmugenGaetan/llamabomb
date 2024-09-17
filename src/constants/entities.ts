export const Direction = {
	UP: 'direction-up',
	DOWN: 'direction-down',
	LEFT: 'direction-left',
	RIGHT: 'direction-right',
} as const;

export const MovementLookup = {
	[Direction.LEFT]: { x: -1, y: 0 } as const,
	[Direction.RIGHT]: { x: 1, y: 0 } as const,
	[Direction.UP]: { x: 0, y: -1 } as const,
	[Direction.DOWN]: { x: 0, y: 1 } as const,
} as const;

export const CounterDirectionsLookup = {
	[Direction.LEFT]: [Direction.DOWN, Direction.UP],
	[Direction.RIGHT]: [Direction.DOWN, Direction.UP],
	[Direction.UP]: [Direction.RIGHT, Direction.LEFT],
	[Direction.DOWN]: [Direction.RIGHT, Direction.LEFT],
};
