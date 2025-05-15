<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { analyserDelayNode, audioContext, latencyDelayNode, musicVolumeNode, soundBuffers } from "$lib/system/audio-system";
    import { playRandomBackgroundMusic } from "$lib/system/audio-helpers";
    import { global } from "$lib/system/global.svelte";

    // Local states
    const UPDATE_INTERVAL_MS = 100;

    let displayTextCol1 = $state("Bad browser");
    let displayTextCol2 = $state(">:(");
    let updateIntervalID: number;
    let tpsCount = $state(0);
    let tpsIntervalID: number;

    // Call update
    onMount(() => {
        updateValue();
        updateIntervalID = setInterval(updateValue, UPDATE_INTERVAL_MS);
        global.debugTriggerCount = 0;
        tpsIntervalID = setInterval(updateTPS, 1000);
    });
    onDestroy(() => {
        clearInterval(updateIntervalID);
        clearInterval(tpsIntervalID);
    });

    /** Update debug info */
    function updateValue() {
        const updateTiming = performance.now();
        displayTextCol1 = `
            [Audio System] <br/>
            currentTime: ${audioContext?.currentTime.toFixed(2)} <br/>
            state: ${audioContext?.state} <br/>
            baseLatency: ${audioContext?.baseLatency.toFixed(3)} <br/> 
            outputLatency: ${audioContext?.outputLatency.toFixed(3)} <br/>
            latencyDelay: ${latencyDelayNode?.delayTime.value.toFixed(3)} <br/>
            analyserDelay: ${analyserDelayNode?.delayTime.value.toFixed(3)} <br/>
            musicVolume: ${musicVolumeNode?.gain.value.toFixed(2)} <br/>
            soundBuffers: ${Object.keys(soundBuffers).length} <br/><br/>
            [Music Player] <br/>
            isPlaying: ${global.musicPlayerData.isPlaying} <br/>
            logicalStartTime: ${global.musicPlayerData.logicalStartTime.toFixed(2)} <br/>
            pauseTime: ${global.musicPlayerData.pauseTime.toFixed(2)} <br/>
            songBPM: ${global.musicPlayerData.song.bpm} <br/>
            songOffset: ${global.musicPlayerData.song.offset} <br/>
        `;
        displayTextCol2 = `
            [UI] <br/>
            waitingCount: ${global.waitingCount} <br/>
            openPanel: ${global.openPanel} <br/>
            screen: ${global.screen} <br/>
            transitionMode: ${global.screenTransitionMode} <br/>
            returnScreen: ${global.returnScreen} <br/>
            gameScreenStatus: ${global.gameScreenStatus} <br/>
            activeElement: ${document?.activeElement?.tagName} <br/><br/>
            [Misc] <br/>
            updateTime: ${(performance.now() - updateTiming).toFixed(0)} / ${UPDATE_INTERVAL_MS} ms <br/>
        `;
    }

    /** Update TPS (triggers per second) */
    function updateTPS() {
        tpsCount = global.debugTriggerCount;
        global.debugTriggerCount = 0;
    }
</script>

<!-- Debug panel -->
<div class="absolute left-4 bottom-4 max-w-128 p-2 rounded-xl bg-zinc-800/90 border-t-2 border-b-2 border-zinc-800/90 {global.isDebugPanelPassthroughEnabled ? "pointer-events-none" : "pointer-events-auto"}">
    <button onclick={() => { global.isDebugPanelPassthroughEnabled = !global.isDebugPanelPassthroughEnabled }} title={global.isDebugPanelPassthroughEnabled === true ? "Panel Passthrough: On" : "Panel Passthrough: Off"} aria-label={global.isDebugPanelPassthroughEnabled === true ? "Panel Passthrough: On" : "Panel Passthrough: Off"} class="absolute top-4 right-4 size-3 rounded-full {global.isDebugPanelPassthroughEnabled === true ? "bg-zinc-700" : "bg-pink-700"} hover:brightness-115 pointer-events-auto transition duration-100 ease-circ-out"></button>

    <!-- Data display -->
    <div class="p-2 flex flex-row flex-wrap gap-4">
        <span class="text-zinc-50 text-xs font-mono">{@html displayTextCol1}</span>
        <span class="text-zinc-50 text-xs font-mono">{@html displayTextCol2}</span>
    </div>

    <!-- Info -->
    <div class="mt-2 px-2 flex flex-col flex-nowrap gap-2">
        <span class="text-zinc-50 text-xs font-mono">debugMessage: {@html global.debugMessage}</span>
        <span class="text-zinc-50 text-xs font-mono">tpsCount: {tpsCount}</span>
        <span class="text-zinc-50 text-xs font-mono">(Press Backspace to exit)</span>
    </div>

    <!-- Buttons -->
    <div class="mt-2 flex flex-row flex-wrap gap-2">
        <button onclick={async () => { await playRandomBackgroundMusic(1) }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] pointer-events-auto flex items-center justify-center">
            <span class="text-zinc-50 text-xs font-mono select-none">New BGM</span>
        </button>
        <button onclick={async () => { if (audioContext?.state === "suspended") { await audioContext?.resume(); } else { await audioContext?.suspend() } }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] pointer-events-auto flex items-center justify-center">
            <span class="text-zinc-50 text-xs font-mono select-none">Freeze / Resume</span>
        </button>
        <button onclick={async () => { global.openPanel = global.openPanel !== "settings" ? "settings" : "none" }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] pointer-events-auto flex items-center justify-center">
            <span class="text-zinc-50 text-xs font-mono select-none">Settings</span>
        </button>
        <button onclick={() => { localStorage.clear(); global.debugMessage = "Refresh to see the effect"; }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] pointer-events-auto flex items-center justify-center">
            <span class="text-zinc-50 text-xs font-mono select-none">Reset Data</span>
        </button>
    </div>
</div>
