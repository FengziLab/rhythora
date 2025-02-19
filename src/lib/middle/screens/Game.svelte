<script lang="ts">
    import { onMount } from "svelte";
    import { fly, type FlyParams } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import { global } from "$lib/global.svelte";

    let infoTransition: FlyParams = $derived({
        y: 50,
        duration: 500,
        easing: circOut
    });

    onMount(() => {
        // instantly: start showing loading song info, start loading resources
        // min(1 second, on load): fade out song info
        // after song info fade out: hide top and bottom bar, swap in canvas, time andstart game
    });
</script>

<!-- Game loading screen -->
<div in:fly={infoTransition} class="w-full h-full flex flex-col flex-nowrap gap-6 items-center justify-center">
    <span class="text-zinc-100 text-lg font-poppins tracking-wide">you're in game mode</span>
</div>

<!-- Game render canvas -->
<!-- <canvas class="w-full h-full"></canvas> -->