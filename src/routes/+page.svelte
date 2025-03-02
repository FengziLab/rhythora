<script lang="ts">
    import { onMount } from "svelte";
    import FlashEffect from "$lib/system/FlashEffect.svelte";
    import TopBar from "$lib/ui/top-bar/TopBar.svelte";
    import MiddleContent from "$lib/ui/middle-content/MiddleContent.svelte";
    import BottomBar from "$lib/ui/bottom-bar/BottomBar.svelte";
    import DebugPanel from "$lib/system/DebugPanel.svelte";
    import { initializeAudioContext } from "$lib/system/audioContext";
    import { playRandomBackgroundMusic } from "$lib/system/audioHelpers";
    import { global } from "$lib/system/global.svelte";

    // Local states
    let introElement: HTMLDivElement;
    let introStartTextElement: HTMLSpanElement;
    let isIntroOutStylesEnabled = $state(false);
    let flashEffectElement: FlashEffect;
    let isDebugPanelShown = $state(false);

    /** Event handler to disable intro and enter the game */
    function introClick() {
        // Remove intro-specific event listeners
        window.removeEventListener("click", introClick);
        window.removeEventListener("keyup", introClick);

        // Start sounds
        initializeAudioContext();
        // TODO: play sound effect
        // playRandomBackgroundMusic();

        // Transition out intro element
        isIntroOutStylesEnabled = true;
        setTimeout(() => {
            introElement.remove();
        }, 1000);

        // Background flashing effect
        flashEffectElement.start();
    }

    // When js is ready
    onMount(() => {
        // Can click and start game, also update hint text    
        window.addEventListener("click", introClick);
        window.addEventListener("keyup", introClick);
        introStartTextElement.innerHTML = "- Click anywhere to start -";
        
        // Debug panel control
        window.addEventListener("keydown", event => {
            if (event.key === "Backspace") {
                isDebugPanelShown = !isDebugPanelShown;
            }
        });
    });
</script>

<svelte:head>
    <title>Rhythora</title>
    <!-- <meta name="description" content="Tap the keyboard to the beat!"> -->
    <meta name="keywords" content="rhythora,rhythm game,music game,fengzi lab,online,free">
    <meta name="theme-color" content="oklch(0.401 0.17 325.612)"> <!-- fuchsia-900 -->
    <!-- <link rel="preconnect" href="https://api.rhythora.com" /> -->
</svelte:head>

<!-- Background -->
<div class="absolute top-0 left-0 w-full h-full bg-[url(/assets/background2.jpg)] bg-no-repeat bg-cover bg-center brightness-50"></div>
<div class="absolute top-0 left-0 w-full h-full {global.screen === "game" ?  "bg-black/50" : ""} backdrop-blur-3xl transition duration-1000 ease-circ-out overflow-clip">
    <!-- Background music flashing effect -->
    <FlashEffect bind:this={flashEffectElement} />

    <!-- Page layout -->
    <div class="w-full h-full flex flex-col flex-nowrap">
        <!-- Top bar (fixed height, self-controlled) -->
        <TopBar />

        <!-- Middle content (fill height) -->
        <MiddleContent />

        <!-- Bottom bar (fixed height, self-controlled) -->
        <BottomBar />
    </div>

    <!-- Debug panel -->
    {#if isDebugPanelShown === true}
        <DebugPanel />
    {/if}
</div>

<!-- Intro screen -->
<div bind:this={introElement} class="absolute top-0 left-0 w-full h-full backdrop-blur-3xl {isIntroOutStylesEnabled === true ? "bg-black/0 -translate-y-full pointer-events-none" : "bg-black/50"} transition duration-1000 ease-[cubic-bezier(.18,.7,0,1)] flex flex-col flex-nowrap gap-36 items-center justify-center" hidden> <!-- DEBUG -->
    <span class="text-zinc-100 text-8xl font-comfortaa font-medium tracking-widest">Rhythora</span>
    <span bind:this={introStartTextElement} class="text-zinc-100 text-lg font-poppins tracking-widest">- Loading... -</span>
</div>

<!-- Too little screen space warning screen -->
<div class="hidden absolute top-0 left-0 w-full h-full backdrop-blur-3xl bg-black/50 {global.screen !== "game" ? "max-padv:flex" : ""} flex-col flex-nowrap gap-6 items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-100">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
    </svg>
    <span class="text-zinc-100 text-lg font-poppins tracking-wide">More screen space needed</span>
</div>