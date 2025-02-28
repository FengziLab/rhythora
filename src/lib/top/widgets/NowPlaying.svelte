<script lang="ts">
    import { global } from "$lib/system/global.svelte";

    const displayText = $derived(`${global.musicPlayerData.song.name} - ${global.musicPlayerData.song.author}`);
</script>

<!-- Now Playing widget -->
<button class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex flex-row flex-nowrap gap-2 items-center justify-center">
    {#if global.musicPlayerData.isPlaying}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-100">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
    {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-100">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
    </svg>
    {/if}
    <span class="text-zinc-100 text-lg font-comfortaa tracking-wide select-none">{displayText}</span>
</button>