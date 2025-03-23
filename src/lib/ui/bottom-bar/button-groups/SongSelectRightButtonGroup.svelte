<script lang="ts">
    import { global, setScreen } from "$lib/system/global.svelte";
</script>

<!-- Level selector -->
<div class="h-21 px-1.5 rounded-2xl bg-zinc-800/30 flex flex-row flex-nowrap gap-1.5 items-center justify-center">
    <button class="w-20 h-18 rounded-xl active:translate-y-1 transition duration-200 ease-circ-out flex flex-col flex-nowrap gap-0 items-center justify-center">
        <span class="text-gray-100 text-lg font-poppins leading-tight tracking-wide select-none">3</span>
        <span class="text-gray-100 text-sm font-poppins leading-tight tracking-wide select-none">EZ</span>
    </button>
    <button class="w-20 h-18 rounded-xl bg-violet-700 hover:bg-violet-600 border-b-2 border-violet-800 shadow-md shadow-violet-800/30 active:translate-y-1 transition duration-200 ease-circ-out flex flex-col flex-nowrap gap-0 items-center justify-center">
        <span class="text-gray-100 text-lg font-poppins leading-tight tracking-wide select-none">7</span>
        <span class="text-gray-100 text-sm font-poppins leading-tight tracking-wide select-none">HD</span>
    </button>
    <button class="w-20 h-18 rounded-xl active:translate-y-1 transition duration-200 ease-circ-out flex flex-col flex-nowrap gap-0 items-center justify-center">
        <span class="text-gray-100 text-lg font-poppins leading-tight tracking-wide select-none">11</span>
        <span class="text-gray-100 text-sm font-poppins leading-tight tracking-wide select-none">IN</span>
    </button>
</div>

<!-- Start button -->
<button bind:this={global.mainButtonElement} onclick={() => { if (global.screen === "song-select") setScreen("game") }} class="w-44 h-18 rounded-xl bg-fuchsia-700 hover:bg-fuchsia-600 border-b-2 border-fuchsia-800 shadow-md shadow-fuchsia-800/30 active:translate-y-1 transition duration-200 ease-circ-out text-gray-100 text-lg font-poppins tracking-wide select-none">Start!</button>