const events = new Map();
export function dispatchEvent(type, payload) {
    const entries = events.get(type) ?? [];
    if (entries.length === 0)
        return;
    for (const entry of entries) {
        entry.callback(payload);
    }
}
export function subscribeEvent(type, sender, callback) {
    const entry = events.get(type) ?? [];
    entry.push({ subscriber: sender, callback });
    events.set(type, entry);
}
export function unSubscribeEvent(type, sender) {
    const entries = events.get(type) ?? [];
    if (entries.length === 0)
        return;
    events.set(type, entries.filter((entry) => entry.subscriber !== sender));
}
export function clearEvents() {
    events.clear();
}
//# sourceMappingURL=eventHandler.js.map