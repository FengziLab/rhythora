<script lang="ts">
    import { setScreen } from "$lib/global.svelte";
</script>

<!--  px-[1.375rem] -->
<!-- Mode (should be level) selector -->
<div class="h-21 px-1.5 rounded-2xl bg-zinc-800/30 flex flex-row flex-nowrap gap-1.5 items-center justify-center">
    <button class="w-28 h-18 rounded-xl bg-violet-600/90 shadow-md shadow-violet-800/30 active:translate-y-1 transition duration-100 ease-[ease] text-gray-100 text-lg font-poppins tracking-wide select-none">Click</button>
    <button class="w-28 h-18 rounded-xl bg-transparent text-gray-100 text-lg font-poppins tracking-wide select-none">Scroll</button>
</div>

<!-- Start button -->
<button onclick={() => { setScreen("game") }} class="w-44 h-18 rounded-xl bg-fuchsia-600/90 shadow-md shadow-fuchsia-800/30 active:translate-y-1 transition duration-100 ease-[ease] text-gray-100 text-lg font-poppins tracking-wide select-none">Start!</button>