import type { Global, Screen } from "./types";

/* Global states */
export const global: Global = $state({
    screen: "home",
    screenAnimationReverseDirection: false,
    gameScreenStatus: "inactive",
    userSettings: {
        musicVolume: 1,
        soundEffectsVolume: 1,
        hitSoundVolume: 1,
        latency: 0,
        audoFullscreen: "off",
        fpsCounter: false
    },
    musicPlayerData: {
        song: {
            name: "???",
            author: "???",
            mapper: "???",
            audioLink: "",
            previewAudioLink: "",
            thumbnailLink: "",
            thumbnailBlurhash: "",
            length: -1,
            bpm: -1,
            offset: 0
        },
        isPlaying: false
    },
    waitingCount: 0
});

/* Global state setters */
export function setScreen(newScreen: Screen, reverseDirection = false) {
    global.screen = newScreen;
    global.screenAnimationReverseDirection = reverseDirection;
    if (newScreen !== "game") {
        global.gameScreenStatus = "inactive";
    }
}