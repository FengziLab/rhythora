<script lang="ts">
    import { fly, type FlyParams } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import { global } from "$lib/system/global.svelte";

    let isToFromRight = $derived((global.screen === "song-select") === global.screenAnimationReverseDirection);
    let songSelectTransition: FlyParams = $derived({
        x: isToFromRight ? -100 : 100,
        duration: 300,
        easing: circOut
    });
</script>

<!-- Song select screen -->
<div transition:fly={songSelectTransition} class="row-start-1 col-start-1 w-full h-full p-4 flex flex-col flex-nowrap gap-2 items-center justify-start">
    
</div>