<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { audioContext, musicVolumeNode, fadeToMusicVolume } from "$lib/system/audioContext";
    import { playRandomBackgroundMusic } from "$lib/system/audioHelpers";

    // Local states
    let displayText = $state("Debug");
    let updateIntervalID: number;

    /** Update debug info */
    function updateValue() {
        displayText = `
            [Audio System] <br />
            currentTime: ${audioContext?.currentTime.toFixed(2)} <br />
            musicVolume: ${musicVolumeNode?.gain.value.toFixed(1)} <br />
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
<div class="absolute bottom-4 left-4 max-w-60 p-2 rounded-xl bg-zinc-800/90 border-t-2 border-b-2 border-zinc-800/90">
    <!-- Info display -->
    <div class="h-full p-2">
        <span class="text-zinc-100 text-xs font-mono select-none">{@html displayText}(Press Backspace to exit)</span>
    </div>

    <!-- Buttons -->
    <div class="flex flex-row flex-wrap gap-2">
        <button onclick={() => { playRandomBackgroundMusic() }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
            <span class="text-zinc-100 text-xs font-mono select-none">New BGM</span>
        </button>
        <button onclick={() => { fadeToMusicVolume(2) }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
            <span class="text-zinc-100 text-xs font-mono select-none">Vol Up</span>
        </button>
        <button onclick={() => { fadeToMusicVolume(1) }} class="h-8 px-2 rounded-md hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
            <span class="text-zinc-100 text-xs font-mono select-none">Vol Down</span>
        </button>
    </div>
</div>
