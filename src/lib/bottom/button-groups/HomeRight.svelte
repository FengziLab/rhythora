<script lang="ts">
    import { setScreen } from "$lib/system/global.svelte";
</script>

<!-- Start button -->
<button onclick={() => { setScreen("song-select") }} class="w-44 h-18 rounded-xl bg-fuchsia-700 hover:bg-fuchsia-600 border-b-2 border-fuchsia-800 shadow-md shadow-fuchsia-800/30 active:translate-y-1 transition duration-200 ease-circ-out text-gray-100 text-lg font-poppins tracking-wide select-none">Play</button>