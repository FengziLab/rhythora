<script lang="ts">
    import Top from "$lib/top/Top.svelte";
    import Bottom from "$lib/bottom/Bottom.svelte";
    import Middle from "$lib/middle/Middle.svelte";
</script>

<svelte:head>
    <title>Rhythora</title>
    <meta name="description" content="Fast, simple, and secure file transfer.">
    <meta name="keywords" content="rhythora,rhythm game,music game,fengzi lab,online,free">
    <meta name="theme-color" content="oklch(0.518 0.253 323.949)"> <!-- fuchsia-700 -->
    <!-- <link rel="preconnect" href="https://api.rhythora.com" /> -->
</svelte:head>

<!-- Page layout -->
<div class="w-full h-full flex flex-col flex-nowrap overflow-clip">
    <!-- Top bar (fixed height, self-controlled) -->
    <Top />

    <!-- Middle (fill height) -->
    <Middle />

    <!-- Bottom bar (fixed height, self-controlled) -->
    <Bottom />
</div>