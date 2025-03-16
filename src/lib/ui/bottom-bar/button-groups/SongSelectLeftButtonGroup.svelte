<script lang="ts">
    import { setScreen } from "$lib/system/global.svelte";
</script>

<!-- Back button -->
<button onclick={() => { setScreen("home", true) }} class="w-40 h-18 rounded-xl bg-zinc-700 hover:bg-zinc-600 border-b-2 border-zinc-800 shadow-md shadow-zinc-800/30 active:translate-y-1 transition duration-200 ease-circ-out text-gray-100 text-lg font-poppins tracking-wide select-none">Back</button>