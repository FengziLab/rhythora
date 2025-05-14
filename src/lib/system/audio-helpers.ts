import { audioContext, hitsoundsVolumeNode, soundEffectsVolumeNode, soundBuffers, musicSource, initializeAudioSystem, loadMusicSource, unloadMusicSource } from "./audio-system";
import { global } from "$lib/system/global.svelte";
import type { MusicData } from "$lib/system/types";

let latestLoadTime = -1;

/** Fade out current music, load audio link, then play the new one (fails if unable to load or swap to new music) */
export async function loadNewMusic(musicData: MusicData, play = false, fadeOutSeconds = -1, fadeInSeconds = -1): Promise<boolean> {
    // Check and initialize the audio context in case it's not initialized
    initializeAudioSystem();
    if (audioContext!.state === "suspended") await audioContext!.resume(); // NOTE: guaranteed audioContext so make ts happy

    // ID the load to later check if we're the latest
    const localLoadTime = audioContext!.currentTime; // NOTE: guaranteed audioContext so make ts happy
    latestLoadTime = localLoadTime;

    // Fade out current music and update global music player data
    if (unloadMusicSource(fadeOutSeconds) === true) {
        global.musicPlayerData.logicalStartTime = 0;
        global.musicPlayerData.pauseTime = -1;
        global.musicPlayerData.isPlaying = false;
    }

    // Load and decode audio
    let audioBuffer = null;
    global.waitingCount++;
    try {
        const response = await fetch(musicData.audioLink);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext!.decodeAudioData(arrayBuffer); // NOTE: guaranteed audioContext so make ts happy
    } catch (error) {
        global.waitingCount--;
        return false;
    }
    global.waitingCount--;

    // Ensure not overriding those started later but loaded faster
    if (localLoadTime === latestLoadTime) {
        // If we are the latest then check and ensure we unload current music again in case one is now playing
        if (unloadMusicSource(fadeOutSeconds) === true) {
            global.musicPlayerData.logicalStartTime = 0;
            global.musicPlayerData.pauseTime = -1;
            global.musicPlayerData.isPlaying = false;
        }

        // Load the new one
        if (loadMusicSource(audioBuffer, play, fadeInSeconds) === false) return false;
        global.musicPlayerData.song = musicData;

        // Play and update global music player data if requested
        if (play === true) {
            global.musicPlayerData.logicalStartTime = audioContext!.currentTime; // NOTE: guaranteed audioContext so make ts happy // NOTE: could be slightly less accurate, use manual control for more accuracy
            global.musicPlayerData.pauseTime = -1;
            global.musicPlayerData.isPlaying = true;
        }

        // Loaded and happy
        return true;
    }

    // We are invalidated by another load request
    return false;
}

// Temporary BGM list
export const BACKGROUND_MUSIC_LIST: MusicData[] = [
    {
        name: "triangles",
        author: "cYsmix",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/triangles.mp3",
        length: 126,
        bpm: 160,
        offset: 3.06
    },
    {
        name: "circles!",
        author: "nekodex",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/circles!.mp3",
        length: 139,
        bpm: 184,
        offset: 2.63
    },
    {
        name: "aureole",
        author: "nekodex",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/aureole.mp3",
        length: 164,
        bpm: 70,
        offset: 1.74
    },
    {
        name: "circle the halls",
        author: "nekodex",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/circle the halls.mp3",
        length: 111,
        bpm: 172,
        offset: 5.95
    },
    {
        name: "最後的灰燼",
        author: "Ds_Squid",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/最後的灰燼.mp3",
        length: 114,
        bpm: 150,
        offset: 0.27
    },
    {
        name: "終結？",
        author: "Ds_Squid",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/終結？.mp3",
        length: 152,
        bpm: 83,
        offset: 0.19
    },
    {
        name: "劫炎",
        author: "Ds_Squid",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/劫炎.mp3",
        length: 94,
        bpm: 99,
        offset: 0.19
    },
    {
        name: "即刻，現在！",
        author: "Ds_Squid",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/即刻，現在！.mp3",
        length: 163,
        bpm: 108,
        offset: 0.45
    },
    {
        name: "Artificial Chariot (SY91419 Arr.)",
        author: "SY91419",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/Artificial Chariot (SY91419 Arr.).mp3",
        length: 196,
        bpm: 80,
        offset: 0.02
    },
    {
        name: "athazagoraphobia",
        author: "igaveuponmusic",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/athazagoraphobia.mp3",
        length: 187,
        bpm: 123,
        offset: 17.26
    },
    {
        name: "moonbath (remix)",
        author: "igaveuponmusic",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/moonbath (remix).mp3",
        length: 96,
        bpm: 90,
        offset: 2.70
    },
    {
        name: "Inverted World",
        author: "ARForest",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/Inverted World.mp3",
        length: 131,
        bpm: 180,
        offset: 0.04
    },
    {
        name: "The Last Page",
        author: "ARForest",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/The Last Page.mp3",
        length: 143,
        bpm: 130, // TODO: what to do with triple time songs? original bpm 195
        offset: 7.43
    }
];

