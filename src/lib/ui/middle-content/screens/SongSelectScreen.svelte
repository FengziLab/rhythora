<script lang="ts">
    import { fly } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import { global } from "$lib/system/global.svelte";

    // Local states
    let isToFromRight = $derived((global.screen === "song-select") === global.screenAnimationReverseDirection);
</script>

<!-- Song Select screen -->
<div transition:fly={{ duration: 300, easing: circOut, x: isToFromRight ? -100 : 100 }} class="row-start-1 col-start-1 w-full h-full p-4 flex flex-col flex-nowrap gap-2 items-center justify-start">
    
</div>