<script lang="ts">
    import { global } from "$lib/system/global.svelte";
</script>

<!-- Waiting widget -->
<div title="Waiting... {global.waitingCount === 1 ? "(1 job)" : `(${global.waitingCount} jobs)`}" hidden={global.waitingCount <= 0} class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-50 animate-spin">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
</div>