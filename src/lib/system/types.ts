export interface SoundBuffers {
    [key: string]: AudioBuffer
}

/* ------------------------------ */

export interface Global {
    userSettings: UserSettings,
    musicPlayerData: MusicPlayerData,
    notifications: Notification[],
    waitingCount: number,
    openPanel: OpenPanel,
    screen: Screen,
    screenTransitionMode: ScreenTransitionMode,
    returnScreen: Screen | null,
    gameScreenStatus: GameScreenStatus,
    isDebugPanelShowing: boolean,
    isDebugPanelPassthroughEnabled: boolean,
    debugMessage: string,
    debugTriggerCount: number
}

export interface UserSettings {
    musicVolume: number,
    hitsoundsVolume: number,
    soundEffectsVolume: number,
    audioDisplacementMs: number,
    inputDisplacementMs: number,
    fpsCounter: boolean,
    backgroundFlashEffect: boolean,
    chosenLevel: Level
}

export interface MusicPlayerData {
    song: MusicData,
    isPlaying: boolean,
    logicalStartTime: number,
    pauseTime: number
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

export interface Notification {
    id: number,
    type: NotificationType,
    content: string,
    isRead: boolean
}

export type NotificationType = "update" | "other";

export type OpenPanel = "none" | "settings" | "notifications";

export type Screen = "home" | "song-select" | "game" | "editor" | "calibration";

export type ScreenTransitionMode = "to-left" | "fade" | "to-right";

export type Level = "ez" | "hd" | "in";

export type GameScreenStatus = "inactive" | "loading" | "before-game" | "in-game" | "ending";

export type CalibrationStep = "audio-visual" | "input";

/* ------------------------------ */

export interface Chart {
    metadata: MusicData,
    notes: Note[]
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

export type GameNote = Note & GameNoteExtension;

type GameNoteExtension = {
    isSyncNote: boolean,
    hitAt: number,
    hitAccuracyRating: HitAccuracyRating
}

export type HitAccuracyRating = "standby" | "perfect" | "early" | "late" | "miss";