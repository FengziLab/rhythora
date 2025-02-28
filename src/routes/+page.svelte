<script lang="ts">
    import { onMount } from "svelte";
    import Top from "$lib/top/Top.svelte";
    import Middle from "$lib/middle/Middle.svelte";
    import Bottom from "$lib/bottom/Bottom.svelte";
    import DebugPanel from "$lib/system/DebugPanel.svelte";

    // Debug panel control
    let isDebugPanelShown = $state(false);
    onMount(() => {
        window.addEventListener("keydown", event => {
            if (event.key === "Backspace") {
                isDebugPanelShown = !isDebugPanelShown;
            }
        });
    });
</script>

<svelte:head>
    <title>Rhythora</title>
    <!-- <meta name="description" content="Tap the keyboard to the beat!"> -->
    <meta name="keywords" content="rhythora,rhythm game,music game,fengzi lab,online,free">
    <meta name="theme-color" content="oklch(0.401 0.17 325.612)"> <!-- fuchsia-900 -->
    <!-- <link rel="preconnect" href="https://api.rhythora.com" /> -->
</svelte:head>

<!-- Page layout -->
<div class="w-full h-full flex flex-col flex-nowrap">
    <!-- Top bar (fixed height, self-controlled) -->
    <Top />

    <!-- Middle (fill height) -->
    <Middle />

    <!-- Bottom bar (fixed height, self-controlled) -->
    <Bottom />
</div>

<!-- Debug panel -->
{#if isDebugPanelShown === true}
    <DebugPanel />
{/if}