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

    // Fade out current music
    unloadMusicSource(fadeOutSeconds);

    // Load and decode audio
    global.waitingCount++;
    const response = await fetch(link);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer); // NOTE: guaranteed audioContext so make ts happy
    global.waitingCount--;

    // Ensure not overriding those started later but loaded faster
    if (localLoadTime === latestLoadTime) {
        // If we are the latest then check and ensure we unload current music again in case one is playing
        unloadMusicSource(fadeOutSeconds);

        // Play the new one
        loadMusicSource(audioBuffer, play, fadeInSeconds);
    } else { // DEBUG
        if (musicSource !== null) {
            console.info("[DEBUG] Music Load ID check: prevented!");
        } else {
            console.info("[DEBUG] Music Load ID check: actually prevented disaster!");
        }
    }
}

// Temporary BGM list
const BACKGROUND_MUSIC_LIST: MusicData[] = [
    {
        name: "triangles",
        author: "cYsmix",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/triangles.mp3"
    },
    // {
    //     name: "circles!",
    //     author: "nekodex",
    //     audioLink: "https://rhythora.us-lax-1.linodeobjects.com/circles!.mp3"
    // },
    {
        name: "aureole",
        author: "nekodex",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/aureole.mp3"
    },
    {
        name: "circle the halls",
        author: "nekodex",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/circle the halls.mp3"
    },
    {
        name: "最後的灰燼",
        author: "Ds_Squid",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/最後的灰燼.mp3"
    },
    {
        name: "終結？",
        author: "Ds_Squid",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/終結？.mp3"
    },
    // {
    //     name: "chariot_v4",
    //     author: "SY91419",
    //     audioLink: "https://rhythora.us-lax-1.linodeobjects.com/chariot_v4.mp3"
    // },
    {
        name: "athazagoraphobia",
        author: "igaveuponmusic",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/athazagoraphobia.mp3"
    },
    {
        name: "moonbath (remix)",
        author: "igaveuponmusic",
        audioLink: "https://rhythora.us-lax-1.linodeobjects.com/moonbath (remix).mp3"
    }
];

/** Switch to random new background music */
export async function playRandomBackgroundMusic(fadeSeconds = -1) {
    // Get random background music from default list
    const music = BACKGROUND_MUSIC_LIST[Math.floor(Math.random() * BACKGROUND_MUSIC_LIST.length)];

    // Update song data
    global.musicPlayerData.song = music;
    global.musicPlayerData.isPlaying = true;

    // Play new music
    await loadNewMusicFromLink(music.audioLink, true, fadeSeconds, fadeSeconds);
}