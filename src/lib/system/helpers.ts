import type { Screen, ScreenTransitionMode } from "./types";

/** Use the JavaScript clock to sleep for ms */
export function impreciseSleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** Get the x position property where the screen should be transitioning to/from */
export function getScreenTransitionX(thisScreen: Screen, newScreen: Screen, transitionMode: ScreenTransitionMode, magnitude: number): number {
    if ((transitionMode === "to-left" && newScreen === thisScreen) || (transitionMode === "to-right" && newScreen !== thisScreen)) {
        return -magnitude;
    } else if ((transitionMode === "to-left" && newScreen !== thisScreen) || (transitionMode === "to-right" && newScreen === thisScreen)) {
        return magnitude;
    } else {
        return 0;
    }
}