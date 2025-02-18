/* Game */
export type Screen = "home" | "song-select" | "song-confirm" | "game" | "editor";

export interface MusicData {
    name: string,
    author: string,
    link: string
}

export interface MusicPlayerData {
    song: MusicData,
    isPlaying: boolean
}

export interface UserSettings {
    latency: number,
    musicVolume: number,
    soundEffectsVolume: number,
    hitSoundVolume: number
}

export interface Global {
    screen: Screen,
    userSettings: UserSettings,
    musicPlayerData: MusicPlayerData,
    waitingCount: number,
    bottomAnimationReverseDirection: boolean
}


/* Beatmap */

export type NoteType = "tap" | "hold" | "touch";

export interface TapPosition {
    row: number,
    xPos: number
}
export interface HoldPosition {
    row: number,
    startXPos: number,
    endXPos: number
}

export type Note = {
    type: "tap",
    time: number,
    position: TapPosition
} | {
    type: "hold",
    time: number,
    duration: number,
    position: HoldPosition
} | {
    type: "touch",
    time: number,
    position: TapPosition
}