<script lang="ts">
    import { fly } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import { global } from "$lib/system/global.svelte";
    import { getScreenTransitionX } from "$lib/system/helpers.svelte";

    // Local states
    let screenTransitionX = $derived(getScreenTransitionX("song-select", global.screen, global.screenTransitionMode, 100));
</script>

<!-- Song select screen (TODO) -->
<div transition:fly={{ duration: 300, easing: circOut, x: screenTransitionX }} class="row-start-1 col-start-1 w-full h-full p-4 flex flex-col flex-nowrap gap-2 items-center justify-center">
    <span class="text-zinc-50 text-xl font-comfortaa tracking-wide">Hi and welcome to Rhythora</span>
    <span class="text-zinc-50 text-xl font-comfortaa tracking-wide">The Rhythorian Corporation is busy making the song select screen</span>
    <br/>
    <span class="text-zinc-300 text-lg font-poppins tracking-wide">(For now, you will play the demo song "最後的灰燼" by Ds_Squid)</span>
    <div class="h-18"></div>
</div>