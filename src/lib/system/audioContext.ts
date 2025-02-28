import { global } from "$lib/system/global.svelte";



// Context
export let audioContext: AudioContext | null = null;

// Effect nodes
export let analyserNode: AnalyserNode | null = null; // only for music
export let musicVolumeNode: GainNode | null = null; // special: comes with each audio source
export let soundEffectsVolumeNode: GainNode | null = null;
export let hitSoundVolumeNode: GainNode | null = null;

// Sources
export let musicSource: AudioBufferSourceNode | null = null;



/** Initialize audio context and effect nodes */
export function initializeAudioContext() {
    // Fail if already initialized
    if (audioContext !== null) return false;

    // Initialize audio context
    audioContext = new AudioContext({ latencyHint: "interactive" });

    // Initialize effect nodes other than music volume
    analyserNode = new AnalyserNode(audioContext, {
        fftSize: 512
    });
    soundEffectsVolumeNode = new GainNode(audioContext, {
        gain: global.userSettings.soundEffectsVolume
    });
    hitSoundVolumeNode = new GainNode(audioContext, {
        gain: global.userSettings.hitSoundVolume
    });

    // Connect effect nodes other than music volume
    analyserNode.connect(audioContext.destination);
    soundEffectsVolumeNode.connect(audioContext.destination);
    hitSoundVolumeNode.connect(audioContext.destination);

    return true;
}

/** Fade to a music volume over a set time */
export function setMusicVolume(value: number, seconds = 0.2) {
    if (audioContext === null || musicVolumeNode === null) return false;
    musicVolumeNode.gain.linearRampToValueAtTime(value, audioContext.currentTime + seconds);
    return true;
} 
/** Fade to a sound effects volume over a set time */
export function setSoundEffectsVolume(value: number, seconds = 0.2) {
    if (audioContext === null || soundEffectsVolumeNode === null) return false;
    soundEffectsVolumeNode.gain.linearRampToValueAtTime(value, audioContext.currentTime + seconds);
    return true;
} 
/** Fade to a hit sound volume over a set time */
export function setHitSoundVolume(value: number, seconds = 0.2) {
    if (audioContext === null || hitSoundVolumeNode === null) return false;
    hitSoundVolumeNode.gain.linearRampToValueAtTime(value, audioContext.currentTime + seconds);
    return true;
}

/** Create new music volume node and music source node from an audio buffer, start playing if requested, fade in music volume from 0 to set volume if seconds >= 0 */
export async function loadMusicSource(audioBuffer: AudioBuffer, play = false, seconds = -1) {
    if (audioContext === null || analyserNode === null) return false;

    // Fail if there currently exists a music volume node or music source node
    if (musicVolumeNode !== null || musicSource !== null) return false;    

    // Create nodes and connect to audio graph
    musicVolumeNode = new GainNode(audioContext, {
        gain: seconds >= 0 ? 0 : global.userSettings.musicVolume // set volume at 0 if time is set, or set straight to setting value
    });
    musicSource = new AudioBufferSourceNode(audioContext, {
        buffer: audioBuffer
    });
    musicSource.connect(musicVolumeNode).connect(analyserNode);

    // Start playing if requested
    if (play === true) {
        musicSource.start();
    }

    // Fade in music volume if time is set
    if (seconds >= 0) {
        musicVolumeNode.gain.linearRampToValueAtTime(global.userSettings.musicVolume, audioContext.currentTime + seconds);
    }
}

/** Invalidate current music volume node and music source node, fade out music volume to 0 if seconds >= 0, then disconnect both of them */
export async function unloadMusicSource(seconds = -1) {
    if (audioContext === null || musicVolumeNode === null || musicSource === null) return false;

    // Dereference nodes
    const outMusicVolumeNode = musicVolumeNode;
    musicVolumeNode = null;
    const outMusicSource = musicSource;
    musicSource = null;

    if (seconds >= 0) {
        // Fade out music volume first if time is set, then unload
        outMusicVolumeNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + seconds);
        // outMusicSource.stop(audioContext.currentTime + seconds); // NOTE: unwantedly fires ended event
        setTimeout(() => {
            outMusicSource.disconnect();
            outMusicVolumeNode.disconnect();
        }, seconds * 1000);
    } else {
        // Unload right away
        // outMusicSource.stop(); // NOTE: unwantedly fires ended event
        outMusicSource.disconnect();
        outMusicVolumeNode.disconnect();
    }

    return true;
}