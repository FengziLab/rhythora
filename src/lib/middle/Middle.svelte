<script lang="ts">
    import { global } from "$lib/system/global.svelte";
    import Home from "./screens/Home.svelte";
    import SongSelect from "./screens/SongSelect.svelte";
    import Game from "./screens/Game.svelte";
    import Editor from "./screens/Editor.svelte";
</script>

<!-- Middle section -->
<div class="w-full h-full grid">
    <!-- Screens (self-controlled animations) -->
    {#if global.screen === "home"}
    <Home />
    {:else if global.screen === "song-select"}
    <!-- TODO -->
    <SongSelect />
    {:else if global.screen === "game"}
    <!-- TODO -->
    <Game />
    {:else if global.screen === "editor"}
    <Editor />
    {/if}
</div>