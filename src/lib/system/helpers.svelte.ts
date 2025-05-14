import { resumeMusic } from "./audio-helpers";
import { global, setScreen } from "./global.svelte";
import type { Screen, ScreenTransitionMode } from "./types";

/** Use the JavaScript clock to sleep for ms */
export function impreciseSleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** Mathematically accurate modulo */
export function mod(a: number, n: number): number {
    return ((a % n) + n) % n;
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

/** Return to the return screen if set, falls back to home, optionally resuming music */
export function returnToReturnScreen(resume = true) {
    setScreen(global.returnScreen ?? "home", "fade");
    global.returnScreen = null;
    if (resume) {
        resumeMusic(1);
    }
}

/**
 * Svelte action: focus trap 
 * 
 * Used code from the Svelte tutorial, edited
 * @see https://svelte.dev/tutorial/svelte/actions
 */
export function focusTrap(node: HTMLElement) {
    const previous = document.activeElement as HTMLElement | null;

    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== "Tab") return;

        const current = document.activeElement;

        const elements = Array.from(node.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")) as HTMLElement[];
        const first = elements.at(0);
        const last = elements.at(-1)

        if (event.shiftKey && current === first && last !== undefined) {
            event.preventDefault();
            last.focus();
        }

        if (!event.shiftKey && current === last && first !== undefined) {
            event.preventDefault();
            first.focus();
        }
    }

    $effect(() => {
        node.focus();
        node.blur();
        node.addEventListener("keydown", handleKeydown);

        return () => {
            node.removeEventListener("keydown", handleKeydown);
            previous?.focus();
        };
    });
}