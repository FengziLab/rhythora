<script lang="ts">
    import HomeScreen from "./screens/HomeScreen.svelte";
    import SongSelectScreen from "./screens/SongSelectScreen.svelte";
    import GameScreen from "./screens/GameScreen.svelte";
    import EditorScreen from "./screens/EditorScreen.svelte";
    import CalibrationScreen from "./screens/CalibrationScreen.svelte";
    import { global } from "$lib/system/global.svelte";
</script>

<!-- Middle section -->
<div class="w-full h-full grid">
    <!-- Screens (self-controlled animations) -->
    {#if global.screen === "home"}
    <HomeScreen />
    {:else if global.screen === "song-select"}
    <SongSelectScreen />
    {:else if global.screen === "game"}
    <GameScreen />
    {:else if global.screen === "editor"}
    <EditorScreen />
    {:else if global.screen === "calibration"}
    <CalibrationScreen />
    {/if}
</div>