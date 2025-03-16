<script lang="ts">
    import { fly } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import HomeLeftButtonGroup from "./button-groups/HomeLeftButtonGroup.svelte";
    import HomeRightButtonGroup from "./button-groups/HomeRightButtonGroup.svelte";
    import SongSelectLeftButtonGroup from "./button-groups/SongSelectLeftButtonGroup.svelte";
    import SongSelectRightButtonGroup from "./button-groups/SongSelectRightButtonGroup.svelte";
    import { global } from "$lib/system/global.svelte";

    // Local states
    let contentWidth = $state(0);
</script>

<!-- Bottom panel (fixed height) -->
{#if global.screen === "home" || global.screen === "song-select"}
<div transition:fly={{ duration: 300, easing: circOut, y: 104, opacity: 1 }} class="w-full grid">
    <!-- Background -->
    <div hidden={contentWidth === 0} style="width: {contentWidth}px;" class="row-start-1 col-start-1 h-26 mx-auto rounded-t-3xl bg-zinc-700/30 transition-all duration-300 ease-circ-out"></div>

    <!-- Content -->
    <div bind:offsetWidth={contentWidth} class="row-start-1 col-start-1 w-fit h-26 mx-auto px-4 grid">
        <!-- Left button group -->
        {#if global.screen === "home"}
        <div in:fly={{ duration: 300, easing: circOut, x: global.screenAnimationReverseDirection ? -100 : 100 }} class="row-start-1 col-start-1 flex flex-row flex-nowrap gap-4 items-center justify-start">
            <HomeLeftButtonGroup />
        </div>
        {:else if global.screen === "song-select"}
        <div in:fly={{ duration: 300, easing: circOut, x: global.screenAnimationReverseDirection ? -100 : 100 }} class="row-start-1 col-start-1 flex flex-row flex-nowrap gap-4 items-center justify-start">
            <SongSelectLeftButtonGroup />
        </div>
        {/if}

        <!-- Spacer -->
        <div class="row-start-1 col-start-2 w-36 flex items-center justify-center">
            <span class="text-zinc-50/1 font-comfortaa tracking-wide select-none">(/≧▽≦)/</span>
        </div>

        <!-- Right button group -->
        {#if global.screen === "home"}
        <div in:fly={{ duration: 300, easing: circOut, x: global.screenAnimationReverseDirection ? 100 : -100 }} class="row-start-1 col-start-3 flex flex-row flex-nowrap gap-4 items-center justify-end">
            <HomeRightButtonGroup />
        </div>
        {:else if global.screen === "song-select"}
        <div in:fly={{ duration: 300, easing: circOut, x: global.screenAnimationReverseDirection ? 100 : -100 }} class="row-start-1 col-start-3 flex flex-row flex-nowrap gap-4 items-center justify-end">
            <SongSelectRightButtonGroup />
        </div>
        {/if}
    </div>
</div>
{/if}