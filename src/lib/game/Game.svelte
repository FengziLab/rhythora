<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import { audioContext, musicSource, loadMusicSource } from "$lib/system/audio-system";
    import { pauseMusic, resumeMusic, playHitsound } from "$lib/system/audio-helpers";
    import { global, setScreen } from "$lib/system/global.svelte";
    import { impreciseSleep } from "$lib/system/helpers.svelte";
    import type { Note, GameNote } from "$lib/system/types";

    // Game settings
    const NOTE_BEFORE_SECONDS = 0.8;
    const NOTE_AFTER_SECONDS = 0.2;
    const NOTE_FADE_SECONDS = 0.2;
    const NOTE_APPROACH_SECONDS = 0.8;
    const NOTE_HIT_FADE_SECONDS = 0.1;
    
    // Game states
    let gameChart: GameNote[];
    let onScreenNotes: GameNote[] = [];
    let onScreenNotesSeekIndex = 0;
    let isPausedOverlayShown = $state(false);

    // Game stats
    let currentCombo = $state(0);
    let comboText = $derived(currentCombo.toString());
    let accuracy = $state(1);
    let accuracyText = $derived(`${(accuracy * 100).toFixed(2)}%`);
    
    // Canvas
    let drawLoopID: number | null = null;
    let canvasElement: HTMLCanvasElement;
    let canvasCtx: CanvasRenderingContext2D;
    let canvasWidth = $state(300);
    let canvasHeight = $state(150);
    let noteDiameter = $derived(Math.floor(Math.min(canvasWidth / 10, canvasHeight / 6)));
    let noteRadius = $derived(noteDiameter / 2);
    let noteAreaXOffset = $derived((canvasWidth - (noteDiameter * 10)) / 2);
    let noteAreaYOffset = $derived((canvasHeight - (noteDiameter * 6)) / 2);

    let frameTimestamps: number[] = [];
    let updateIntervalID: number;
    let currentFPS = $state(0);

    /* ------------------------------ Loading ------------------------------ */

    // When game area loads
    onMount(() => {
        // Convert game chart
        convertToGameChart(CHART);

        // Prepare canvas context
        const ctx = canvasElement.getContext("2d");
        if (ctx === null) return; // TODO: can do notif
        canvasCtx = ctx;

        // Listen for keydown events
        window.addEventListener("keydown", keydownHandler);

        // FPS Counter
        updateIntervalID = setInterval(() => {
            if (global.userSettings.fpsCounter === false) return;
            let removeCount = 0;
            for (let i = 0; frameTimestamps[i] < performance.now() - 1000; i++) { // NOTE: guaranteed audioContext so make ts happy?
                removeCount++;
            }
            frameTimestamps.splice(0, removeCount);
            currentFPS = frameTimestamps.length;
        }, 50);
    });
    onDestroy(() => {
        window.removeEventListener("keydown", keydownHandler);
    });

    /** Start drawing and start the music after minimum appearing time */
    export function canStart() {
        if (audioContext === null || musicSource === null) return false;

        // Delay minimum appearing time
        const startTime = audioContext.currentTime + NOTE_BEFORE_SECONDS;

        // Schedule music start
        musicSource.start(startTime);

        // Update global music player data
        global.musicPlayerData.logicalStartTime = startTime;
        global.musicPlayerData.pauseTime = -1;
        global.musicPlayerData.isPlaying = true;

        // Start drawing right away
        drawLoopID = requestAnimationFrame(draw);
    }

    // Load chart
    const CHART: Note[] = [
        { type: "tap", time: 0, position: { row: 1, xPos: 0 } },
        { type: "tap", time: 1, position: { row: 1, xPos: 1 } },
        { type: "tap", time: 2, position: { row: 1, xPos: 2 } },
        { type: "tap", time: 2, position: { row: 1, xPos: 3 } },
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
        { type: "tap", time: 10, position: { row: 2, xPos: 0 } },
        { type: "tap", time: 11, position: { row: 2, xPos: 1 } },
        { type: "tap", time: 12, position: { row: 2, xPos: 2 } },
        { type: "tap", time: 12.5, position: { row: 3, xPos: 2.5 } },
        { type: "tap", time: 13, position: { row: 2, xPos: 3 } },
        { type: "tap", time: 13.5, position: { row: 3, xPos: 3.5 } },
        { type: "tap", time: 14, position: { row: 2, xPos: 4 } },
        { type: "tap", time: 15, position: { row: 2, xPos: 5 } },
        { type: "tap", time: 16, position: { row: 2, xPos: 6 } },
        { type: "tap", time: 17, position: { row: 2, xPos: 7 } },
        { type: "tap", time: 18, position: { row: 2, xPos: 8 } },
        { type: "tap", time: 18.25, position: { row: 3, xPos: 8.25 } },
        { type: "tap", time: 18.75, position: { row: 3, xPos: 8.75 } },
        { type: "tap", time: 19, position: { row: 2, xPos: 9 } },
    ]; // DEBUG: temporary

    /** Assign fresh game chart converted from a chart */
    function convertToGameChart(chart: Note[]) {
        // Convert Notes to GameNotes
        gameChart = CHART.map(note => {
            return {
                ...note,
                isSyncNote: false,
                hitAt: -1,
                hitAccuracyRating: "standby"
            }
        });

        // Mark sync notes
        for (let i = 1; i < gameChart.length; i++) {
            if (gameChart[i].time === gameChart[i - 1].time) {
                gameChart[i].isSyncNote = true;
                gameChart[i - 1].isSyncNote = true;
            }
        }
    }

    /* ------------------------------ Visuals ------------------------------ */

    /** Draw next frame or start drawing sequence */
    function draw() {
        // Clear canvas
        canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw progress bar
        const delayedGameTime = audioContext!.currentTime - global.musicPlayerData.logicalStartTime - Math.max(0, global.userSettings.audioDisplacementMs / 1000); // NOTE: guaranteed audioContext so make ts happy // NOTE: don't account for offset here, use skipping and ensure feedbacks are synced (assuming chart notes are written on actual time, or else seeking logic needs to be changed too)
        canvasCtx.fillStyle = "#d4d4d8"; // zinc-300 (hex)
        canvasCtx.globalAlpha = 1;
        canvasCtx.fillRect(0, canvasHeight - 5, delayedGameTime / global.musicPlayerData.song.length * canvasWidth, 5);

        // Clear long unhit notes (temporary solution, doesn't work with other note types)
        let removeCount = 0;
        for (let i = 0; i < onScreenNotes.length; i++) {
            if (onScreenNotes[i].time + NOTE_AFTER_SECONDS < delayedGameTime) {
                removeCount++;
            }
        }
        onScreenNotes.splice(0, removeCount);

        // Seek and add new notes (depends on note time in chart being in order)
        for (let i = onScreenNotesSeekIndex; i < gameChart.length; i++) {
            if (gameChart[i].time - NOTE_BEFORE_SECONDS <= delayedGameTime) {
                onScreenNotes.push(gameChart[i] as GameNote);
                onScreenNotesSeekIndex++;
            }
        }

        // Draw notes (can optimize with clear notes, change to <=) (TODO)
        for (let i = onScreenNotes.length - 1; i >= 0; i--) {
            const note = onScreenNotes[i]; // temp: ts
            if (note.type === "tap") {
                const centerX = note.position.xPos * noteDiameter + noteRadius + noteAreaXOffset;
                const centerY = note.position.row * noteDiameter + noteRadius + noteAreaYOffset;

                // Circle
                canvasCtx.fillStyle = note.hitAt === -1 ? "#7823c2" : "#226622";
                const noteOpacity = Math.min(
                    Math.min(
                        delayedGameTime - (note.time - NOTE_BEFORE_SECONDS), // fade in
                        (note.time + NOTE_AFTER_SECONDS) - delayedGameTime, // fade out
                    ) / NOTE_FADE_SECONDS, // convert faded time to opacity value
                    note.hitAt !== -1 ? Math.max(NOTE_HIT_FADE_SECONDS - (delayedGameTime - note.hitAt), 0) / NOTE_HIT_FADE_SECONDS : Number.POSITIVE_INFINITY, // fade out on hit
                    1
                );
                canvasCtx.globalAlpha = noteOpacity;
                canvasCtx.beginPath();
                canvasCtx.arc(centerX, centerY, noteRadius, 0, 2 * Math.PI);
                canvasCtx.fill();

                // Circle border
                const borderWidth = Math.floor(noteRadius / 10);
                canvasCtx.lineWidth = borderWidth;
                canvasCtx.strokeStyle = note.isSyncNote === true ? "#ed4e93" : "#a44eed";
                canvasCtx.beginPath();
                canvasCtx.arc(centerX, centerY, noteRadius - (borderWidth / 2), 0, 2 * Math.PI);
                canvasCtx.stroke();

                // Approach circle
                const approachRemainingPercentage = (note.time - delayedGameTime) / NOTE_APPROACH_SECONDS;
                if (approachRemainingPercentage <= 1) {
                    canvasCtx.strokeStyle = "#d4d4d8"; // zinc-300 (hex)
                    canvasCtx.globalAlpha = Math.min(1 - approachRemainingPercentage, 1) * noteOpacity;
                    canvasCtx.beginPath();
                    canvasCtx.arc(centerX, centerY, Math.max(noteRadius - (borderWidth / 2), approachRemainingPercentage * noteDiameter * 1.2 + noteRadius - (borderWidth / 2)), 0, 2 * Math.PI);
                    canvasCtx.stroke();
                }
            }
        }

        // FPS counter
        if (global.userSettings.fpsCounter === true) {
            frameTimestamps.push(performance.now());
        }

        // Draw next frame
        drawLoopID = requestAnimationFrame(draw);
    }

    /* ------------------------------ Input ------------------------------ */

    /** (Route keydowns to game input, toggle pause if Esc, and prevent certain meta keys from interrupting game input) */
    function keydownHandler(event: KeyboardEvent) {
        // Game keys
        if (event.repeat === false) {
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
                    return;
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
                    return;
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
                    return;
            }
        }

        // Miscellaneous keys
        if (event.key === "Escape") {
            togglePause();
        } else if ((event.key === "Tab") && isPausedOverlayShown === false) { // DEBUG:  || event.ctrlKey === true || event.shiftKey === true || event.altKey === true
            event.preventDefault();
        }
    }

    /** Handle game input (TODO) (TODO: only for keydown) */
    function gameInput(row: number) {
        // Record timing
        const hitAt = audioContext!.currentTime - global.musicPlayerData.logicalStartTime; // NOTE: assumed audioContext so make ts happy

        // Play hitsound
        playHitsound("stableNormalHitnormal");

        // Hit note
        for (let i = 0; i < onScreenNotes.length; i++) {
            if (onScreenNotes[i].position.row === row && onScreenNotes[i].hitAt === -1) {
                currentCombo++;
                onScreenNotes[i].hitAt = hitAt;
                // TODO: hit accuracy rating
                break;
            }
        }
    }

    /** Fade out for 1 second and switch to Song Select screen */
    async function exit() {
        // Stop drawing
        if (drawLoopID !== null) {
            cancelAnimationFrame(drawLoopID);
        }

        // Exit pause overlay
        isPausedOverlayShown = false;

        // Wait 1000ms at fading out status
        global.gameScreenStatus = "before-game";
        await impreciseSleep(1000);

        // Switch screen back
        setScreen("song-select", "to-left");
    }
    /** Reset on-screen notes, combo, accuracy, and reload music to restart (TODO: reconvert game chart maybe) */
    function restart() {
        // Stop drawing
        if (drawLoopID !== null) {
            cancelAnimationFrame(drawLoopID);
        }

        // Reset status
        onScreenNotes = [];
        onScreenNotesSeekIndex = 0;
        currentCombo = 0;
        accuracy = 1;

        // Regenerate game chart
        convertToGameChart(CHART);

        // Exit pause overlay
        isPausedOverlayShown = false;

        // Load audio source but not resume yet, then mark ready for starting
        if (loadMusicSource(null, false, 0) === true) {
            canStart();
        }
    }
    /** Toggle game and audio pausing */
    function togglePause() {
        // Pause
        if (isPausedOverlayShown === false && audioContext!.currentTime > global.musicPlayerData.logicalStartTime) { // NOTE: will return false anyway so make ts happy
            pauseMusic(-1);
            if (drawLoopID !== null) {
                cancelAnimationFrame(drawLoopID);
            }
            isPausedOverlayShown = true;
        }
        
        // Resume
        else {
            isPausedOverlayShown = false;
            if (drawLoopID !== null) {
                cancelAnimationFrame(drawLoopID);
            }
            drawLoopID = requestAnimationFrame(draw);
            resumeMusic(-1);
        }
    }
