import type { Global, Screen } from "./types";

/* Global states */
export const global: Global = $state({
    screen: "home",
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
            link: ""
        },
        isPlaying: false
    },
    waitingCount: 0,
    screenAnimationReverseDirection: false
});

/* Global state setters */
export function setScreen(newScreen: Screen, reverseDirection = false) {
    global.screen = newScreen;
    global.screenAnimationReverseDirection = reverseDirection;
}

export function startWaiting() {
    global.waitingCount++;
}
export function stopWaiting() {
    global.waitingCount--;
}