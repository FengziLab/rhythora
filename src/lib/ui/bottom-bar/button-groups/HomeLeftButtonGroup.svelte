<script lang="ts">
    import { global, setScreen } from "$lib/system/global.svelte";
</script>

<!-- Editor button -->
<button onclick={() => { if (global.screen === "home") setScreen("editor", "to-left") }} class="w-44 h-18 rounded-xl bg-indigo-700 border-b-2 border-indigo-800 shadow-md shadow-indigo-800/30 hover:brightness-115 active:translate-y-1 transition duration-200 ease-circ-out text-zinc-50 text-lg text-shadow-lg font-poppins tracking-wide select-none">Editor</button>