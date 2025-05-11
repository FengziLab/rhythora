<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import CalibrationSlider from "$lib/ui/misc/CalibrationSlider.svelte";
    import { audioContext, initializeAudioContext } from "$lib/system/audio-system";
    import { pauseMusic, loadSoundFromSoundList, playHitsound } from "$lib/system/audio-helpers";
    import { DEFAULT_SETTINGS, global, setUserSetting } from "$lib/system/global.svelte";
    import { returnToReturnScreen } from "$lib/system/helpers.svelte";
    import type { CalibrationStep } from "$lib/system/types";

    // Local states
    let step: CalibrationStep = $state("audio-visual");
    let tempAudioDisplacementMs = $state(global.userSettings.audioDisplacementMs);
    let tempInputDisplacementMs = $state(global.userSettings.inputDisplacementMs);
    const CHANGE_AMPLITUDE_MS = 500;
    let drawLoopID: number | null = null;
    let isHitsoundsEnabled = $state(global.userSettings.hitsoundsVolume !== 0);
    let hintLayer1 = $derived((step as CalibrationStep) === "input" && isHitsoundsEnabled === true && global.userSettings.hitsoundsVolume < 0.1 ? "Is hitsounds volume too low?" : ""); // NOTE: step is changed so make ts happy
    let hintLayer2 = $derived(global.userSettings.musicVolume < 0.1 ? "Is music volume too low?" : "");
    let hintLayer3 = $derived((step as CalibrationStep) === "input" && isHitsoundsEnabled === true && tempAudioDisplacementMs > 30 ? "Using hitsounds is not recommended: feedback difference alone is too large" : ""); // NOTE: step is changed so make ts happy
    let isTappedOrHinted = false;
    let isHintTapDisplaying = $state(false);
    let hintLayer4 = $derived(isHintTapDisplaying ? "Try tapping letter keys to the beat!" : "");
    let hintSavedCount = $state(0);
    let hintLayer5 = $derived(hintSavedCount > 0 ? "Saved!" : "");
    let hintText = $derived(hintLayer5 ? hintLayer5 : (hintLayer4 ? hintLayer4 : (hintLayer3 ? hintLayer3 : (hintLayer2 ? hintLayer2 : (hintLayer1 ? hintLayer1 : "")))));

    // Audio system at home
    let specialLatencyDelayNode: DelayNode;
    let specialMusicVolumeNode: GainNode;
    let specialMusicSource: AudioBufferSourceNode;
    let specialMusicBuffer: AudioBuffer;
    let logicalStartTime: number;
    const BPM = 60;
    const BEAT_SECONDS = 60 / BPM;
    const MUSIC_LENGTH = 16;

    // Visual indicator canvas
    let visualIndicatorCanvasElement: HTMLCanvasElement;
    let visualIndicatorCanvasCtx: CanvasRenderingContext2D;
    let screenWidth = $state(0);
    let screenHeight = $state(0);
    let noteDiameter = $derived(Math.floor(Math.min(screenWidth / 6, screenHeight / 5)));
    let noteRadius = $derived(noteDiameter / 2);
    let visualIndicatorCanvasWidth = $derived(noteDiameter * 4.76);
    let visualIndicatorCanvasHeight = $derived(noteDiameter);
    let visualIndicatorCanvasXOffset = $derived((screenWidth - visualIndicatorCanvasWidth) / 2);
    let visualIndicatorCanvasYOffset = $derived((screenHeight - visualIndicatorCanvasHeight) / 2 - (noteDiameter * 0.2));
    let beatXOffset = $derived([0, noteDiameter * 1.25, noteDiameter * 2.5, noteDiameter * 3.75]);

    // Over-slider canvas
    let overSliderCanvasElement: HTMLCanvasElement;
    let overSliderCanvasCtx: CanvasRenderingContext2D;
    let overSliderCanvasWidth = $state(300);
    let overSliderCanvasHeight = $state(150);
    let beatTimings: number[] = [];
    let nextBeatTiming = 0;
    let tapTimings: number[] = $state([]);

    // Input
    let heldKeys: Record<string, boolean> = {};

    /* ------------------------------ Loading ------------------------------ */

    // On screen loaded
    onMount(async () => {
        // Check and initialize the audio context in case it's not initialized
        initializeAudioContext();
        if (audioContext!.state === "suspended") await audioContext!.resume(); // NOTE: guaranteed audioContext so make ts happy

        // Pause music
        pauseMusic(1);

        // Load and decode audio
        await Promise.all([loadSpecialMusic(), loadSoundFromSoundList("stableNormalHitnormal")]);

        // Make special latency delay node, music volume node, and music source and connect them to the destination
        specialLatencyDelayNode = new DelayNode(audioContext!, { // NOTE: guaranteed audioContext so make ts happy
            delayTime: 0
        });
        specialMusicVolumeNode = new GainNode(audioContext!, { // NOTE: guaranteed audioContext so make ts happy
            gain: global.userSettings.musicVolume
        });
        specialMusicSource = new AudioBufferSourceNode(audioContext!, { // NOTE: guaranteed audioContext so make ts happy
            buffer: specialMusicBuffer,
            loop: true,
            loopStart: 0,
            loopEnd: MUSIC_LENGTH
        });
        specialMusicSource.connect(specialMusicVolumeNode).connect(specialLatencyDelayNode).connect(audioContext!.destination); // NOTE: guaranteed audioContext so make ts happy

        // Prepare canvas contexts
        const ctx1 = visualIndicatorCanvasElement.getContext("2d");
        if (ctx1 === null) return;
        visualIndicatorCanvasCtx = ctx1;
        const ctx2 = overSliderCanvasElement.getContext("2d");
        if (ctx2 === null) return;
        overSliderCanvasCtx = ctx2;

        // Listen for keyboard events
        window.addEventListener("keydown", keydownHandler);
        window.addEventListener("keyup", keyupHandler);

        // Start the calibration music
        logicalStartTime = audioContext!.currentTime + 1;
        specialMusicSource?.start(logicalStartTime); // NOTE: guaranteed audioContext so make ts happy

        // Start drawing early
        drawLoopID = requestAnimationFrame(draw);
    });
    onDestroy(() => {
        // Remove keyboard listeners
        window.removeEventListener("keydown", keydownHandler);
        window.removeEventListener("keyup", keyupHandler);

        // Stop drawing sequence
        if (drawLoopID !== null) {
            cancelAnimationFrame(drawLoopID);
        }

        // Stop music and sounds (NOTE: sudden is fine since music is only drum beats)
        if (audioContext === null || specialMusicVolumeNode === null || specialMusicSource === null) return;
        specialMusicSource.stop();
        specialMusicSource.disconnect();
        specialMusicVolumeNode.disconnect();
    });

    /** Load special music into buffer */
    async function loadSpecialMusic() {
        global.waitingCount++;
        try {
            const response = await fetch("/assets/samples/calibration3.ogg");
            const arrayBuffer = await response.arrayBuffer();
            specialMusicBuffer = await audioContext!.decodeAudioData(arrayBuffer); // NOTE: guaranteed audioContext so make ts happy
        } catch (error) {
            global.waitingCount--;
            return;
        }
        global.waitingCount--;
    }

    // Manually match special music volume node volume with music volume node
    // NOTE: separate because we want to avoid a latency delay node later in their pipeline
    $effect(() => {
        const musicVolumeToSet = global.userSettings.musicVolume; // NOTE: makes the effect depend on this state change
        if (specialMusicVolumeNode !== undefined) {
            specialMusicVolumeNode.gain.value = musicVolumeToSet;
        }
    });

    /* ------------------------------ Visuals ------------------------------ */

    /** Draw next frame or start drawing sequence */
    function draw() {
        /* Visual indicator canvas */
        // Clear canvas
        visualIndicatorCanvasCtx.clearRect(0, 0, visualIndicatorCanvasWidth, visualIndicatorCanvasHeight);

        // Calculate timing
        const logicalElapsedTime = audioContext!.currentTime - logicalStartTime; // NOTE: guaranteed audioContext so make ts happy
        const delayedLogicalElapsedTime = logicalElapsedTime - (step === "audio-visual" ? tempAudioDisplacementMs / 1000 : Math.max(0, tempAudioDisplacementMs / 1000)); // NOTE: this can be negative since no delay is given to our music
        const beat = Math.floor(delayedLogicalElapsedTime % (BEAT_SECONDS * 4) / BEAT_SECONDS);
        const beatProgress = (delayedLogicalElapsedTime % BEAT_SECONDS) / BEAT_SECONDS;

        // Draw circle
        visualIndicatorCanvasCtx.fillStyle = "#9f9fa9"; // zinc-400 (hex)
        visualIndicatorCanvasCtx.globalAlpha = 1 - beatProgress;
        visualIndicatorCanvasCtx.beginPath();
        visualIndicatorCanvasCtx.arc(beatXOffset[beat] + noteRadius, noteRadius, Math.ceil(noteRadius * 0.9), 0, 2 * Math.PI);
        visualIndicatorCanvasCtx.fill();

        // Circle border
        const borderWidth = Math.floor(noteRadius / 10);
        visualIndicatorCanvasCtx.lineWidth = borderWidth;
        visualIndicatorCanvasCtx.strokeStyle = "#d4d4d8"; // zinc-300 (hex)
        visualIndicatorCanvasCtx.beginPath();
        visualIndicatorCanvasCtx.arc(beatXOffset[beat] + noteRadius, noteRadius, noteRadius - (borderWidth / 2), 0, 2 * Math.PI);
        visualIndicatorCanvasCtx.stroke();

        /* Over-slider canvas */
        // Clear canvas
        overSliderCanvasCtx.clearRect(0, 0, overSliderCanvasWidth, overSliderCanvasHeight);

        // Calculate timing
        if (logicalElapsedTime + (CHANGE_AMPLITUDE_MS / 1000) >= nextBeatTiming) {
            beatTimings.push(nextBeatTiming);
            nextBeatTiming = (Math.round(nextBeatTiming / BEAT_SECONDS) + 1) * BEAT_SECONDS;
        }

        // Draw beat timing line
        overSliderCanvasCtx.lineWidth = 3;
        overSliderCanvasCtx.strokeStyle = step === "audio-visual" ? "#71717b" : "#71717b88"; // zinc-500 (hex)
        let toRemove = 0;
        for (const beatTiming of beatTimings) {
            const lineX = ((logicalElapsedTime - beatTiming) / (CHANGE_AMPLITUDE_MS / 1000) * 0.5 + 0.5) * overSliderCanvasWidth;
            overSliderCanvasCtx.beginPath();
            overSliderCanvasCtx.moveTo(lineX, 0);
            overSliderCanvasCtx.lineTo(lineX, overSliderCanvasHeight);
            overSliderCanvasCtx.stroke();
            if (lineX > overSliderCanvasWidth) toRemove++;
        }
        for (let i = 0; i < toRemove; i++) {
            beatTimings.shift();
        }

        // Draw next frame
        drawLoopID = requestAnimationFrame(draw);
    }

    /* ------------------------------ Controls ------------------------------ */

    /** (Route keydowns to timing taps and screen scope main and back buttons) */
    function keydownHandler(event: KeyboardEvent) {
        // Tap keys
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
                    timingTap(event);
                    return;
            }
        }

        // Screen-wide main and back buttons
        if (event.target === document.body) {
            if (event.key === "Enter") {
                rightButtonHandler();
            } else if (event.key === "Escape") {
                leftButtonHandler();
            }
        }
    }
    /** (Release a held key from heldKeys) */
    function keyupHandler(event: KeyboardEvent) {
        if (heldKeys[event.code] === true) {
            heldKeys[event.code] = false;
        }
    }

    /** Handle timing tap */
    function timingTap(event: KeyboardEvent) {
        // Mark key down
        if (heldKeys[event.code] === true) return;
        heldKeys[event.code] = true;

        // Push to markers
        if (step !== "input") return;
        if (audioContext === null) return;
        const logicalElapsedTime = audioContext.currentTime - logicalStartTime;
        const timeDifference = logicalElapsedTime - (Math.round(logicalElapsedTime / BEAT_SECONDS) * BEAT_SECONDS);
        tapTimings.push(timeDifference);

        // Play hitsound
        if (isHitsoundsEnabled === true) playHitsound("stableNormalHitnormal");

        // Hide hint
        isTappedOrHinted = true;
        isHintTapDisplaying = false;
    }

    /** (Exit on audio-visual step and go back on input step) */
    function leftButtonHandler() {
        if (step === "audio-visual") {
            if (tempAudioDisplacementMs !== global.userSettings.audioDisplacementMs) {
                setUserSetting("audioDisplacementMs", tempAudioDisplacementMs, true);
                savedHint();
            }
            if (isHitsoundsEnabled === false && global.userSettings.hitsoundsVolume !== 0) {
                setUserSetting("hitsoundsVolume", 0, true);
                savedHint();
            } else if (isHitsoundsEnabled === true && global.userSettings.hitsoundsVolume === 0) {
                setUserSetting("hitsoundsVolume", DEFAULT_SETTINGS.hitsoundsVolume, true);
                savedHint();
            }
            setTimeout(() => {
                returnToReturnScreen(true);
            }, 0);
        } else if (step === "input") {
            if (tempInputDisplacementMs !== global.userSettings.inputDisplacementMs) {
                setUserSetting("inputDisplacementMs", tempInputDisplacementMs, true);
                savedHint();
            }
            step = "audio-visual";
            specialLatencyDelayNode.delayTime.value = 0;
            tapTimings = [];
            isHintTapDisplaying = false;
        }
        (document.activeElement as HTMLElement).blur(); // NOTE: the activeElement is probably an HTMLElement so make ts happy
    }
    /** (Go next on audio-visual step and exit on input step) */
    function rightButtonHandler() {
        if (step === "audio-visual") {
            if (tempAudioDisplacementMs !== global.userSettings.audioDisplacementMs) {
                setUserSetting("audioDisplacementMs", tempAudioDisplacementMs, true);
                savedHint();
            }
            step = "input";
            specialLatencyDelayNode.delayTime.value = Math.max(0, -(tempAudioDisplacementMs / 1000));
            setTimeout(() => {
                if (!isTappedOrHinted && step === "input") {
                    isTappedOrHinted = true;
                    isHintTapDisplaying = true;
                    setTimeout(() => {
                        isHintTapDisplaying = false;
                    }, 10000);
                }
            }, 5000);
        } else if (step === "input") {
            if (tempAudioDisplacementMs !== global.userSettings.audioDisplacementMs || tempInputDisplacementMs !== global.userSettings.inputDisplacementMs) {
                setUserSetting("audioDisplacementMs", tempAudioDisplacementMs, true);
                setUserSetting("inputDisplacementMs", tempInputDisplacementMs, true);
                savedHint();
            }
            if (isHitsoundsEnabled === false && global.userSettings.hitsoundsVolume !== 0) {
                setUserSetting("hitsoundsVolume", 0, true);
                savedHint();
            } else if (isHitsoundsEnabled === true && global.userSettings.hitsoundsVolume === 0) {
                setUserSetting("hitsoundsVolume", DEFAULT_SETTINGS.hitsoundsVolume, true);
                savedHint();
            }
            setTimeout(() => {
                returnToReturnScreen(true);
            }, 0);
        }
        (document.activeElement as HTMLElement).blur(); // NOTE: the activeElement is probably an HTMLElement so make ts happy
    }

    /** Increment saved count and decrement after 1.2 seconds */
    function savedHint() {
        hintSavedCount++;
        setTimeout(() => {
            hintSavedCount--;
        }, 1200);
    }
