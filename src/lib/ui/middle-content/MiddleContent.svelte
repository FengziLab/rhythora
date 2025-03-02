<script lang="ts">
    import { global } from "$lib/system/global.svelte";
    import HomeScreen from "./screens/HomeScreen.svelte";
    import SongSelectScreen from "./screens/SongSelectScreen.svelte";
    import GameScreen from "./screens/GameScreen.svelte";
    import EditorScreen from "./screens/EditorScreen.svelte";
</script>

<!-- Middle section -->
<div class="w-full h-full grid">
    <!-- Screens (self-controlled animations) -->
    {#if global.screen === "home"}
    <HomeScreen />
    {:else if global.screen === "song-select"}
    <!-- TODO -->
    <SongSelectScreen />
    {:else if global.screen === "game"}
    <!-- TODO -->
    <GameScreen />
    {:else if global.screen === "editor"}
    <EditorScreen />
    {/if}
</div>