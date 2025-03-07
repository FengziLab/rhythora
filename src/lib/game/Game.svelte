<script lang="ts">
    import { audioContext, musicSource } from "$lib/system/audioContext";
    import { onMount, onDestroy } from "svelte";
    import type { Note } from "$lib/system/types";
    import { global } from "$lib/system/global.svelte";

    // Canvas and local states
    let canvasElement: HTMLCanvasElement;
    let canvasCtx: CanvasRenderingContext2D;
    let canvasWidth = $state(300);
    let canvasHeight = $state(150);
    let dpr = $state(1);
    let noteDimensionUnit = $derived(Math.floor(Math.min(canvasWidth / 10, canvasHeight / 6)));
    let noteRadius = $derived(noteDimensionUnit / 2);
    let canvasXOffset = $derived((canvasWidth - (noteDimensionUnit * 10)) / 2);
    let canvasYOffset = $derived((canvasHeight - (noteDimensionUnit * 6)) / 2);

    let logicalStartTime = -1;
    const NOTE_BEFORE_SECONDS = 1;
    const NOTE_AFTER_SECONDS = 0.2;
    const NOTE_FADE_SECONDS = 0.2;
    const NOTE_APPROACH_SECONDS = 0.6;
    let onScreenNotes: Note[] = [];
    let onScreenNotesSeekIndex = 0;
    let currentCombo = $state(0);
    let comboText = $derived(currentCombo.toString());
    let accuracy = $state(1);
    let accuracyText = $derived(`${(accuracy * 100).toFixed(2)}%`);

    // DEBUG: temporary
    const CHART: Note[] = [
        { type: "tap", time: 0, position: { row: 1, xPos: 0 } },
        { type: "tap", time: 1, position: { row: 1, xPos: 1 } },
        { type: "tap", time: 2, position: { row: 1, xPos: 2 } },
        { type: "tap", time: 2.5, position: { row: 2, xPos: 2.5 } },
        { type: "tap", time: 3, position: { row: 1, xPos: 3 } },
        { type: "tap", time: 3.5, position: { row: 2, xPos: 3.5 } },
        { type: "tap", time: 4, position: { row: 1, xPos: 4 } },
        { type: "tap", time: 5, position: { row: 1, xPos: 5 } },
        { type: "tap", time: 6, position: { row: 1, xPos: 6 } },
        { type: "tap", time: 7, position: { row: 1, xPos: 7 } },
        { type: "tap", time: 8, position: { row: 1, xPos: 8 } },
        { type: "tap", time: 8.25, position: { row: 2, xPos: 8.25 } },
        { type: "tap", time: 8.5, position: { row: 3, xPos: 8.5 } },
        { type: "tap", time: 8.75, position: { row: 2, xPos: 8.75 } },
        { type: "tap", time: 9, position: { row: 1, xPos: 9 } },
    ];

    /** Render next frame or start rendering sequence */
    function render() {
        // Clear canvas
        canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw progress bar
        const gameTime = audioContext!.currentTime - logicalStartTime; // NOTE: guaranteed audioContext so make ts happy
        canvasCtx.fillStyle = "#d4d4d8"; // zinc-300
        canvasCtx.globalAlpha = 1;
        canvasCtx.fillRect(0, canvasHeight - 5, gameTime / global.musicPlayerData.song.length * canvasWidth, 5);

        // Clear long unhit notes
        let removeCount = 0;
        for (let i = 0; i < onScreenNotes.length; i++) {
            if (onScreenNotes[i].time + NOTE_AFTER_SECONDS < gameTime) {
                removeCount++;
            }
        }
        onScreenNotes.splice(0, removeCount);

        // Seek and add new notes
        for (let i = onScreenNotesSeekIndex; i < CHART.length; i++) {
            if (CHART[i].time - NOTE_BEFORE_SECONDS <= gameTime) {
                onScreenNotes.push(CHART[i] as Note);
                onScreenNotesSeekIndex++;
            }
        }

        // Draw notes (can optimize with clear notes, change to <=) (TODO)
        for (let i = onScreenNotes.length - 1; i >= 0; i--) {
            const note = onScreenNotes[i]; // temp: ts
            if (note.type === "tap") {
                // Circle
                canvasCtx.fillStyle = "#7823c2";
                canvasCtx.globalAlpha = Math.min(Math.min(gameTime - (note.time - NOTE_BEFORE_SECONDS), (note.time + NOTE_AFTER_SECONDS) - gameTime) / NOTE_FADE_SECONDS, 1);
                canvasCtx.beginPath();
                canvasCtx.arc(note.position.xPos * noteDimensionUnit + noteRadius + canvasXOffset, note.position.row * noteDimensionUnit + noteRadius + canvasYOffset, noteRadius, 0, 2 * Math.PI);
                canvasCtx.fill();

                // Circle border
                canvasCtx.lineWidth = Math.floor(noteRadius / 12);
                canvasCtx.strokeStyle = "#a44eed";
                canvasCtx.stroke();

                // Approach circle
                const approachLeftPercentage = (note.time - gameTime) / NOTE_APPROACH_SECONDS;
                if (approachLeftPercentage <= 1) {
                    canvasCtx.strokeStyle = "#d4d4d8";
                    canvasCtx.globalAlpha = 1 - approachLeftPercentage;
                    canvasCtx.beginPath();
                    canvasCtx.arc(note.position.xPos * noteDimensionUnit + noteRadius + canvasXOffset, note.position.row * noteDimensionUnit + noteRadius + canvasYOffset, Math.max(noteRadius, approachLeftPercentage * noteDimensionUnit + noteRadius), 0, 2 * Math.PI);
                    canvasCtx.stroke();
                }
            }
        }

        requestAnimationFrame(render);
    }

    /** Handle game input (TODO) */
    function gameInput(row: number) {
        for (let i = 0; i < onScreenNotes.length; i++) {
            if (onScreenNotes[i].position.row === row) {
                currentCombo++;
                onScreenNotes.splice(i, 1);
                break;
            }
        }
    }

    /** Event handler for keyboard game input */
    function gameKeydownHandler(event: KeyboardEvent) {
        if (event.repeat === true) return;
        switch (event.code) {
            case "KeyQ":
            case "KeyW":
            case "KeyE":
            case "KeyR":
            case "KeyT":
            case "KeyY":
            case "KeyU":
            case "KeyI":
            case "KeyO":
            case "KeyP":
            case "BracketLeft":
            case "BracketRight":
                gameInput(1);
                break;

            case "KeyA":
            case "KeyS":
            case "KeyD":
            case "KeyF":
            case "KeyG":
            case "KeyH":
            case "KeyJ":
            case "KeyK":
            case "KeyL":
            case "Semicolon":
            case "Quote":
                gameInput(2);
                break;

            case "KeyZ":
            case "KeyX":
            case "KeyC":
            case "KeyV":
            case "KeyB":
            case "KeyN":
            case "KeyM":
            case "Comma":
            case "Period":
            case "Slash":
                gameInput(3);
                break;
        }
    }

    /** Start the game */
    export function start() {
        if (audioContext === null || musicSource === null) return false;
        const startTime = audioContext.currentTime + 0.5;
        musicSource.start(startTime);
        logicalStartTime = startTime // + offset + audioContext.baseLatency + audioContext.outputLatency
        render();
    }

    // When component loads
    onMount(() => {
        const ctx = canvasElement.getContext("2d");
        if (ctx === null) return; // TODO: can do notif
        canvasCtx = ctx;
        dpr = window.devicePixelRatio;
        canvasCtx.scale(dpr, dpr);
        window.addEventListener("keydown", gameKeydownHandler);
    });
    onDestroy(() => {
        window.removeEventListener("keydown", gameKeydownHandler);
    })
</script>

<!-- Game canvas -->
<canvas bind:this={canvasElement} bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight} width={canvasWidth * dpr} height={canvasHeight * dpr}  class="w-full h-full"></canvas>
    
<!-- Combo counter -->
<div class="absolute left-12 bottom-12 flex flex-col flex-nowrap gap-2 items-start justify-end">
    <span class="ml-0.5 text-zinc-300 text-lg font-comfortaa tracking-wide select-none">Combo</span>
    <span class="text-zinc-300 text-5xl max-pc:text-4xl font-comfortaa font-light tracking-wide select-none">{comboText}</span>
</div>

<!-- Accuracy display -->
<div class="absolute right-12 bottom-12 flex flex-col flex-nowrap gap-2 items-end justify-end">
    <span class="ml-0.5 text-zinc-300/90 text-lg font-comfortaa tracking-wide select-none">Accuracy</span>
    <span class="text-zinc-300 text-5xl max-pc:text-4xl font-comfortaa font-light tracking-wide select-none">{accuracyText}</span>
</div>