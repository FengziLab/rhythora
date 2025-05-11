<script lang="ts">
    import { circOut, quintOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";
    import type { CalibrationStep } from "$lib/system/types";
    let { step, mutatingTempAudioDisplacementMs = $bindable(0), mutatingTempInputDisplacementMs = $bindable(0), changeAmplitude, mutatingTapTimings = $bindable([]), mutatingIsHitsoundsEnabled = $bindable(true) }: {
        step: CalibrationStep
        mutatingTempAudioDisplacementMs: number,
        mutatingTempInputDisplacementMs: number,
        changeAmplitude: number,
        mutatingTapTimings: number[],
        mutatingIsHitsoundsEnabled: boolean
    } = $props();

    // Local states for audio-visual
    let tempAudioDisplacementMsText: string = $derived(Math.round(mutatingTempAudioDisplacementMs).toString()); // NOTE: temporarily updatable in optimistic UI
    let audioSliderPosition = $derived((mutatingTempAudioDisplacementMs + changeAmplitude) / (changeAmplitude * 2));
    let audioSliderPositionLeft = $derived(audioSliderPosition < 0.5 ? `calc(${audioSliderPosition * 100}% + -1 * ((${audioSliderPosition}) - 0.5) * 0.625rem)` : "50%");
    let audioSliderPositionRight = $derived(audioSliderPosition > 0.5 ? `calc(${audioSliderPosition * 100}% + -1 * ((${audioSliderPosition}) - 0.5) * 0.625rem)` : "50%");
    
    // Local states for input
    let tempInputDisplacementMsText: string = $derived(Math.round(mutatingTempInputDisplacementMs).toString()); // NOTE: temporarily updatable in optimistic UI
    let inputSliderPosition = $derived((mutatingTempInputDisplacementMs + changeAmplitude) / (changeAmplitude * 2));
    let inputSliderPositionLeft = $derived(inputSliderPosition < 0.5 ? `calc(${inputSliderPosition * 100}% + -1 * ((${inputSliderPosition}) - 0.5) * 0.625rem)` : "50%");
    let inputSliderPositionRight = $derived(inputSliderPosition > 0.5 ? `calc(${inputSliderPosition * 100}% + -1 * ((${inputSliderPosition}) - 0.5) * 0.625rem)` : "50%");

    /** (Validate audio input, change audio displacement value and save to settings) */
    function audioTextChangeHandler() { // NOTE: code reused from Slider, improved for negative numbers
        // Filter non-numeric characters (override optimistic UI from input binding in case no derived value update)
        tempAudioDisplacementMsText = tempAudioDisplacementMsText.replace(/[^0-9-]/g, "");
        tempAudioDisplacementMsText = tempAudioDisplacementMsText.replace(/(?!^)-/g, "");

        // Cast to number for processing
        let textNumValue = Number(tempAudioDisplacementMsText);

        // Check against min/max limits (override optimistic UI from input binding in case no derived value update)
        if (textNumValue > changeAmplitude) {
            textNumValue = changeAmplitude;
            tempAudioDisplacementMsText = textNumValue.toString();
        } else if (textNumValue < -changeAmplitude) {
            textNumValue = -changeAmplitude;
            tempAudioDisplacementMsText = textNumValue.toString();
        }

        // Update main value
        if (!Number.isNaN(textNumValue)) {
            mutatingTempAudioDisplacementMs = textNumValue;
        }
    }

    /** (Validate input input, change input displacement value and save to settings) (NOTE: very ugly I know but workaround for now) */
    function inputTextChangeHandler() { // NOTE: code reused from Slider, improved for negative numbers
        // Filter non-numeric characters (override optimistic UI from input binding in case no derived value update)
        tempInputDisplacementMsText = tempInputDisplacementMsText.replace(/[^0-9-]/g, "");
        tempInputDisplacementMsText = tempInputDisplacementMsText.replace(/(?!^)-/g, "");

        // Cast to number for processing
        let textNumValue = Number(tempInputDisplacementMsText);

        // Check against min/max limits (override optimistic UI from input binding in case no derived value update)
        if (textNumValue > changeAmplitude) {
            textNumValue = changeAmplitude;
            tempInputDisplacementMsText = textNumValue.toString();
        } else if (textNumValue < -changeAmplitude) {
            textNumValue = -changeAmplitude;
            tempInputDisplacementMsText = textNumValue.toString();
        }

        // Update main value
        if (!Number.isNaN(textNumValue)) {
            mutatingTempInputDisplacementMs = textNumValue;
        }
    }

    /** (Move slider to tap timings median and clear the list) */
    function applyMedianHandler() {
        mutatingTempInputDisplacementMs = calculateMedianTapTimingMs();
        mutatingTapTimings = [];
    }

    /** Get the median tap timing value in milliseconds */
    function calculateMedianTapTimingMs() {
        const sortedTapTimings = mutatingTapTimings.toSorted((a, b) => a - b); // NOTE: default js comparefn compares values as string, spits increasingly negative values towards middle
        const middleIndex = Math.floor(sortedTapTimings.length / 2);
        if (mutatingTapTimings.length % 2 === 0) {
            return Math.round(((sortedTapTimings[middleIndex - 1] + sortedTapTimings[middleIndex]) / 2) * 1000);
        } else {
            return Math.round(sortedTapTimings[middleIndex] * 1000);
        }
    }

    /** (Toggle isHitsoundsEnabled) */
    function hitsoundsToggleHandler() {
        mutatingIsHitsoundsEnabled = !mutatingIsHitsoundsEnabled;
    }
</script>

<!-- Audio-visual slider bar -->
{#if step === "audio-visual"}
<div transition:fly={{ duration: 500, easing: quintOut, x: -60 }} class="row-start-1 col-start-1 flex flex-col flex-nowrap gap-3 items-center justify-start">
    <!-- Hints and text input -->
    <div class="w-full flex flex-row flex-nowrap gap-0 items-center justify-between">
        <span class="text-zinc-500 text-sm font-poppins select-none">I hear audio first</span>
        <input oninput={audioTextChangeHandler} type="text" bind:value={tempAudioDisplacementMsText} maxlength={Math.round(changeAmplitude).toString().length + 1} pattern="-?\d+" inputmode="numeric" spellcheck="false" autocomplete="off" autocorrect="off" class="absolute left-1/2 -translate-x-1/2 w-12 h-8 mb-2 text-center text-zinc-50 font-comfortaa">
        <span class="text-zinc-500 text-sm font-poppins select-none">I see visual first</span>
    </div>

    <!-- Slider -->
    <input type="range" bind:value={mutatingTempAudioDisplacementMs} min={-changeAmplitude} max={changeAmplitude} step={1} title={`${Math.round(mutatingTempAudioDisplacementMs).toString()} ms`} class="w-full bg-fuchsia h-2 mb-10 rounded-full appearance-none slider" style="--left-position: {audioSliderPositionLeft}; --right-position: {audioSliderPositionRight};">
</div>

<!-- Input slider bar -->
{:else if step === "input"}
<div transition:fly={{ duration: 500, easing: quintOut, x: 60 }} class="row-start-1 col-start-1 flex flex-col flex-nowrap gap-3 items-center justify-start">
    <!-- Buttons -->
    <div class="mb-8 flex flex-row flex-wrap gap-4">
        <button onclick={applyMedianHandler} class="h-10 px-12 rounded-full bg-zinc-400 enabled:hover:bg-zinc-300 enabled:focus-visible:bg-zinc-300 enabled:active:translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed transition duration-150 ease-circ-out font-poppins" disabled={mutatingTapTimings.length < 5}>Apply Median{mutatingTapTimings.length >= 5 ? ` (${calculateMedianTapTimingMs()} ms)` : ""}</button>
        <button onclick={hitsoundsToggleHandler} class="h-10 px-12 rounded-full bg-zinc-400 enabled:hover:bg-zinc-300 enabled:focus-visible:bg-zinc-300 enabled:active:translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed transition duration-150 ease-circ-out font-poppins">Hitsounds: {mutatingIsHitsoundsEnabled === true ? "On" : "Off"}</button>
    </div>

    <!-- Hints and text input -->
    <div class="w-full flex flex-row flex-nowrap gap-0 items-center justify-between">
        <span class="text-zinc-500 text-sm font-poppins select-none">I'm tapping early</span>
        <input oninput={inputTextChangeHandler} type="text" bind:value={tempInputDisplacementMsText} maxlength={Math.round(changeAmplitude).toString().length + 1} pattern="-?\d+" inputmode="numeric" spellcheck="false" autocomplete="off" autocorrect="off" class="absolute left-1/2 -translate-x-1/2 w-12 h-8 mb-2 text-center text-zinc-50 font-comfortaa">
        <span class="text-zinc-500 text-sm font-poppins select-none">I'm tapping late</span>
    </div>

    <!-- Slider -->
    <input type="range" bind:value={mutatingTempInputDisplacementMs} min={-changeAmplitude} max={changeAmplitude} step={1} title={`${Math.round(mutatingTempInputDisplacementMs).toString()} ms`} class="w-full bg-fuchsia h-2 rounded-full appearance-none slider" style="--left-position: {inputSliderPositionLeft}; --right-position: {inputSliderPositionRight};">

    <!-- Markers -->
    <div class="w-[calc(100%-1.25rem)] h-4 mx-[0.625rem] mb-3 -translate-y-1 grid">
        {#each mutatingTapTimings as tapTiming}
        <svg in:fly={{ duration: 150, easing: circOut, y: 30}} out:fade={{ duration: 150, easing: circOut }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="row-start-1 col-start-1 relative size-4 -translate-x-1/2 fill-zinc-300/50" style="left: calc({tapTiming / (changeAmplitude / 1000) * 0.5 + 0.5} * 100%);">
            <path fill-rule="evenodd" d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
        </svg>
        {/each}
    </div>
</div>
{/if}

<style>
    /* Slider value background */
    .slider {
        background: linear-gradient(to right, oklch(37% 0.013 285.805), oklch(37% 0.013 285.805) var(--left-position), oklch(87.1% 0.006 286.286) var(--left-position), oklch(87.1% 0.006 286.286) var(--right-position),oklch(37% 0.013 285.805) var(--right-position)); /* zinc-700, zinc-300, and zinc-700 */
    }

    /* WebKit Thumb */
    .slider::-webkit-slider-thumb {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: calc(infinity * 1px); /* rounded-full */
        background-color: oklch(87.1% 0.006 286.286); /* zinc-300 */
        transition: 200ms var(--ease-circ-out);
        -webkit-appearance: none;
    }
    .slider::-webkit-slider-thumb:hover {
        transform: scale(1.1);
    }
    .slider::-webkit-slider-thumb:active {
        transform: scale(0.92);
    }

    /* Firefox Thumb */
    .slider::-moz-range-thumb {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: calc(infinity * 1px); /* rounded-full */
        background-color: oklch(87.1% 0.006 286.286); /* zinc-300 */
        border: none;
        transition: 200ms var(--ease-circ-out);
    }
    .slider::-moz-range-thumb:hover {
        transform: scale(1.1);
    }
    .slider::-moz-range-thumb:active {
        transform: scale(0.92);
    }
</style>