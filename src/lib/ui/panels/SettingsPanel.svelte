<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { circOut, expoOut } from "svelte/easing";
    import Slider from "../misc/Slider.svelte";
    import { global, setScreen, setUserSetting } from "$lib/system/global.svelte";

    // When panel is open
    onMount(() => {
        window.addEventListener("keydown", escHandler);
    });
    onDestroy(() => {
        window.removeEventListener("keydown", escHandler);
    });

    /** (Close the settings panel if Esc) */
    function escHandler(event: KeyboardEvent) {
        if (event.key === "Escape") {
            global.openPanel = "none";
        }
    }

    /** (Switch calibration screen after setting return screen and close the panel) */
    function calibrateLatencyHandler() {
        global.returnScreen = global.screen;
        setScreen("calibration", "fade");
        global.openPanel = "none";
    }
</script>

<!-- Background shade -->
<!-- svelte-ignore a11y_click_events_have_key_events --> <!-- Esc key implemented in event listener -->
<!-- svelte-ignore a11y_no_static_element_interactions --> <!-- ? -->
<div onclick={() => {global.openPanel = "none"}} aria-label="Exit" transition:fade={{ duration: 300, easing: circOut }} class="absolute inset-0 w-full h-full bg-black/50"></div>

<!-- Settings panel -->
<div transition:fly={{ duration: 500, easing: expoOut, x: -400, opacity: 1 }} class="absolute left-0 inset-y-0 w-100 h-full p-8 rounded-r-3xl bg-zinc-900/80 backdrop-blur-xl border-r-1 border-zinc-800 overflow-y-auto scheme-only-dark">
    <!-- Title -->
    <h1 class="mt-10 text-zinc-50 text-2xl font-comfortaa font-medium tracking-wide select-none">Settings</h1>

    <!-- Settings -->
    <div class="mt-12 flex flex-col flex-nowrap gap-10">
        <div class="w-full flex flex-col flex-nowrap gap-2">
            <p class="text-zinc-50 font-comfortaa tracking-wide select-none">Music Volume (%)</p>
            <Slider userSettingToUpdate="musicVolume" value={global.userSettings.musicVolume} min={0} max={1} step={0.01} displayMultiplier={100} />
        </div>
        <div class="w-full flex flex-col flex-nowrap gap-2">
            <p class="text-zinc-50 font-comfortaa tracking-wide select-none">Sound Effects Volume (%)</p>
            <Slider userSettingToUpdate="soundEffectsVolume" value={global.userSettings.soundEffectsVolume} min={0} max={1} step={0.01} displayMultiplier={100} />
        </div>
        <div class="w-full flex flex-col flex-nowrap gap-2">
            <p class="text-zinc-50 font-comfortaa tracking-wide select-none">Hitsounds Volume (%)</p>
            <Slider userSettingToUpdate="hitsoundsVolume" value={global.userSettings.hitsoundsVolume} min={0} max={1} step={0.01} displayMultiplier={100} />
        </div>
        <div class="w-full flex flex-col flex-nowrap gap-2">
            <p class="text-zinc-50 font-comfortaa tracking-wide select-none">Latency</p>
            <button onclick={calibrateLatencyHandler} class="w-full h-12 rounded-full bg-fuchsia-800 hover:brightness-115 active:translate-y-1 transition duration-150 ease-circ-out text-zinc-50 font-poppins tracking-wide select-none">Calibrate Latency</button>
        </div>
        <!-- <div class="w-full flex flex-col flex-nowrap gap-2">
            <p class="text-zinc-50 font-comfortaa tracking-wide select-none">Auto Fullscreen</p>
            <select bind:value={global.userSettings.autoFullscreen} class="w-full h-8 px-3 rounded-lg bg-zinc-700 outline-none dropdown-arrow appearance-none text-zinc-50 font-comfortaa tracking-wide select-none">
                <option value="off">Off</option>
                <option value="on-intro">Upon entering</option>
                <option value="on-game">When game starts</option>
                <option value="both">Both</option>
            </select>
        </div> -->
        <div class="mt-4 w-full flex flex-row flex-nowrap gap-0 items-center justify-between">
            <p class="text-zinc-50 font-comfortaa tracking-wide select-none">In-game FPS Counter</p>
            <input type="button" onclick={() => { setUserSetting("fpsCounter", !global.userSettings.fpsCounter, true) }} title={global.userSettings.fpsCounter === true ? "Enabled" : "Disabled"} class="w-14 h-6 rounded-full { global.userSettings.fpsCounter === true ? "bg-fuchsia-700" : "bg-fuchsia-700/10" } border-2 border-fuchsia-700 hover:shadow-lg shadow-fuchsia-700/30 active:translate-y-0.5 transition duration-100 ease-circ-out" />
        </div>
        <div class="w-full flex flex-row flex-nowrap gap-0 items-center justify-between">
            <p class="text-zinc-50 font-comfortaa tracking-wide select-none">Background Flash Effect</p>
            <input type="button" onclick={() => { setUserSetting("backgroundFlashEffect", !global.userSettings.backgroundFlashEffect, true) }} title={global.userSettings.backgroundFlashEffect === true ? "Enabled" : "Disabled"} class="w-14 h-6 rounded-full { global.userSettings.backgroundFlashEffect === true ? "bg-fuchsia-700" : "bg-fuchsia-700/10" } border-2 border-fuchsia-700 hover:shadow-lg shadow-fuchsia-700/30 active:translate-y-0.5 transition duration-100 ease-circ-out" />
        </div>
    </div>

    <!-- Info -->
    <div class="mt-16 flex flex-col flex-nowrap gap-0">
        <p class="text-center text-zinc-500 text-sm font-comfortaa select-none">Rhythora Beta 20250406</p>
        <p class="text-center text-zinc-500 text-sm font-comfortaa select-none">A <a href="https://fengzi.dev/" target="_blank" rel="noreferrer" class="hover:text-zinc-400 transition transition-100 ease-circ-out">Fengzi Lab</a> project</p>
    </div>
</div>

<!-- <style>
    .dropdown-arrow {
        background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="oklch(0.985 0 0)"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>'); /* zinc-300 */
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        background-size: 1.25rem;
    }
</style> -->