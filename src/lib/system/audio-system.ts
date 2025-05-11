import { global } from "$lib/system/global.svelte";
import type { SoundBuffers } from "./types";



// Context
export let audioContext: AudioContext | null = null;

// Effect nodes
export let latencyDelayNode: DelayNode | null = null;
export let musicVolumeNode: GainNode | null = null; // special: comes with each music source
export let hitsoundsVolumeNode: GainNode | null = null;
export let soundEffectsVolumeNode: GainNode | null = null;
export let analyserNode: AnalyserNode | null = null;
export let analyserDelayNode: DelayNode | null = null;

// Sources & Buffers
export let musicBuffer: AudioBuffer | null = null;
export const soundBuffers: SoundBuffers = {}; // for both hitsounds and sound effects
export let musicSource: AudioBufferSourceNode | null = null;



/** Try to initialize audio context and effect nodes (fails if already initialized) */
export function initializeAudioContext(): boolean {
    // Fail if already initialized
    if (audioContext !== null) return false;

    // Initialize audio context
    audioContext = new AudioContext({ latencyHint: "interactive" });

    // Initialize effect nodes other than music volume node
    latencyDelayNode = new DelayNode(audioContext, {
        delayTime: Math.max(0, -global.userSettings.audioDisplacementMs / 1000)
    });
    hitsoundsVolumeNode = new GainNode(audioContext, {
        gain: global.userSettings.hitsoundsVolume
    });
    soundEffectsVolumeNode = new GainNode(audioContext, {
        gain: global. userSettings.soundEffectsVolume
    });
    analyserNode = new AnalyserNode(audioContext, {
        fftSize: 256
    });
    analyserDelayNode = new DelayNode(audioContext, {
        delayTime: Math.max(0, global.userSettings.audioDisplacementMs / 1000)
    });

    // Connect effect nodes other than music volume
    latencyDelayNode.connect(audioContext.destination);
    hitsoundsVolumeNode.connect(latencyDelayNode);
    soundEffectsVolumeNode.connect(audioContext.destination);
    analyserDelayNode.connect(analyserNode);

    return true;
}

/** Fade to a music volume over a set time (fails if missing components) */
export function fadeToMusicVolume(value: number, seconds = -1): boolean {
    if (audioContext === null || musicVolumeNode === null) return false;
    musicVolumeNode.gain.linearRampToValueAtTime(value, audioContext.currentTime + Math.max(0, seconds));
    return true;
}
/** Fade to a hitsounds volume over a set time (fails if missing components) */
export function fadeToHitsoundsVolume(value: number, seconds = -1): boolean {
    if (audioContext === null || hitsoundsVolumeNode === null) return false;
    hitsoundsVolumeNode.gain.linearRampToValueAtTime(value, audioContext.currentTime + Math.max(0, seconds));
    return true;
}
/** Fade to a sound effects volume over a set time (fails if missing components) */
export function fadeToSoundEffectsVolume(value: number, seconds = -1): boolean {
    if (audioContext === null || soundEffectsVolumeNode === null) return false;
    soundEffectsVolumeNode.gain.linearRampToValueAtTime(value, audioContext.currentTime + Math.max(0, seconds));
    return true;
}

/** Create new music volume node and music source node from the current music buffer or a new audio buffer if specified, start playing if requested, and fade in music volume from 0 to set volume if seconds >= 0 (fails if there currently exists music, no provided buffer and no buffer to resume, or missing dependent components) */
export function loadMusicSource(audioBuffer: AudioBuffer | null = null, play = false, fadeInSeconds = -1): boolean {
    if (audioContext === null || latencyDelayNode === null || analyserDelayNode == null) return false;

    // Fail if there exists a current music volume node or music source node
    if (musicVolumeNode !== null || musicSource !== null) return false;    

    // Create nodes and connect to audio graph
    if (audioBuffer !== null) {
        musicBuffer = audioBuffer;
    } else if (musicBuffer === null) {
        return false;
    }
    musicVolumeNode = new GainNode(audioContext, {
        gain: fadeInSeconds >= 0 ? 0 : global.userSettings.musicVolume // set volume at 0 if time is set, or set straight to setting value
    });
    musicSource = new AudioBufferSourceNode(audioContext, {
        buffer: musicBuffer
    });
    musicSource.connect(musicVolumeNode).connect(latencyDelayNode);
    musicSource.connect(analyserDelayNode);

    // Start playing if requested
    if (play === true) {
        musicSource.start();
    }

    // Fade in music volume if time is set
    if (fadeInSeconds >= 0) {
        musicVolumeNode.gain.linearRampToValueAtTime(global.userSettings.musicVolume, audioContext.currentTime + fadeInSeconds);
    }

    return true;
}

/** Invalidate current music volume node and music source node, fade out music volume to 0 if seconds >= 0, then disconnect both of them (fails if there's no music or missing dependent components) */
export function unloadMusicSource(fadeOutSeconds = -1): boolean {
    if (audioContext === null || musicVolumeNode === null || musicSource === null) return false;

    // Dereference nodes
    const outMusicVolumeNode = musicVolumeNode;
    musicVolumeNode = null;
    const outMusicSource = musicSource;
    musicSource = null;

    if (fadeOutSeconds >= 0) {
        // Fade out music volume first if time is set, then unload
        outMusicVolumeNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeOutSeconds);
        outMusicSource.stop(audioContext.currentTime + fadeOutSeconds); // NOTE: unwantedly fires ended event
        setTimeout(() => {
            outMusicSource.disconnect();
            outMusicVolumeNode.disconnect();
        }, fadeOutSeconds * 1000);
    } else {
        // Unload right away
        outMusicSource.stop(); // NOTE: unwantedly fires ended event
        outMusicSource.disconnect();
        outMusicVolumeNode.disconnect();
    }

    return true;
}