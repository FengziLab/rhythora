<script lang="ts">
    import { onMount } from "svelte";
    import { fly, type FlyParams } from "svelte/transition";
    import { circIn, circOut } from "svelte/easing";
    import { analyserNode } from "$lib/system/audioContext";
    import { global, setScreen } from "$lib/system/global.svelte";
    import { sleep } from "$lib/system/helpers";

    let isLoading = $state(true);
    let isGameReady = $state(false);
    let infoTransition: FlyParams = $derived({
        y: 50,
        duration: 500,
        easing: isLoading ? circOut : circIn
    });

    let canvasElement: HTMLCanvasElement;
    let canvasCtx: CanvasRenderingContext2D;
    let canvasWidth = $state(300);
    let canvasHeight = $state(150);
    let dpr = $state(1);
    let comboText = $state("0");
    let accuracyText = $state("100.00%");

    onMount(async () => {
        // instantly:
        // - fade in loading (auto)
        // - TODO: load resources
        
        // loaded and at least 2000ms:
        await sleep(2000); // use promise.all
        // - fade out loading
        isLoading = false;
        // - TODO: fade in song cover/background
        // - prepare canvas
        canvasCtx = canvasElement.getContext("2d") as CanvasRenderingContext2D; // NOTE: prevent ts thinking it might be null
        dpr = window.devicePixelRatio;
        canvasCtx.scale(dpr, dpr);  
        draw();
        
        // finish loading fade out +[500]-1000ms:
        await sleep(500); 
        // - fade in canvas
        isGameReady = true;
        
        // finish canvas fade in +500-[1000]ms:
        await sleep(1000);
        // - TODO: record time and start game
    });

    // TODO: DEBUG
    function draw() {
        requestAnimationFrame(draw);
        canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
</script>

<!-- Game miscellaneous UI screen -->
<div transition:fly={infoTransition} class="row-start-1 col-start-1 w-full h-full flex flex-col flex-nowrap gap-6 items-center justify-center">
    {#if isLoading === true}
    <!-- Loading info -->
    <div out:fly={infoTransition}>
        <span class="text-zinc-100 text-lg font-poppins tracking-wide">you're in game mode</span>
    </div>
    {/if}
</div>

<!-- Game area -->
<div class="absolute top-0 left-0 w-full h-full {isGameReady === true ? "opcaity-100" : "opacity-0" } transition duration-1000 ease-circ-out">
    <!-- Notes rendering canvas -->
    <canvas bind:this={canvasElement} bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight} width={canvasWidth * dpr} height={canvasHeight * dpr}  class="w-full h-full border-2 border-amber-500"></canvas>
    
    <!-- Combo counter -->
    <div class="absolute bottom-12 left-12 flex flex-col flex-nowrap gap-2 items-start justify-end">
        <span class="ml-0.5 text-zinc-300 text-lg font-comfortaa tracking-wide">Combo</span>
        <span class="text-zinc-300 text-5xl max-pc:text-4xl font-comfortaa font-light tracking-wide">{comboText}</span>
    </div>

    <!-- Accuracy display -->
    <div class="absolute bottom-12 right-12 flex flex-col flex-nowrap gap-2 items-end justify-end">
        <span class="ml-0.5 text-zinc-300 text-lg font-comfortaa tracking-wide">Accuracy</span>
        <span class="text-zinc-300 text-5xl max-pc:text-4xl font-comfortaa font-light tracking-wide">{accuracyText}</span>
    </div>
</div>