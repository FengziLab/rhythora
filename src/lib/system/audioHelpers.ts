import type { MusicData } from "$lib/system/types";
import { audioContext, loadMusicSource, unloadMusicSource } from "./audioContext";
import { global } from "$lib/system/global.svelte";

const BACKGROUND_MUSIC_LIST: MusicData[] = [
    {
        name: "triangles",
        author: "cYsmix",
        link: "https://rhythora.us-lax-1.linodeobjects.com/triangles.mp3"
    },
    // {
    //     name: "circles!",
    //     author: "nekodex",
    //     link: "https://rhythora.us-lax-1.linodeobjects.com/circles!.mp3"
    // },
    {
        name: "aureole",
        author: "nekodex",
        link: "https://rhythora.us-lax-1.linodeobjects.com/aureole.mp3"
    },
    {
        name: "circle the halls",
        author: "nekodex",
        link: "https://rhythora.us-lax-1.linodeobjects.com/circle the halls.mp3"
    },
    {
        name: "最後的灰燼",
        author: "Ds_Squid",
        link: "https://rhythora.us-lax-1.linodeobjects.com/最後的灰燼.mp3"
    },
    {
        name: "終結？",
        author: "Ds_Squid",
        link: "https://rhythora.us-lax-1.linodeobjects.com/終結？.mp3"
    },
    // {
    //     name: "chariot_v4",
    //     author: "SY91419",
    //     link: "https://rhythora.us-lax-1.linodeobjects.com/chariot_v4.mp3"
    // },
    {
        name: "athazagoraphobia",
        author: "igaveuponmusic",
        link: "https://rhythora.us-lax-1.linodeobjects.com/athazagoraphobia.mp3"
    },
    {
        name: "moonbath (remix)",
        author: "igaveuponmusic",
        link: "https://rhythora.us-lax-1.linodeobjects.com/moonbath (remix).mp3"
    }
];

/** Fade out current music, load audio link, then play the new one */
export async function playNewMusicFromLink(link: string) {
    if (audioContext === null) return false;

    // Fade out current music
    await unloadMusicSource(1);

    // Load and decode audio
    global.waitingCount++;
    const response = await fetch(link);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    global.waitingCount--;

    // Play the new one
    await loadMusicSource(audioBuffer, true, 1);
}

/** Switch to random new background music */
export function playRandomBackgroundMusic() {
    // Get random background music from default list
    const music = BACKGROUND_MUSIC_LIST[Math.floor(Math.random() * BACKGROUND_MUSIC_LIST.length)];

    // Play new music
    playNewMusicFromLink(music.link);

    // Update song data
    global.musicPlayerData.song = music;
    global.musicPlayerData.isPlaying = true;
}