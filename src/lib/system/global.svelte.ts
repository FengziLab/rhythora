import type { Global, Screen } from "./types";

/* Global states */
export const global: Global = $state({
    screen: "home",
    screenAnimationReverseDirection: false,
    userSettings: {
        latency: 0,
        musicVolume: 1,
        soundEffectsVolume: 1,
        hitSoundVolume: 1
    },
    musicPlayerData: {
        song: {
            name: "???",
            author: "???",
            mapper: "???",
            audioLink: "",
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
}