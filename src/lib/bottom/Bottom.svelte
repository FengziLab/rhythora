<script lang="ts">
    import { fly, type FlyParams } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import HomeLeft from "./button-groups/HomeLeft.svelte";
    import HomeRight from "./button-groups/HomeRight.svelte";
    import SongSelectLeft from "./button-groups/SongSelectLeft.svelte";
    import SongSelectRight from "./button-groups/SongSelectRight.svelte";
    import { global } from "$lib/system/global.svelte";

    // Bottom panel style controls
    let contentWidth = $state(0);
    let leftTransition: FlyParams = $derived({
        x: global.screenAnimationReverseDirection ? -100 : 100,
        duration: 300,
        easing: circOut
    });
    let rightTransition: FlyParams = $derived({
        x: global.screenAnimationReverseDirection ? 100 : -100,
        duration: 300,
        easing: circOut
    });
</script>

<!-- Bottom panel (fixed height) -->
<div class="w-full {!(global.screen === "home" || global.screen === "song-select") ? "translate-y-full" : ""} transition duration-300 ease-circ-out grid">
    <!-- Background -->
    <div style="width: {contentWidth}px;" class="row-start-1 col-start-1 h-26 mx-auto rounded-t-3xl bg-zinc-700/30 transition-all duration-300 ease-circ-out" hidden={contentWidth === 0}></div>

    <!-- Content -->
    <div bind:offsetWidth={contentWidth} class="row-start-1 col-start-1 w-fit h-26 mx-auto px-4 grid">

        <!-- Left button group -->
        {#if global.screen === "home"}
        <div in:fly={leftTransition} class="row-start-1 col-start-1 flex flex-row flex-nowrap gap-4 items-center justify-start">
            <HomeLeft />
        </div>
        {:else if global.screen === "song-select"}
        <div in:fly={leftTransition} class="row-start-1 col-start-1 flex flex-row flex-nowrap gap-4 items-center justify-start">
            <SongSelectLeft />
        </div>
        {/if}

        <!-- Spacer -->
        <div class="row-start-1 col-start-2 w-36"></div>

        <!-- Right button group -->
        {#if global.screen === "home"}
        <div in:fly={rightTransition} class="row-start-1 col-start-3 flex flex-row flex-nowrap gap-4 items-center justify-end">
            <HomeRight />
        </div>
        {:else if global.screen === "song-select"}
        <div in:fly={rightTransition} class="row-start-1 col-start-3 flex flex-row flex-nowrap gap-4 items-center justify-end">
            <SongSelectRight />
        </div>
        {/if}

    </div>
</div>