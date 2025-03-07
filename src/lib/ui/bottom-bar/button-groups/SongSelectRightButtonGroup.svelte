<script lang="ts">
    import { setScreen } from "$lib/system/global.svelte";
</script>

<!-- Mode (should be level) selector -->
<div class="h-21 px-1.5 rounded-2xl bg-zinc-800/30 flex flex-row flex-nowrap gap-1.5 items-center justify-center">
    <button class="w-20 h-18 rounded-xl bg-transparent text-gray-100 text-lg font-poppins tracking-wide select-none">3</button>
    <button class="w-20 h-18 rounded-xl bg-violet-700 hover:bg-violet-600 border-b-2 border-violet-800 shadow-md shadow-violet-800/30 active:translate-y-1 transition duration-200 ease-circ-out text-gray-100 text-lg font-poppins tracking-wide select-none">7</button>
    <button class="w-20 h-18 rounded-xl bg-transparent text-gray-100 text-lg font-poppins tracking-wide select-none">11</button>
</div>

<!-- Start button -->
<button onclick={() => { setScreen("game") }} class="w-44 h-18 rounded-xl bg-fuchsia-700 hover:bg-fuchsia-600 border-b-2 border-fuchsia-800 shadow-md shadow-fuchsia-800/30 active:translate-y-1 transition duration-200 ease-circ-out text-gray-100 text-lg font-poppins tracking-wide select-none">Start!</button>