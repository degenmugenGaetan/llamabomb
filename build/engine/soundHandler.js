export function playSound(sound, { volume = 1, loop = false } = {}) {
    sound.volume = volume;
    sound.loop = loop;
    if (sound.currentTime > 0)
        sound.currentTime = 0;
    if (sound.paused)
        sound.play();
}
export function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}
//# sourceMappingURL=soundHandler.js.map