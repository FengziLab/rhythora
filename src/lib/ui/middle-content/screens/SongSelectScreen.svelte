<script lang="ts">
    import { fly } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import { global } from "$lib/system/global.svelte";
    import { getScreenTransitionX } from "$lib/system/helpers";

    // Local states
    let screenTransitionX = $derived(getScreenTransitionX("song-select", global.screen, global.screenTransitionMode, 100));
</script>

<!-- Song Select screen (TODO) -->
<div transition:fly={{ duration: 300, easing: circOut, x: screenTransitionX }} class="row-start-1 col-start-1 w-full h-full p-4 flex flex-col flex-nowrap gap-2 items-center justify-center">
    <span class="text-zinc-50 text-xl font-comfortaa tracking-wide">hi and welcome to Rhythora</span>
    <span class="text-zinc-50 text-xl font-comfortaa tracking-wide">the Rhythorians are busy making the song select screen!</span>
    <div class="h-24"></div>
</div>