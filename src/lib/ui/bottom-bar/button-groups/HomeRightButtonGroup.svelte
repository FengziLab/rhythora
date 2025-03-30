<script lang="ts">
    import { global, setScreen } from "$lib/system/global.svelte";
</script>

<!-- Start button -->
<button onclick={() => { if (global.screen === "home") setScreen("song-select") }} class="w-44 h-18 rounded-xl bg-fuchsia-700 border-b-2 border-fuchsia-800 shadow-md shadow-fuchsia-800/30 hover:brightness-115 active:translate-y-1 transition duration-200 ease-circ-out text-gray-100 text-lg font-poppins tracking-wide select-none">Play</button>