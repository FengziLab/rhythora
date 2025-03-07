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
    mapper: string,
    audioLink: string,
    previewAudioLink?: string,
    thumbnailLink?: string,
    thumbnailBlurhash?: string,
    length: number,
    bpm: number,
    offset: number
}
export interface MusicPlayerData {
    song: MusicData,
    isPlaying: boolean
}

export interface Global {
    screen: Screen,
    screenAnimationReverseDirection: boolean,
    userSettings: UserSettings,
    musicPlayerData: MusicPlayerData,
    waitingCount: number
}



/* Chart */
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

export interface Chart {
    metadata: MusicData,
    notes: Note[]
}