</script>

<!-- Game canvas -->
<canvas bind:this={canvasElement} bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight} width={canvasWidth} height={canvasHeight} class="w-full h-full"></canvas>

<!-- Pause button -->
<button onclick={togglePause} title="Pause" aria-label="Pause" tabindex="-1" class="absolute left-0 top-0 group size-24 max-padh:size-16 outline-none flex items-center justify-center"> <!-- NOTE: add box-content if using padding to control offset -->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 fill-zinc-300 group-hover:fill-zinc-50 group-focus-visible:fill-zinc-50 transition-colors duration-150 ease-circ-out">
        <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" />
    </svg>
</button>

<!-- Combo counter -->
<div class="absolute left-12 max-padh:left-4 bottom-12 max-padh:bottom-4 flex flex-col flex-nowrap gap-2 items-start justify-end">
    <span class="ml-0.5 text-zinc-300 text-lg max-padh:text-base font-comfortaa tracking-wide select-none">Combo</span>
    <span class="text-zinc-300 text-5xl max-pc:text-4xl max-padh:text-3xl font-comfortaa font-light tracking-wide select-none">{comboText}</span>
</div>

<!-- Accuracy display -->
<div class="absolute right-12 max-padh:right-4 bottom-12 max-padh:bottom-4 flex flex-col flex-nowrap gap-2 items-end justify-end">
    <span class="ml-0.5 text-zinc-300 text-lg max-padh:text-base font-comfortaa tracking-wide select-none">Accuracy</span>
    <span class="text-zinc-300 text-5xl max-pc:text-4xl max-padh:text-3xl font-comfortaa font-light tracking-wide select-none">{accuracyText}</span>