/** Switch to random new background music (fails if unable to play) */
export async function playRandomBackgroundMusic(fadeSeconds = -1): Promise<boolean> {
    const music = BACKGROUND_MUSIC_LIST[Math.floor(Math.random() * BACKGROUND_MUSIC_LIST.length)];
    return await loadNewMusic(music, true, fadeSeconds, fadeSeconds);
}

/** Pause the music and take care of global music player data (fails if unable to pause) */
export function pauseMusic(fadeOutSeconds = -1): boolean {
    if (audioContext === null) return false;
    const currentTime = audioContext.currentTime;
    if (unloadMusicSource(fadeOutSeconds) === true) {
        global.musicPlayerData.pauseTime = currentTime - global.musicPlayerData.logicalStartTime;
        global.musicPlayerData.isPlaying = false;
        return true;
    }
    return false;
}

/** Resume the music and take care of global music player data (fails if unable to resume) */
export function resumeMusic(fadeInSeconds = -1): boolean {
    if (loadMusicSource(null, false, fadeInSeconds) === true) {
        musicSource!.start(0, global.musicPlayerData.pauseTime); // NOTE: guaranteed musicSource so make ts happy
        global.musicPlayerData.logicalStartTime = audioContext!.currentTime - global.musicPlayerData.pauseTime; // NOTE: guaranteed audioContext so make ts happy
        global.musicPlayerData.pauseTime = -1;
        global.musicPlayerData.isPlaying = true;
        return true;
    }
    return false;
}

// Hitsounds and sound effects list
export const SOUND_LIST = {
    stableNormalHitnormal: "/assets/samples/stable-normal-hitnormal.wav"
};

/** Load a sound if it's not already loaded in sound buffers (succeeds if loaded or already exists, fails if unable to load) */
export async function loadSoundFromSoundList(key: keyof typeof SOUND_LIST): Promise<boolean> {
    if (audioContext === null) return false;

    if (soundBuffers[key]) return true;

    global.waitingCount++;
    try {
        const response = await fetch(SOUND_LIST[key]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        soundBuffers[key] = audioBuffer;
    } catch (error) {
        global.waitingCount--;
        return false;
    }
    global.waitingCount--;
    return true;
}

/** Play a loaded hitsound */
export function playHitsound(key: keyof typeof SOUND_LIST) {
    const hitsoundSource = new AudioBufferSourceNode(audioContext!, { // NOTE: assumed audioContext so make ts happy
        buffer: soundBuffers[key]
    });
    hitsoundSource.connect(hitsoundsVolumeNode!); // NOTE: assumed hitsoundsVolumeNode so make ts happy
    hitsoundSource.start();
    // NOTE: AudioBufferSourceNodes are automatically disconnected and cleaned up after play
}

/** Play a loaded sound effect */
export function playSoundEffect(key: keyof typeof SOUND_LIST) {
    const soundEffectSource = new AudioBufferSourceNode(audioContext!, { // NOTE: assumed audioContext so make ts happy
        buffer: soundBuffers[key]
    });
    soundEffectSource.connect(soundEffectsVolumeNode!); // NOTE: assumed soundEffectsVolumeNode so make ts happy
    soundEffectSource.start();
    // NOTE: AudioBufferSourceNodes are automatically disconnected and cleaned up after play
}