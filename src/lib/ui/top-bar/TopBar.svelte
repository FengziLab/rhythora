<script lang="ts">
    import { fly } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import SettingsWidget from "./widgets/SettingsWidget.svelte";
    import CreditsWidget from "./widgets/CreditsWidget.svelte";
    import NotificationsWidget from "./widgets/NotificationsWidget.svelte";
    import AccountWidget from "./widgets/AccountWidget.svelte";
    import ClockWidget from "./widgets/ClockWidget.svelte";
    import NowPlayingWidget from "./widgets/NowPlayingWidget.svelte";
    import WaitingWidget from "./widgets/WaitingWidget.svelte";
    import { global } from "$lib/system/global.svelte";
</script>

<!-- Top bar (set height) -->
{#if global.screen === "home" || global.screen === "song-select"}
<div transition:fly={{ duration: 300, easing: circOut, y: -64, opacity: 1 }} class="w-full p-2 h-16 rounded-b-xl bg-zinc-700/30 flex flex-row flex-nowrap gap-2 items-center justify-between">
    <!-- Left button group -->
    <div class="h-full flex flex-row flex-nowrap gap-2 justify-start">
        <!-- Settings widget -->
        <SettingsWidget />
        <!-- Credits widget -->
        <CreditsWidget />
    </div>

    <!-- Right button group -->
    <div class="h-full flex flex-row flex-nowrap gap-2 items-center justify-end">
        <!-- Waiting widget -->
        <WaitingWidget />
        <!-- Now Playing widget -->
        <NowPlayingWidget />
        <!-- Clock widget -->
        <ClockWidget />
        <!-- Account widget -->
        <AccountWidget />
        <!-- Notifications widget -->
        <NotificationsWidget />
    </div>
</div>
{/if}