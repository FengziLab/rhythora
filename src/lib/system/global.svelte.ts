import { fadeToMusicVolume, fadeToSoundEffectsVolume, fadeToHitsoundsVolume, latencyDelayNode, analyserDelayNode } from "./audio-system";
import type { Global, UserSettings, Screen, ScreenTransitionMode } from "./types";

/* Default settings */
export const DEFAULT_SETTINGS: UserSettings = {
    musicVolume: 1,
    soundEffectsVolume: 1,
    hitsoundsVolume: 0.5,
    audioDisplacementMs: 0,
    inputDisplacementMs: 0,
    fpsCounter: false,
    backgroundFlashEffect: true,
    chosenLevel: "ez"
};

/* Global states */
export const global: Global = $state({
    userSettings: DEFAULT_SETTINGS,
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
    notifications: [],
    waitingCount: 1,
    openPanel: "none",
    screen: "home",
    screenTransitionMode: "fade",
    returnScreen: null,
    gameScreenStatus: "inactive",
    isDebugPanelPassthroughEnabled: false,
    debugMessage: "Rhythora Debug",
    debugTriggerCount: 0
});

/* Global state setters */
/** Update a user setting and run necessary real-time side effects, including saving the settings to local storage (optional) */
export function setUserSetting<UserSetting extends keyof UserSettings>(setting: UserSetting, newValue: UserSettings[UserSetting], save = true) {
    // Save the new value
    global.userSettings[setting] = newValue;

    // Process specific side effects
    switch (setting) {
        case "musicVolume":
            fadeToMusicVolume(newValue as number, -1); // NOTE: validated value type so make ts happy
            break;
        case "soundEffectsVolume":
            fadeToSoundEffectsVolume(newValue as number, -1); // NOTE: validated value type so make ts happy
            break;
        case "hitsoundsVolume":
            fadeToHitsoundsVolume(newValue as number, -1); // NOTE: validated value type so make ts happy
            break;
        case "audioDisplacementMs":
            if (latencyDelayNode === null || analyserDelayNode === null) break;
            latencyDelayNode.delayTime.value = Math.max(0, -(newValue as number) / 1000); // NOTE: validated value type so make ts happy
            analyserDelayNode.delayTime.value = Math.max(0, (newValue as number) / 1000); // NOTE: validated value type so make ts happy
            break;
    }

    // Save to local storage
    if (save === true) {
        localStorage.setItem("userSettings", JSON.stringify(global.userSettings));
    }
}

/** Load valid stored user settings from user storage with fallback of current settings */
export function loadUserSettings() {
    // Read stored settings
    const storedUserSettingsRaw = localStorage.getItem("userSettings");
    if (storedUserSettingsRaw !== null) {
        const storedUserSettings = JSON.parse(storedUserSettingsRaw);
        const validStoredUserSettings: Partial<UserSettings> = {};

        // Check for invalid setting items
        for (const key in storedUserSettings) {
            if (key in DEFAULT_SETTINGS) {
                validStoredUserSettings[key as keyof UserSettings] = storedUserSettings[key]; // NOTE: validated key type so make ts happy
            } else { // NOTE: future migrations can be added here
                console.info(`Ignored loading unused setting: ${key}`);
            }
        }

        // Apply settings with fallback of current settings (default on load)
        global.userSettings = {
            ...global.userSettings,
            ...validStoredUserSettings
        };
    }
}

/** Switch to new screen using specified transition mode (with checks to set game screen status to inactive) */
export function setScreen(newScreen: Screen, transitionMode: ScreenTransitionMode) {
    // Set new screen
    global.screenTransitionMode = transitionMode;
    global.screen = newScreen;

    // Check if game screen status should be inactive
    if (newScreen !== "game") {
        global.gameScreenStatus = "inactive";
    }
}