<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { circIn, circOut } from "svelte/easing";
    import Game from "$lib/game/Game.svelte";
    import { setScreen } from "$lib/system/global.svelte";
    import { sleep } from "$lib/system/helpers";

    // Local states
    let isLoadingInfoShown = $state(false);
    let gameElement: Game;
    let isMainGameAreaShown = $state(false);
    let isPausedOverlayShown = $state(false);

    /** Event handler to pause/unpause the game */
    function pauseKey(event: KeyboardEvent) {
        if (event.key === "Escape") {
            isPausedOverlayShown = !isPausedOverlayShown;
        }
    }

    /** Event handler to exit the game */
    async function exit() {
        isPausedOverlayShown = false; // TODO
        isMainGameAreaShown = false;
        await sleep(1000);
        setScreen("song-select", true);
    }

    // When game screen loads
    onMount(async () => {
        // [Instantly] fade in loading info and load resources
        isLoadingInfoShown = true;
        // TODO: load resources
        
        // [+[1500]-2000ms: loading info attack + sustain && loaded] fade out loading info and load game
        await sleep(1500); // TODO: use promise.all
        isLoadingInfoShown = false;
        // TODO: fade in song cover/background
        gameElement.prepare();
        window.addEventListener("keydown", pauseKey);
        
        // [+[500]-1000ms: loading info release] fade in main game area
        await sleep(500); 
        isMainGameAreaShown = true;
        
        // [+500-[1000]ms: main game area attack] start game
        await sleep(1000);
        // TODO: record time and start game
    });
    onDestroy(() => {
        window.removeEventListener("keydown", pauseKey);
    });
</script>

<!-- Game miscellaneous UI -->
<div class="row-start-1 col-start-1 w-full h-full flex flex-col flex-nowrap gap-6 items-center justify-center">
    {#if isLoadingInfoShown === true}
    <!-- Loading info -->
    <div in:fly={{ y: 50, duration: 500, easing: circOut }} out:fly={{ y: 50, duration: 500, easing: circIn }}>
        <span class="text-zinc-100 text-lg font-poppins tracking-wide">you're in game mode</span>
    </div>
    {/if}
</div>

<!-- Main game area -->
<div class="absolute top-0 left-0 w-full h-full {isMainGameAreaShown === true ? "opcaity-100" : "opacity-0" } transition duration-1000 ease-circ-out">
    <Game bind:this={gameElement} />
</div>

<!-- Paused overlay -->
{#if isPausedOverlayShown === true}
<div transition:fade={{ duration: 300, easing: circOut }} class="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center">
    <!-- Pause menu -->
    <div class="flex flex-col flex-nowrap gap-4">
        <!-- Pause text -->
        <p class="text-center text-zinc-400 text-2xl font-comfortaa tracking-widest">- Paused -</p>

        <!-- Pause buttons -->
        <div transition:fly={{ y: 50, duration: 300, easing: circOut }} class="flex flex-row flex-nowrap gap-0">
            <button onclick={exit} title="Exit" aria-label="Exit" class="group w-20 h-20 rounded-full active:translate-y-0.5 transition duration-100 ease-circ-out flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 stroke-zinc-400 group-hover:stroke-zinc-100 transition-colors duration-100 ease-circ-out">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <button title="Restart" aria-label="Restart" class="group w-20 h-20 rounded-full active:translate-y-0.5 transition duration-100 ease-circ-out flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 stroke-zinc-400 group-hover:stroke-zinc-100 transition-colors duration-100 ease-circ-out">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
            <button onclick={() => { isPausedOverlayShown = false }} title="Resume" aria-label="Resume" class="group w-20 h-20 rounded-full active:translate-y-0.5 transition duration-100 ease-circ-out flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 stroke-zinc-400 group-hover:stroke-zinc-100 transition-colors duration-100 ease-circ-out">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    </div>
</div>
{/if}