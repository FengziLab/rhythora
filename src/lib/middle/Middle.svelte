<script lang="ts">
    import { global } from "$lib/global.svelte";
    import Home from "./screens/Home.svelte";
    import SongSelect from "./screens/SongSelect.svelte";
    import Game from "./screens/Game.svelte";
    import Editor from "./screens/Editor.svelte";
</script>

<div class="w-full h-full">
    {#if global.screen === "home"}
    <Home />
    {:else if global.screen === "song-select" || global.screen === "song-confirm"}
    <SongSelect />
    {:else if global.screen === "game"}
    <Game />
    {:else if global.screen === "editor"}
    <Editor />
    {/if}
</div>