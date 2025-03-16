<script lang="ts">
    let { value = $bindable(-1), min, max, step, displayMultiplier = 1 }: {
        value: number,
        min: number,
        max: number,
        step: number,
        displayMultiplier?: number
    } = $props();

    // Local states
    let displayValue: string = $state(Math.round(value * displayMultiplier).toString());

    // Two-way update between value state and displayed precise value input
    $effect(() => {
        displayValue = displayValue.replace(/\D/g, "");
        let displayNumValue = Number(displayValue) ?? 0;
        if (displayNumValue > max * displayMultiplier) {
            displayValue = (max * displayMultiplier).toString();
            return;
        } else if (displayNumValue < min * displayMultiplier) {
            displayValue = (min * displayMultiplier).toString();
            return;
        }
        value = displayNumValue / displayMultiplier;
    });
    $effect(() => {
        displayValue = Math.round(value * displayMultiplier).toString();
    });
</script>

<div class="flex flex-row flex-nowrap gap-3 items-center justify-start">
    <input type="range" bind:value {min} {max} {step} title={Math.round(value * displayMultiplier).toString()} class="w-full h-8 rounded-lg appearance-none slider" style="--position: calc({(value / max) * 100 + "%"} + (({value / max}) - 0.5) * -1 * 0.625rem);">
    <input type="text" bind:value={displayValue} maxlength={Math.round(max * displayMultiplier).toString().length} pattern="\d*" inputmode="numeric" spellcheck="false" autocomplete="off" autocorrect="off" class="w-10 h-8 rounded-xs border-b-2 border-transparent focus:border-fuchsia-300 outline-0 translate-y-px transition duration-150 ease-circ-out text-center text-zinc-50 font-comfortaa">
</div>

<style>
    /* Slider value background */
    .slider {
        background:
            linear-gradient(to right, transparent var(--position), oklch(0.37 0.013 285.805) var(--position)), /* zinc-800 */
            linear-gradient(to bottom, oklch(0.518 0.253 323.949) 0%, oklch(0.452 0.211 324.591) 100%); /* fuchsia-700 and fuchsia-800 */
    }

    /* WebKit Thumb */
    .slider::-webkit-slider-thumb {
        width: 1.25rem;
        height: 2rem;
        border-radius: 0.5rem; /* rounded-lg */
        background-color: oklch(0.833 0.145 321.434); /* fuchsia-300 */
        transition: 200ms var(--ease-circ-out);
        -webkit-appearance: none;
    }
    .slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
    }

    /* Firefox Thumb */
    .slider::-moz-range-thumb {
        width: 1.25rem;
        height: 2rem; /* maybe 2.5 */
        border-radius: 0.5rem; /* rounded-lg */
        background-color: oklch(0.833 0.145 321.434); /* fuchsia-300 */
        border: none;
        transition: 200ms var(--ease-circ-out);
    }
    .slider::-moz-range-thumb:hover {
        transform: scale(1.2);
    }

    /* THAT'S IT I'M NOT SUPPORTING ANY MORE BROWSERS */
</style>