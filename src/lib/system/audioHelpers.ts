import { global } from "$lib/global.svelte";
import type { MusicData } from "$lib/types";
import { setToMusicLink } from "./audioContext";

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
    // {
    //     name: "aureole",
    //     author: "nekodex",
    //     link: "https://rhythora.us-lax-1.linodeobjects.com/aureole.mp3"
    // },
    // {
    //     name: "circle the halls",
    //     author: "nekodex",
    //     link: "https://rhythora.us-lax-1.linodeobjects.com/circle the halls.mp3"
    // },
    {
        name: "最後的灰燼",
        author: "Ds_Squid",
        link: "https://rhythora.us-lax-1.linodeobjects.com/最後的灰燼.mp3"
    },
    // {
    //     name: "終結？",
    //     author: "Ds_Squid",
    //     link: "https://rhythora.us-lax-1.linodeobjects.com/終結？.mp3"
    // },
    // {
    //     name: "chariot_v4",
    //     author: "SY91419",
    //     link: "https://rhythora.us-lax-1.linodeobjects.com/chariot_v4.mp3"
    // },
    // {
    //     name: "athazagoraphobia",
    //     author: "igaveuponmusic",
    //     link: "https://rhythora.us-lax-1.linodeobjects.com/athazagoraphobia.mp3"
    // },
    // {
    //     name: "moonbath (remix)",
    //     author: "igaveuponmusic",
    //     link: "https://rhythora.us-lax-1.linodeobjects.com/moonbath (remix).mp3"
    // }
];

export function playRandomBackgroundMusic() {
    const music = BACKGROUND_MUSIC_LIST[Math.floor(Math.random() * BACKGROUND_MUSIC_LIST.length)];
    setToMusicLink(music.link);
    global.musicPlayerData.song = music;
    global.musicPlayerData.isPlaying = true;
}