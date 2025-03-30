<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { circIn, circOut } from "svelte/easing";
    import Game from "$lib/game/Game.svelte";
    import { loadNewMusicFromLink, BACKGROUND_MUSIC_LIST } from "$lib/system/audio-helpers";
    import { global } from "$lib/system/global.svelte";
    import { sleep } from "$lib/system/helpers";

    // Local states
    let gameElement: Game;

    // When game screen loads
    onMount(async () => {
        // Fade in loading info and load resources, wait finish && [1500]-2000ms: loading info animation attack + sustain done
        global.gameScreenStatus = "loading";
        global.musicPlayerData.song = BACKGROUND_MUSIC_LIST[4]; // TODO: temporary
        await Promise.all([loadNewMusicFromLink(global.musicPlayerData.song.audioLink, false, 1.5, -1), sleep(1500)]);

        // Fade out loading info, wait [500]-1000ms: loading info animation release done
        global.gameScreenStatus = "before-game";
        // TODO: fade in song cover/background
        await sleep(500);

        // Fade in main game area, wait [500]-1000ms: main game area attack done
        global.gameScreenStatus = "in-game";
        // await sleep(500);

        // Start game
        gameElement.canStart();
    });
</script>

<!-- Game miscellaneous UI -->
<div class="absolute inset-0 w-full h-full flex flex-col flex-nowrap gap-6 items-center justify-center">
    {#if global.gameScreenStatus === "loading"}
    <!-- Loading info -->
    <div in:fly={{ duration: 500, easing: circOut, y: 50 }} out:fly={{ duration: 500, easing: circIn, y: 50 }}>
        <span class="text-zinc-50 text-lg font-poppins tracking-wide">you're in game mode</span>
    </div>
    {/if}
</div>

<!-- Main game area -->
<div class="absolute inset-0 w-full h-full {global.gameScreenStatus === "in-game" ? "opacity-100" : "opacity-0" } transition duration-1000 ease-circ-out">
    <Game bind:this={gameElement} />
</div>