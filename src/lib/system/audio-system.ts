import { global } from "$lib/system/global.svelte";



// Context
export let audioContext: AudioContext | null = null;

// Effect nodes
export let analyserNode: AnalyserNode | null = null; // only for music
export let musicVolumeNode: GainNode | null = null; // special: comes with each audio source
export let soundEffectsVolumeNode: GainNode | null = null;
export let hitsoundsVolumeNode: GainNode | null = null;

// Sources
export let musicSource: AudioBufferSourceNode | null = null;



/** Try to initialize audio context and effect nodes, does nothing if already initialized */
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
    hitsoundsVolumeNode = new GainNode(audioContext, {
        gain: global.userSettings.hitsoundsVolume
    });

    // Connect effect nodes other than music volume
    analyserNode.connect(audioContext.destination);
    soundEffectsVolumeNode.connect(audioContext.destination);
    hitsoundsVolumeNode.connect(audioContext.destination);

    return true;
}

/** Fade to a music volume over a set time */
export function fadeToMusicVolume(value: number, seconds = 0.2) {
    if (audioContext === null || musicVolumeNode === null) return false;
    musicVolumeNode.gain.linearRampToValueAtTime(value, audioContext.currentTime + Math.max(0, seconds));
    return true;
} 
/** Fade to a sound effects volume over a set time */
export function fadeToSoundEffectsVolume(value: number, seconds = 0.2) {
    if (audioContext === null || soundEffectsVolumeNode === null) return false;
    soundEffectsVolumeNode.gain.linearRampToValueAtTime(value, audioContext.currentTime + Math.max(0, seconds));
    return true;
} 
/** Fade to a hit sound volume over a set time */
export function fadeToHitsoundsVolume(value: number, seconds = 0.2) {
    if (audioContext === null || hitsoundsVolumeNode === null) return false;
    hitsoundsVolumeNode.gain.linearRampToValueAtTime(value, audioContext.currentTime + Math.max(0, seconds));
    return true;
}

/** Create new music volume node and music source node from an audio buffer, start playing if requested, fade in music volume from 0 to set volume if seconds >= 0 */
export function loadMusicSource(audioBuffer: AudioBuffer, play = false, fadeInSeconds = -1) {
    if (audioContext === null || analyserNode === null) return false;

    // Fail if there currently exists a music volume node or music source node
    if (musicVolumeNode !== null || musicSource !== null) return false;    

    // Create nodes and connect to audio graph
    musicVolumeNode = new GainNode(audioContext, {
        gain: fadeInSeconds >= 0 ? 0 : global.userSettings.musicVolume // set volume at 0 if time is set, or set straight to setting value
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
    if (fadeInSeconds >= 0) {
        musicVolumeNode.gain.linearRampToValueAtTime(global.userSettings.musicVolume, audioContext.currentTime + fadeInSeconds);
    }
}

/** Invalidate current music volume node and music source node, fade out music volume to 0 if seconds >= 0, then disconnect both of them */
export function unloadMusicSource(fadeOutSeconds = -1) {
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