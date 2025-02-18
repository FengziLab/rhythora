<script lang="ts">
    import { setScreen } from "$lib/global.svelte";
</script>

<!-- Start button -->
<button onclick={() => { setScreen("song-confirm") }} class="w-44 h-18 rounded-xl bg-fuchsia-600/90 shadow-md shadow-fuchsia-800/30 active:translate-y-1 transition duration-100 ease-[ease] text-gray-100 text-lg font-poppins tracking-wide select-none">Start!</button>

<!-- <div class="w-44 h-20">
    <button onclick={() => { setScreen("song-confirm") }} class="w-full h-18 rounded-xl bg-fuchsia-600/90 border-b-2 border-fuchsia-900 shadow-md shadow-fuchsia-800/30 active:translate-y-1 transition duration-100 ease-[ease] text-gray-100 text-lg font-poppins tracking-wide select-none">Start!</button>
    <div class="w-full h-18 rounded-xl bg-fuchsia-600/90 border-b-2 border-fuchsia-900 shadow-md shadow-fuchsia-800/30 active:translate-y-1 transition duration-100 ease-[ease] text-gray-100 text-lg font-poppins tracking-wide select-none"></div>
</div> -->