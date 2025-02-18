import { global } from "$lib/global.svelte";



// Context
export let audioContext: AudioContext;

// Effect nodes
export let musicVolumeNode: GainNode;
export let soundEffectsVolumeNode: GainNode;
export let hitSoundVolumeNode: GainNode;
export let analyserNode: AnalyserNode;

// Sources
export let musicSource: AudioBufferSourceNode;



/** Initialize audio context and effect nodes */
export function initializeAudioContext() {
    audioContext = new AudioContext({ latencyHint: "interactive" });

    musicVolumeNode = audioContext.createGain();
    soundEffectsVolumeNode = audioContext.createGain();
    hitSoundVolumeNode = audioContext.createGain();
    analyserNode = audioContext.createAnalyser();
}

/** Set music volume */
export function setMusicVolume(value: number){
    musicVolumeNode.gain.linearRampToValueAtTime(value, audioContext.currentTime + 0.2);
}

/** Load music link into buffer, replace music source with new source then link to audio graph */
export async function setToMusicLink(link: string) {
    global.waitingCount++;
    const response = await fetch(link);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    musicSource = new AudioBufferSourceNode(audioContext, { buffer: audioBuffer });
    musicSource.connect(musicVolumeNode).connect(audioContext.destination);
    global.waitingCount--;
    musicSource.start();
}