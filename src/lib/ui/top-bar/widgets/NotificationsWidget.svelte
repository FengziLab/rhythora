<script lang="ts">
    import { global } from "$lib/system/global.svelte";

    // Local states
    let unreadNotificationCount = $state(0);

    // Update unread count
    $effect(() => {
        unreadNotificationCount = global.notifications.filter(notification => notification.isRead === false).length;
    });
</script>

<!-- Notifications widget -->
<button onclick={() => { global.openPanel = "notifications" }} title="Notifications" aria-label="Notifications" class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex flex-row flex-nowrap gap-2 items-center justify-end">
    {#if unreadNotificationCount > 0}
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 fill-zinc-50">
        <path fill-rule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clip-rule="evenodd" />
    </svg>
    <span class="flex-1 text-zinc-50 text-lg font-comfortaa tracking-wide select-none">{unreadNotificationCount}</span>
    {:else}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
    {/if}
</button>