</div>

<!-- FPS Counter -->
{#if global.userSettings.fpsCounter === true}
<div class="absolute right-4 top-4 max-w-60 px-3 pt-1 pb-2 rounded-xl bg-zinc-800/90">
    <span class="text-zinc-50 text-xs font-mono">{currentFPS} fps</span>
</div>
{/if}

<!-- Paused overlay -->
{#if isPausedOverlayShown === true}
<div transition:fade={{ duration: 300, easing: circOut }} class="absolute inset-0 w-full h-full bg-black/70 flex items-center justify-center">
    <!-- Pause menu -->
    <div class="flex flex-col flex-nowrap gap-4">
        <!-- Pause text -->
        <p class="text-center text-zinc-400 text-2xl font-comfortaa tracking-widest">- Paused -</p>

        <!-- Pause buttons -->
        <div transition:fly={{ duration: 300, easing: circOut, y: 50 }} class="flex flex-row flex-nowrap gap-0">
            <button onclick={exit} title="Exit" aria-label="Exit" class="group w-20 h-20 rounded-full active:translate-y-1 transition duration-100 ease-circ-out flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 stroke-zinc-400 group-hover:stroke-zinc-50 transition-colors duration-100 ease-circ-out">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <button onclick={restart} title="Restart" aria-label="Restart" class="group w-20 h-20 rounded-full active:translate-y-1 transition duration-100 ease-circ-out flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 stroke-zinc-400 group-hover:stroke-zinc-50 transition-colors duration-100 ease-circ-out">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
            <button onclick={togglePause} title="Resume" aria-label="Resume" class="group w-20 h-20 rounded-full active:translate-y-1 transition duration-100 ease-circ-out flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 stroke-zinc-400 group-hover:stroke-zinc-50 transition-colors duration-100 ease-circ-out">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    </div>
</div>
{/if}