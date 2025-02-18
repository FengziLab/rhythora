<script lang="ts">
    import { setScreen } from "$lib/global.svelte";
</script>

<!-- Back button -->
<button onclick={() => { setScreen("home", true) }} class="w-36 h-18 rounded-xl bg-zinc-600/90 shadow-md shadow-zinc-800/30 active:translate-y-1 transition duration-100 ease-[ease] text-gray-100 text-lg font-poppins tracking-wide select-none">Back</button>