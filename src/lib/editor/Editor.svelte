<script lang="ts">
    import { setScreen } from "$lib/system/global.svelte";
</script>

<!-- Editor in development notice -->
<div class="w-full h-full flex flex-col flex-nowrap gap-12 items-center justify-center">
    <h1 class="text-zinc-300 text-5xl font-comfortaa tracking-wide">- In development... -</h1>
    <button onclick={() => {setScreen("home", "to-right")}} class="inline-block px-5 py-3 rounded-lg bg-zinc-700/50 hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] text-zinc-300 font-poppins select-none">Back to Home</button>
</div>