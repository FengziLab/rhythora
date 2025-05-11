<script lang="ts">
    import { playRandomBackgroundMusic, pauseMusic, resumeMusic } from "$lib/system/audio-helpers";
    import { global } from "$lib/system/global.svelte";

    // Local states
    const displayText = $derived(`${global.musicPlayerData.song.name} - ${global.musicPlayerData.song.author}`);

    /** Toggle music pausing */
    function toggleMusicPause() {
        if (global.musicPlayerData.isPlaying === true) {
            pauseMusic(0.5);
        } else {
            if (resumeMusic(0.5) === false) {
                playRandomBackgroundMusic(-1);
            }
        }
    }
</script>

<!-- Now Playing widget -->
<button onclick={toggleMusicPause} title={global.musicPlayerData.isPlaying === true ? "Pause" : "Play"} aria-label={global.musicPlayerData.isPlaying === true ? "Pause" : "Play"} class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex flex-row flex-nowrap gap-2 items-center justify-center">
    {#if global.musicPlayerData.isPlaying === true}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
    {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
    </svg>
    {/if}
    <span class="flex-1 text-zinc-50 text-lg font-comfortaa tracking-wide select-none">{displayText}</span>
</button>