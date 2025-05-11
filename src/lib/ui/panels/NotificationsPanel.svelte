<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { circOut, expoOut } from "svelte/easing";
    import { global } from "$lib/system/global.svelte";
    import { trapFocus } from "$lib/system/helpers.svelte";

    // When panel is open
    onMount(() => {
        window.addEventListener("keydown", escHandler);
    });
    onDestroy(() => {
        window.removeEventListener("keydown", escHandler);
    });

    /** (Close the notifications panel if Esc) */
    function escHandler(event: KeyboardEvent) {
        if (event.key === "Escape") {
            global.openPanel = "none";
        }
    }
</script>

<!-- Background shade -->
<!-- svelte-ignore a11y_click_events_have_key_events --> <!-- Esc key implemented in event listener -->
<!-- svelte-ignore a11y_no_static_element_interactions --> <!-- ? -->
<div onclick={() => {global.openPanel = "none"}} aria-label="Exit" transition:fade={{ duration: 300, easing: circOut }} class="absolute inset-0 w-full h-full bg-black/50"></div>

<!-- Notifications panel -->
<div transition:fly={{ duration: 500, easing: expoOut, x: 400, opacity: 1 }} use:trapFocus class="absolute right-0 inset-y-0 w-100 h-full p-8 rounded-l-3xl bg-zinc-900/80 backdrop-blur-xl border-l-1 border-zinc-800 overflow-y-auto scheme-only-dark">
    <!-- Title -->
    <h1 class="mt-10 text-zinc-50 text-2xl font-comfortaa font-medium tracking-wide select-none">Notifications</h1>

    <!-- Notifications -->
    {#if global.notifications.length > 0}
    <div class="mt-8 flex flex-col flex-nowrap gap-6"></div>

    <!-- Empty hint -->
    {:else}
    <p class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-500 text-sm font-comfortaa select-none">Nothing to see yet</p>
    {/if}
</div>