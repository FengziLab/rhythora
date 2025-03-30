import { audioContext, musicSource, initializeAudioContext, loadMusicSource, unloadMusicSource } from "./audio-system";
import { global } from "$lib/system/global.svelte";
import type { MusicData } from "$lib/system/types";

let latestLoadTime = -1;

/** Fade out current music, load audio link, then play the new one */
export async function loadNewMusicFromLink(link: string, play = false, fadeOutSeconds = -1, fadeInSeconds = -1) {
    // Check and initialize the audio context in case it's not initialized
    initializeAudioContext();
    if (audioContext!.state === "suspended") await audioContext!.resume(); // NOTE: guaranteed audioContext so make ts happy

    // ID the load to later check if we're the latest
    const localLoadTime = audioContext!.currentTime // NOTE: guaranteed audioContext so make ts happy
    latestLoadTime = localLoadTime;

    // Fade out current music and update global music player data
    if (unloadMusicSource(fadeOutSeconds) === true) {
        global.musicPlayerData.logicalStartTime = 0;
        global.musicPlayerData.pauseTime = -1;
        global.musicPlayerData.isPlaying = false;
    }

    // Load and decode audio
    global.waitingCount++;
    const response = await fetch(link);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer); // NOTE: guaranteed audioContext so make ts happy
    global.waitingCount--;

    // Ensure not overriding those started later but loaded faster
    if (localLoadTime === latestLoadTime) {
        // If we are the latest then check and ensure we unload current music again in case one is playing
        if (unloadMusicSource(fadeOutSeconds)) {
            global.musicPlayerData.logicalStartTime = 0;
            global.musicPlayerData.pauseTime = -1;
            global.musicPlayerData.isPlaying = false;
        }

        // Load the new one, play and update global music player data if requested
        loadMusicSource(audioBuffer, play, fadeInSeconds);
        if (play === true) {
            global.musicPlayerData.logicalStartTime = audioContext!.currentTime; // NOTE: could be slightly less accurate, use manual control for more accuracy
            global.musicPlayerData.pauseTime = -1;
            global.musicPlayerData.isPlaying = true;
        }
    }
}

// Temporary BGM list
export const BACKGROUND_MUSIC_LIST: MusicData[] = [
    {
        name: "triangles",
        author: "cYsmix",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/triangles.mp3",
        length: 126,
        bpm: 80,
        offset: 0
    },
    {
        name: "circles!",
        author: "nekodex",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/circles!.mp3",
        length: 139,
        bpm: 93,
        offset: 0
    },
    {
        name: "aureole",
        author: "nekodex",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/aureole.mp3",
        length: 164,
        bpm: 140,
        offset: 0
    },
    {
        name: "circle the halls",
        author: "nekodex",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/circle the halls.mp3",
        length: 111,
        bpm: 86,
        offset: 0
    },
    {
        name: "最後的灰燼",
        author: "Ds_Squid",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/最後的灰燼.mp3",
        length: 114,
        bpm: 150,
        offset: 0
    },
    {
        name: "終結？",
        author: "Ds_Squid",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/終結？.mp3",
        length: 152,
        bpm: 83,
        offset: 0
    },
    {
        name: "劫炎",
        author: "Ds_Squid",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/劫炎.mp3",
        length: 94,
        bpm: 99,
        offset: 0
    },
    {
        name: "即刻，現在！",
        author: "Ds_Squid",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/即刻，現在！.mp3",
        length: 163,
        bpm: 108,
        offset: 0
    },
    {
        name: "chariot_v4",
        author: "SY91419",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/chariot_v4.mp3",
        length: 195,
        bpm: 80,
        offset: 0
    },
    {
        name: "athazagoraphobia",
        author: "igaveuponmusic",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/athazagoraphobia.mp3",
        length: 187,
        bpm: 123,
        offset: 0
    },
    {
        name: "moonbath (remix)",
        author: "igaveuponmusic",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/moonbath (remix).mp3",
        length: 96,
        bpm: 90,
        offset: 0
    },
    {
        name: "Inverted World",
        author: "ARForest",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/Inverted World.mp3",
        length: 131,
        bpm: 90,
        offset: 0
    },
    {
        name: "The Last Page",
        author: "ARForest",
        mapper: "fengziya",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/The Last Page.mp3",
        length: 143,
        bpm: 65,
        offset: 0
    }
];

/** Switch to random new background music */
export async function playRandomBackgroundMusic(fadeSeconds = -1) {
    // Get random background music from default list
    const music = BACKGROUND_MUSIC_LIST[Math.floor(Math.random() * BACKGROUND_MUSIC_LIST.length)];

    // Update song data
    global.musicPlayerData.song = music;

    // Play new music
    await loadNewMusicFromLink(music.audioLink, true, fadeSeconds, fadeSeconds);
}

/** Pause the music */
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

/** Resume the music */
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