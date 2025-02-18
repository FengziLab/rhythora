<script lang="ts">
    import { setScreen } from "$lib/global.svelte";
</script>

<!-- Editor button -->
<button onclick={() => { setScreen("editor") }} class="w-44 h-18 rounded-xl bg-indigo-600/90 shadow-md shadow-indigo-800/30 active:translate-y-1 transition duration-100 ease-[ease] text-gray-100 text-lg font-poppins tracking-wide select-none">Editor</button>