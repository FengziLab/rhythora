<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { audioContext, musicVolumeNode, fadeToMusicVolume } from "$lib/system/audio-system";
    import { playRandomBackgroundMusic } from "$lib/system/audio-helpers";

    // Local states
    let displayText = $state("Debug");
    let updateIntervalID: number;

    /** Update debug info */
    function updateValue() {
        displayText = `
            [Audio System] <br />
            currentTime: ${audioContext?.currentTime.toFixed(2)} <br />
            musicVolume: ${musicVolumeNode?.gain.value.toFixed(2)} <br />
            baseLatency: ${audioContext?.baseLatency} <br /> 
            outputLatency: ${audioContext?.outputLatency} <br />
            state: ${audioContext?.state} <br />
        `;
    }

    // Call update
    onMount(() => {
        updateValue();
        updateIntervalID = setInterval(updateValue, 100);
    });
    onDestroy(() => {
        clearInterval(updateIntervalID);
    });
</script>

<!-- Debug panel -->
<div class="absolute left-4 bottom-4 max-w-60 p-2 rounded-xl bg-zinc-800/90 border-t-2 border-b-2 border-zinc-800/90">
    <!-- Info display -->
    <div class="h-full p-2">
        <span class="text-zinc-50 text-xs font-mono">{@html displayText}(Press Backspace to exit)</span>
    </div>

    <!-- Buttons -->
    <div class="flex flex-row flex-wrap gap-2">
        <button onclick={async () => { await playRandomBackgroundMusic(1) }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
            <span class="text-zinc-50 text-xs font-mono select-none">New BGM</span>
        </button>
        <!-- <button onclick={() => { fadeToMusicVolume(2) }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
            <span class="text-zinc-50 text-xs font-mono select-none">Vol Up</span>
        </button> -->
        <!-- <button onclick={() => { fadeToMusicVolume(1) }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
            <span class="text-zinc-50 text-xs font-mono select-none">Vol Down</span>
        </button> -->
        <button onclick={async () => { await audioContext?.resume() }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
            <span class="text-zinc-50 text-xs font-mono select-none">Resume</span>
        </button>
        <button onclick={async () => { await audioContext?.suspend() }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
            <span class="text-zinc-50 text-xs font-mono select-none">Suspend</span>
        </button>
    </div>
</div>
