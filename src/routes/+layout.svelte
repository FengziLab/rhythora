<script lang="ts">
    import "../app.css";
    let { children } = $props();
</script>

<!-- Base -->
<div class="w-full h-full touch-manipulation selection:bg-fuchsia-700 selection:text-zinc-50">
    {@render children()}
</div>