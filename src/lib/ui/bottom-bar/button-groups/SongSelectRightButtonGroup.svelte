<script lang="ts">
    import { global, setScreen } from "$lib/system/global.svelte";
    import type { Level } from "$lib/system/types";

    // Local states
    let levelSelectedBackgroundStyles = $state("");

    // Apply the styles and react to changes
    changeStyles(global.chosenLevel);
    $effect(() => {
        changeStyles(global.chosenLevel);
        localStorage.setItem("chosenLevel", global.chosenLevel);
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
<div class="h-21 p-1.5 rounded-2xl bg-zinc-800/30 overflow-clip grid">
    <!-- Selected background -->
    <div class="row-start-1 col-start-1 w-20 h-18 rounded-xl {levelSelectedBackgroundStyles} transition-all duration-300 ease-circ-out"></div>

    <!-- Option buttons -->
    <div class="row-start-1 col-start-1 flex flex-row flex-nowrap gap-1.5">
        <button onclick={() => { global.chosenLevel = "ez" }} class="w-20 h-18 rounded-xl active:translate-y-1 transition duration-200 ease-circ-out flex flex-col flex-nowrap gap-0 items-center justify-center">
            <span class="text-gray-100 text-lg font-poppins leading-tight tracking-wide select-none">3</span>
            <span class="text-gray-100 text-sm font-poppins leading-tight tracking-wide select-none">EZ</span>
        </button>
        <button onclick={() => { global.chosenLevel = "hd" }} class="w-20 h-18 rounded-xl active:translate-y-1 transition duration-200 ease-circ-out flex flex-col flex-nowrap gap-0 items-center justify-center">
            <span class="text-gray-100 text-lg font-poppins leading-tight tracking-wide select-none">7</span>
            <span class="text-gray-100 text-sm font-poppins leading-tight tracking-wide select-none">HD</span>
        </button>
        <button onclick={() => { global.chosenLevel = "in" }} class="w-20 h-18 rounded-xl active:translate-y-1 transition duration-200 ease-circ-out flex flex-col flex-nowrap gap-0 items-center justify-center">
            <span class="text-gray-100 text-lg font-poppins leading-tight tracking-wide select-none">11</span>
            <span class="text-gray-100 text-sm font-poppins leading-tight tracking-wide select-none">IN</span>
        </button>
    </div>
</div>

<!-- Start button -->
<button onclick={() => { if (global.screen === "song-select") setScreen("game") }} class="w-44 h-18 rounded-xl bg-fuchsia-700 border-b-2 border-fuchsia-800 shadow-md shadow-fuchsia-800/30 hover:brightness-115 active:translate-y-1 transition duration-200 ease-circ-out text-gray-100 text-lg font-poppins tracking-wide select-none">Start!</button>