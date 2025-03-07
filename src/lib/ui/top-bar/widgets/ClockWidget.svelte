<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    // Local states
    let timeText = $state("");
    let updateIntervalID: number;

    /** Update the displayed time in timer */
    function updateTime() {
        const now = new Date();
        const hour = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
        const minute = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
        const second = now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
        timeText = `${hour}:${minute}:${second}`;
    }

    // Call update
    onMount(() => {
        updateTime();
        updateIntervalID = setInterval(updateTime, 1000);
    });
    onDestroy(() => {
        clearInterval(updateIntervalID);
    })
</script>

<!-- Clock widget -->
<div class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex flex-row flex-nowrap gap-2 items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-100">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
    <span class="w-20 text-center text-zinc-100 text-lg font-comfortaa tracking-wide select-none">{timeText}</span>
</div>