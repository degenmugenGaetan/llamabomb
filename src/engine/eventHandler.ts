import { GameEventType } from '../constants/events.js';
import { ValueOf } from './types.js';

type GameEvent = ValueOf<typeof GameEventType>;
type GameEventHandler<P> = (payload: P) => void;
type GameEventEntry<P> = { subscriber: string, callback: GameEventHandler<P> };

const events = new Map<GameEvent, GameEventEntry<unknown>[]>();

export function dispatchEvent<P>(type: GameEvent, payload?: P) {
	const entries = events.get(type) ?? [] satisfies GameEventEntry<unknown>[];
	if (entries.length === 0) return;

	for (const entry of entries) {
		entry.callback(payload);
	}
}

export function subscribeEvent<T>(type: GameEvent, sender: string, callback: GameEventHandler<T>) {
	const entry = events.get(type) ?? [] satisfies GameEventEntry<unknown>[];

	entry.push({ subscriber: sender, callback });
	events.set(type, entry);
}

export function unSubscribeEvent(type: GameEvent, sender: string) {
	const entries = events.get(type) ?? [] satisfies GameEventEntry<unknown>[];
	if (entries.length === 0) return;

	events.set(type, entries.filter((entry) => entry.subscriber !== sender));
}

export function clearEvents() {
	events.clear();
}
