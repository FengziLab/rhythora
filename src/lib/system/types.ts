/* Game */
export type Screen = "home" | "song-select" | "game" | "editor";

export interface UserSettings {
    latency: number,
    musicVolume: number,
    soundEffectsVolume: number,
    hitSoundVolume: number
}

export interface MusicData {
    name: string,
    author: string,
    link: string,
    bpm: number,
    offset: number
}
export interface MusicPlayerData {
    song: MusicData,
    isPlaying: boolean
}

export interface Global {
    screen: Screen,
    userSettings: UserSettings,
    musicPlayerData: MusicPlayerData,
    waitingCount: number,
    screenAnimationReverseDirection: boolean
}



/* Beatmap */
export type NoteType = "tap" | "hold" | "stay";

export interface PointPosition {
    row: 1 | 2 | 3,
    xPos: number
}
export interface LongPosition {
    row: 1 | 2 | 3,
    startXPos: number,
    endXPos: number
}

export type Note = {
    type: "tap",
    time: number,
    position: PointPosition
} | {
    type: "hold",
    time: number,
    duration: number,
    position: LongPosition
} | {
    type: "stay",
    time: number,
    position: PointPosition
}