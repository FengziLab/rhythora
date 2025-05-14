<script lang="ts">
    import { setUserSetting } from "$lib/system/global.svelte";
    import type { UserSettings } from "$lib/system/types";
    let { userSettingToUpdate, value, min, max, step, displayMultiplier = 1 }: {
        userSettingToUpdate: keyof UserSettings | null,
        value: number, // NOTE: value updates when changes come from outside, but is safe changing within the scope
        min: number,
        max: number,
        step: number,
        displayMultiplier?: number
    } = $props();

    // Local states
    let textValue: string = $derived(Math.round(value * displayMultiplier).toString()); // NOTE: temporarily updatable in optimistic UI

    /** (Save to settings) */
    function rangeChangeHandler() {
        if (userSettingToUpdate !== null) {
            setUserSetting(userSettingToUpdate, value, true);
        }
    }

    /** (Validate input, change main value and save to settings) */
    function textChangeHandler() { // NOTE: code reused at CalibrationSlider
        // Filter non-numeric characters (override optimistic UI from input binding in case no derived value update)
        textValue = textValue.replace(/\D/g, "");

        // Cast to number for processing
        let textNumValue = Number(textValue);

        // Check against min/max limits (override optimistic UI from input binding in case no derived value update)
        if (textNumValue > max * displayMultiplier) {
            textNumValue = max * displayMultiplier;
            textValue = textNumValue.toString();
        } else if (textNumValue < min * displayMultiplier) {
            textNumValue = min * displayMultiplier;
            textValue = textNumValue.toString();
        }

        // Update main value
        value = textNumValue / displayMultiplier;

        // Save to settings
        if (userSettingToUpdate !== null) {
            setUserSetting(userSettingToUpdate, value, true);
        }
    }
</script>

<!-- Volume slider and text input -->
<div class="flex flex-row flex-nowrap gap-3 items-center justify-start">
    <input oninput={rangeChangeHandler} type="range" bind:value {min} {max} {step} title={`${textValue}%`} class="w-full h-8 rounded-lg appearance-none slider" style="--position: calc({(value / max) * 100 + "%"} + (({value / max}) - 0.5) * -1 * 0.625rem);">
    <input oninput={textChangeHandler} type="text" bind:value={textValue} maxlength={Math.round(max * displayMultiplier).toString().length} pattern="\d*" inputmode="numeric" spellcheck="false" autocomplete="off" autocorrect="off" class="w-10 h-8 border-b-2 border-transparent focus:border-fuchsia-300 outline-none translate-y-px transition duration-150 ease-circ-out text-center text-zinc-50 font-comfortaa">
</div>

<style>
    /* Slider value background */
    .slider {
        background:
            linear-gradient(to right, transparent var(--position), oklch(37% 0.013 285.805) var(--position)), /* zinc-700 */
            linear-gradient(to bottom, oklch(51.8% 0.253 323.949) 0%, oklch(45.2% 0.211 324.591) 100%); /* fuchsia-700 and fuchsia-800 */
    }

    /* WebKit Thumb */
    .slider::-webkit-slider-thumb {
        width: 1.25rem;
        height: 2rem;
        border-radius: 0.5rem; /* rounded-lg */
        background-color: oklch(83.3% 0.145 321.434); /* fuchsia-300 */
        transition: 150ms var(--ease-circ-out);
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
        background-color: oklch(83.3% 0.145 321.434); /* fuchsia-300 */
        border: none;
        transition: 200ms var(--ease-circ-out);
    }
    .slider::-moz-range-thumb:hover {
        transform: scale(1.2);
    }

    /* THAT'S IT I'M NOT SUPPORTING ANY MORE BROWSERS */
</style>