export function playSound(
	sound: HTMLAudioElement,
	{ volume = 1, loop = false }: Partial<{ volume: number, loop: boolean }> = {},
) {
	sound.volume = volume;
	sound.loop = loop;

	if (sound.currentTime > 0) sound.currentTime = 0;
	if (sound.paused) sound.play();
}

export function stopSound(sound: HTMLAudioElement) {
	sound.pause();
	sound.currentTime = 0;
}
