<script lang="ts">
    import Top from "$lib/top/Top.svelte";
    import Bottom from "$lib/bottom/Bottom.svelte";
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
    <div class="w-full h-full p-4">
        <!-- Content box -->
        <div class="w-[76%] max-padh:w-[85%] max-padv:w-full max-w-600 mx-auto mt-12 flex flex-col flex-nowrap gap-8">
            <!-- Title -->
            <!-- <h1 class="mt-42 text-center text-zinc-300 text-5xl font-comfortaa tracking-wide">- Welcome to Rhythora -</h1> -->

            <!-- Welcome content -->
            <div class="w-full h-16 rounded-xl bg-zinc-700/30 border-b-3 border-zinc-700/30 hidden items-center justify-center">
                <span class="text-zinc-100 text-lg font-poppins tracking-wide">Welcome to Rhythora!</span>
            </div>

            <!-- Split block -->
            <div class="w-full hidden flex-row flex-nowrap gap-8">
                <!-- Update content -->
                <div class="w-full h-60 rounded-xl bg-zinc-700/30 border-b-3 border-zinc-700/30 flex items-center justify-center">
                    <span class="text-zinc-100 text-lg font-poppins tracking-wide">Changelog</span>
                </div>
                <!-- Update content -->
                <div class="w-full h-60 rounded-xl bg-zinc-700/30 border-b-3 border-zinc-700/30 flex items-center justify-center">
                    <span class="text-zinc-100 text-lg font-poppins tracking-wide">Tutorial</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Bottom bar (fixed height, self-controlled) -->
    <Bottom />
</div>