</script>

<!-- Calibration screen -->
<div in:fade={{ duration: 1000, easing: circOut }} out:fade={{ duration: 500, easing: circOut }} bind:clientWidth={screenWidth} bind:clientHeight={screenHeight} class="absolute inset-0 w-full h-full bg-black/30 flex flex-col flex-nowrap gap-0 items-center justify-between">
    <!-- Progress bar -->
    <div class="absolute inset-x-0 top-0 w-full h-1.5 bg-zinc-700"></div>
    <div class="absolute left-0 top-0 {step === "audio-visual" ? "w-1/2" : "w-full"} starting:w-0 h-1.5 bg-zinc-500 transition-all duration-500 ease-quint-out"></div>

    <!-- Top info -->
    <div class="w-full mt-8">
        <!-- Step indicators -->
        <div class="flex flex-row flex-nowrap items-start justify-around">
            <span class="{step === "audio-visual" ? "text-zinc-300" : "text-zinc-500"} font-poppins tracking-wide transition-colors duration-100 ease-circ-out">Step 1: Audio-Visual Calibration</span>
            <span class="{step === "input" ? "text-zinc-300" : "text-zinc-500"} font-poppins tracking-wide transition-colors duration-100 ease-circ-out">Step 2: Input Calibration</span>
        </div>

        <!-- Step descriptions -->
        <div class="mt-4 max-pc:mt-6 grid">
            {#if step === "audio-visual"}
            <div transition:fly={{ duration: 500, easing: circOut, y: -15 }} class="row-start-1 col-start-1 flex flex-row flex-nowrap items-start justify-around">
                <span class="w-160 max-pc:w-240 max-padh:w-180 text-center text-zinc-500 text-sm font-poppins font-medium text-balance">Audio-visual calibration determines the latency difference between audio and visual feedback on top of their common minimum latency and delays one of the two in order to sync between them. This value is ideally close to 0 upon achieving synchronization. Hint: Try dragging the slider to where you hear the sound.</span>
                <span class="max-pc:hidden w-160"></span>
            </div>
            {/if}
            {#if step === "input"}
            <div transition:fly={{ duration: 500, easing: circOut, y: -15 }} class="row-start-1 col-start-1 flex flex-row flex-nowrap items-start justify-around">
                <span class="max-pc:hidden w-160"></span>
                <span class="w-160 max-pc:w-240 max-padh:w-180 text-center text-zinc-500 text-sm font-poppins font-medium text-balance">Input calibration determines the total offset between an input's registration and its intended timing, separate from the feedback difference. Generally, this value should be around 0 if you're using hitsounds to catch the beat, and somewhere positive if physical tapping sounds are used instead.</span>
            </div>
            {/if}
        </div>
    </div>

    <!-- Visual indicator canvas -->
    <canvas bind:this={visualIndicatorCanvasElement} width={visualIndicatorCanvasWidth} height={visualIndicatorCanvasHeight} style="top: {visualIndicatorCanvasYOffset}px; left: {visualIndicatorCanvasXOffset}px; margin-bottom: {noteRadius}px;" class="absolute"></canvas>

    <!-- Control bar -->
    <div class="w-300 max-pc:w-240 max-padh:w-180 mb-4 max-pc:mb-0 flex flex-row flex-nowrap gap-10 items-end justify-between">
        <!-- Left button -->
        <button onclick={leftButtonHandler} title={step === "audio-visual" ? "Exit" : "Back"} aria-label={step === "audio-visual" ? "Exit" : "Back"} class="size-16 mb-6 rounded-full bg-zinc-400 hover:bg-zinc-300 focus-visible:bg-zinc-300 active:translate-y-1 transition duration-150 ease-circ-out flex items-center justify-center">
            {#if step === "audio-visual"}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-900">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            {:else}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-900">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            {/if}
        </button>

        <!-- Middle control elements -->
        <div class="flex-1 relative grid items-end">
            <!-- Hint text -->
            {#if hintText !== ""}
            <p transition:fly={{ duration: 300, easing: circOut, y: 30 }} class="absolute bottom-52 w-full text-center text-zinc-500 text-sm font-poppins text-balance">{hintText}</p>
            {/if}
            
            <!-- Buttons, sliders, and markers (self-controlled) -->
            <CalibrationSlider {step} bind:mutatingTempAudioDisplacementMs={tempAudioDisplacementMs} bind:mutatingTempInputDisplacementMs={tempInputDisplacementMs} changeAmplitude={CHANGE_AMPLITUDE_MS} bind:mutatingTapTimings={tapTimings} bind:mutatingIsHitsoundsEnabled={isHitsoundsEnabled} />

            <!-- Over-slider beat timing canvas -->
            <canvas bind:this={overSliderCanvasElement} bind:clientWidth={overSliderCanvasWidth} bind:clientHeight={overSliderCanvasHeight} width={overSliderCanvasWidth} height={overSliderCanvasHeight} class="absolute bottom-7 w-[calc(100%-1.25rem)] h-8 mx-[0.625rem] mask-l-from-75% mask-l-to-black/50 mask-r-from-75% mask-r-to-black/50 pointer-events-none"></canvas>
        </div>

        <!-- Right button -->
        <button onclick={rightButtonHandler} title={step === "audio-visual" ? "Continue" : "Finish"} aria-label={step === "audio-visual" ? "Continue" : "Finish"} class="size-16 mb-6 rounded-full bg-zinc-400 hover:bg-zinc-300 focus-visible:bg-zinc-300 active:translate-y-1 transition duration-150 ease-circ-out flex items-center justify-center">
            {#if step === "audio-visual"}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-900">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
            {:else}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-900">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            {/if}
        </button>
    </div>
</div>