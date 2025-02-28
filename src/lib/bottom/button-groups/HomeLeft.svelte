<script lang="ts">
    import { setScreen } from "$lib/system/global.svelte";
</script>

<!-- Editor button -->
<button onclick={() => { setScreen("editor", true) }} class="w-44 h-18 rounded-xl bg-indigo-700 hover:bg-indigo-600 border-b-2 border-indigo-800 shadow-md shadow-indigo-800/30 active:translate-y-1 transition duration-200 ease-circ-out text-gray-100 text-lg font-poppins tracking-wide select-none">Editor</button>