import type { Global, Screen, UserSettings } from "./types";

/* Default settings */
export const DEFAULT_SETTINGS: UserSettings = {
    musicVolume: 1,
    soundEffectsVolume: 1,
    hitsoundsVolume: 1,
    latency: 0,
    fpsCounter: false,
    backgroundFlashEffect: true
};

/* Global states */
export const global: Global = $state({
    screen: "home",
    screenAnimationReverseDirection: false,
    openPanel: "none",
    gameScreenStatus: "inactive",
    userSettings: DEFAULT_SETTINGS,
    chosenLevel: "ez",
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
        isPlaying: false,
        logicalStartTime: 0,
        pauseTime: -1
    },
    waitingCount: 1,
    debugMessage: "Rhythora Debug"
});

/* Global state setters */
export function setScreen(newScreen: Screen, reverseDirection = false) {
    global.screen = newScreen;
    global.screenAnimationReverseDirection = reverseDirection;
    if (newScreen !== "game") {
        global.gameScreenStatus = "inactive";
    }
}