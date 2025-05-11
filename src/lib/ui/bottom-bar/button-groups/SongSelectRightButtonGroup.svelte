<script lang="ts">
    import { global, setUserSetting, setScreen } from "$lib/system/global.svelte";
    import type { Level } from "$lib/system/types";

    // Local states
    let levelSelectedBackgroundStyles = $state("");

    // Apply the styles and react to changes
    changeStyles(global.userSettings.chosenLevel);
    $effect(() => {
        changeStyles(global.userSettings.chosenLevel);
    });

    /** Change position and color of background tile */
    function changeStyles(level: Level) {
        switch (level) {
            case "ez":
                levelSelectedBackgroundStyles = "ml-0 bg-emerald-700 border-b-2 border-emerald-800 shadow-md shadow-emerald-800/30";
                break;
            case "hd":
                levelSelectedBackgroundStyles = "ml-21.5 bg-sky-700 border-b-2 border-sky-800 shadow-md shadow-sky-800/30";
                break;
            case "in":
                levelSelectedBackgroundStyles = "ml-43 bg-violet-700 border-b-2 border-violet-800 shadow-md shadow-violet-800/30";
                break;
        }
    }
</script>

<!-- Level selector -->
<div class="h-21 p-1.5 rounded-2xl bg-zinc-800/30 inset-shadow-sm inset-shadow-zinc-950/30 overflow-clip grid">
    <!-- Selected background -->
    <div class="row-start-1 col-start-1 w-20 h-18 rounded-xl {levelSelectedBackgroundStyles} transition-all duration-300 ease-circ-out"></div>

    <!-- Option buttons -->
    <div class="row-start-1 col-start-1 flex flex-row flex-nowrap gap-1.5">
        <button onclick={() => { setUserSetting("chosenLevel", "ez", true) }} class="w-20 h-18 rounded-xl active:translate-y-1 transition duration-200 ease-circ-out flex flex-col flex-nowrap gap-0 items-center justify-center">
            <span class="text-zinc-50 text-sm text-shadow-lg font-poppins leading-tight tracking-wide select-none">EZ</span>
            <span class="text-zinc-50 text-lg text-shadow-lg font-poppins leading-tight tracking-wide select-none">3</span>
        </button>
        <button onclick={() => { setUserSetting("chosenLevel", "hd", true) }} class="w-20 h-18 rounded-xl active:translate-y-1 transition duration-200 ease-circ-out flex flex-col flex-nowrap gap-0 items-center justify-center">
            <span class="text-zinc-50 text-sm text-shadow-lg font-poppins leading-tight tracking-wide select-none">HD</span>
            <span class="text-zinc-50 text-lg text-shadow-lg font-poppins leading-tight tracking-wide select-none">7</span>
        </button>
        <button onclick={() => { setUserSetting("chosenLevel", "in", true) }} class="w-20 h-18 rounded-xl active:translate-y-1 transition duration-200 ease-circ-out flex flex-col flex-nowrap gap-0 items-center justify-center">
            <span class="text-zinc-50 text-sm text-shadow-lg font-poppins leading-tight tracking-wide select-none">IN</span>
            <span class="text-zinc-50 text-lg text-shadow-lg font-poppins leading-tight tracking-wide select-none">11</span>
        </button>
    </div>
</div>

<!-- Start button -->
<button onclick={() => { if (global.screen === "song-select") setScreen("game", "to-right") }} class="w-44 h-18 rounded-xl bg-fuchsia-700 border-b-2 border-fuchsia-800 shadow-md shadow-fuchsia-800/30 hover:brightness-115 active:translate-y-1 transition duration-200 ease-circ-out text-zinc-50 text-lg text-shadow-lg font-poppins tracking-wide select-none">Start!</button>