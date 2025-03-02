<script lang="ts">
    // Canvas and local states
    let canvasElement: HTMLCanvasElement;
    let canvasCtx: CanvasRenderingContext2D;
    let canvasWidth = $state(300);
    let canvasHeight = $state(150);
    let dpr = $state(1);
    let comboText = $state("0");
    let accuracyText = $state("100.00%");

    /** Prepare game canvas */
    export function prepare() {
        canvasCtx = canvasElement.getContext("2d") as CanvasRenderingContext2D; // NOTE: prevent ts thinking it might be null
        dpr = window.devicePixelRatio;
        canvasCtx.scale(dpr, dpr);
    }

    /** Render next frame or start rendering sequence */
    export function render() {
        requestAnimationFrame(render);
        canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
</script>

<!-- Notes rendering canvas -->
<canvas bind:this={canvasElement} bind:clientWidth={canvasWidth} bind:clientHeight={canvasHeight} width={canvasWidth * dpr} height={canvasHeight * dpr}  class="w-full h-full"></canvas>
    
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