<script lang="ts">
    import { fade } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import Editor from "$lib/editor/Editor.svelte";
</script>

<!-- Editor screen -->
<div in:fade={{ duration: 300, delay: 100, easing: circOut }} out:fade={{ duration: 300, delay: 0, easing: circOut }} class="absolute top-0 left-0 w-full h-full">
    <Editor />
</div>