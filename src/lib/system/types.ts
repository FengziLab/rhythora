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
    isPlaying: boolean,
    logicalStartTime: number,
    pauseTime: number
}

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

export type HitAccuracyRating = "standby" | "perfect" | "early" | "late" | "miss";

type GameNoteExtension = {
    isSyncNote: boolean,
    hitAt: number,
    hitAccuracyRating: HitAccuracyRating
}

export type GameNote = Note & GameNoteExtension;

export interface Chart {
    metadata: MusicData,
    notes: Note[]
}



export type Screen = "home" | "song-select" | "game" | "editor";

export type OpenPanel = "none" | "settings" | "notifications";

export type GameScreenStatus = "inactive" | "loading" | "before-game" | "in-game" | "ending";

export interface UserSettings {
    musicVolume: number,
    soundEffectsVolume: number,
    hitsoundsVolume: number,
    latency: number,
    fpsCounter: boolean,
    backgroundFlashEffect: boolean
}

export type Level = "ez" | "hd" | "in";

export interface Global {
    screen: Screen,
    screenAnimationReverseDirection: boolean,
    openPanel: OpenPanel,
    gameScreenStatus: GameScreenStatus,
    userSettings: UserSettings,
    chosenLevel: Level,
    musicPlayerData: MusicPlayerData,
    waitingCount: number,
    debugMessage: string
}