<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import { audioContext, initializeAudioContext } from "$lib/system/audio-system";
    import { pauseMusic } from "$lib/system/audio-helpers";
    import { global } from "$lib/system/global.svelte";

    // Canvas and local states
    let canvasElement: HTMLCanvasElement;
    let canvasCtx: CanvasRenderingContext2D;
    let screenWidth = $state(0);
    let screenHeight = $state(0);
    let noteDiameter = $derived(Math.floor(Math.min(screenWidth / 6, screenHeight / 5)));
    let noteRadius = $derived(noteDiameter / 2);
    let canvasWidth = $derived(noteDiameter * 5);
    let canvasHeight = $derived(noteDiameter);
    let canvasXOffset = $derived((screenWidth - canvasWidth) / 2);
    let canvasYOffset = $derived((screenHeight - canvasHeight) / 2 - (noteDiameter / 4));
    
    let specialMusicVolumeNode: GainNode;
    let specialMusicSource: AudioBufferSourceNode;
    let logicalStartTime: number;
    const BPM = 60;

    type CalibrationStep = "audio-visual" | "input";
    let step: CalibrationStep = "audio-visual";

    // On screen loaded
    onMount(async () => {
        // Check and initialize the audio context in case it's not initialized
        initializeAudioContext();
        if (audioContext!.state === "suspended") await audioContext!.resume(); // NOTE: guaranteed audioContext so make ts happy

        // Pause music
        pauseMusic(1);

        // Load and decode audio
        global.waitingCount++;
        const response = await fetch("/assets/samples/calibration3.ogg");
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer); // NOTE: guaranteed audioContext so make ts happy
        global.waitingCount--;

        // Make special music source and connect to music volume node
        specialMusicVolumeNode = new GainNode(audioContext!, {
            gain: global.userSettings.musicVolume
        });
        specialMusicSource = new AudioBufferSourceNode(audioContext!, { // NOTE: guaranteed audioContext so make ts happy
            buffer: audioBuffer,
            loop: true
        });
        specialMusicSource.connect(specialMusicVolumeNode).connect(audioContext!.destination); // NOTE: guaranteed audioContext so make ts happy

        // Prepare canvas context
        const ctx = canvasElement.getContext("2d");
        if (ctx === null) return;
        canvasCtx = ctx;

        // Start the calibration music
        logicalStartTime = audioContext!.currentTime + 1;
        specialMusicSource?.start(logicalStartTime); // NOTE: guaranteed audioContext so make ts happy
    });
    onDestroy(() => {
        if (audioContext === null || specialMusicVolumeNode === null || specialMusicSource === null) return;

        specialMusicSource.stop();
        specialMusicSource.disconnect();
        specialMusicVolumeNode.disconnect();
    });

    function render() {
        // const beat = audioContext!.currentTime - logicalStartTime;
        // const beatProgress;

    }
</script>

<!-- Calibration screen -->
<div transition:fade={{ duration: 500, easing: circOut }} bind:clientWidth={screenWidth} bind:clientHeight={screenHeight} class="absolute inset-0 w-full h-full bg-black/50 flex flex-col flex-nowrap gap-0 items-center justify-between">
    <!-- Main progress bar -->
    <div class="flex flex-col flex-nowrap gap-3">
        <div class="mt-16 w-240 h-2 rounded-full bg-zinc-700"></div>
        <div class="flex flex-row flex-nowrap gap-0 items-start justify-evenly">
            <span class="text-zinc-300 font-poppins tracking-wide">Step 1: Audio-Visual Calibration</span>
            <span class="text-zinc-500 font-poppins tracking-wide">Step 2: Input Calibration</span>
        </div>
    </div>

    <!-- Visual indicator -->
    <canvas bind:this={canvasElement} width={canvasWidth} height={canvasHeight} style="top: {canvasYOffset}px; left: {canvasXOffset}px; margin-bottom: {noteRadius}px;" class="absolute bg-amber-300/10"></canvas>

    <!-- Control -->
    <div class="flex flex-row flex-nowrap gap-4">

    </div>
</div>