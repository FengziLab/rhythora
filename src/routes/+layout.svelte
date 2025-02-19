<script lang="ts">
    import "../app.css";
    let { children } = $props();
    import { onMount } from "svelte";
    import { initializeAudioContext } from "$lib/system/audioContext";
    import { playRandomBackgroundMusic } from "$lib/system/audioHelpers";
    import { global } from "$lib/global.svelte";

    let introElement: HTMLDivElement;
    let startTextElement: HTMLSpanElement;
    let introOutStyles = $state(false);

    /** Disable intro and enter the game */
    function introClick() {
        // Start sounds
        initializeAudioContext();
        // TODO: play sound effect
        // playRandomBackgroundMusic();

        // Transition out intro element
        introOutStyles = true;
        setTimeout(() => {
            introElement.remove();
        }, 1000);

        // Remove intro-specific event listeners
        window.removeEventListener("click", introClick);
        window.removeEventListener("keyup", introClick);
    }

    // Can click whenever js is ready, also update hint text
    onMount(() => {
        window.addEventListener("click", introClick);
        window.addEventListener("keyup", introClick);
        startTextElement.innerHTML = "- Click anywhere to start -";
    });
</script>

<!-- Background -->
<div class="absolute top-0 left-0 w-full h-full bg-[url(/assets/background2.jpg)] bg-no-repeat bg-cover bg-center brightness-50"></div>
<div class="absolute top-0 left-0 w-full h-full {global.screen === "game" ?  "bg-black/50" : ""} backdrop-blur-3xl transition duration-1000 ease-circ-out">
    {@render children()}
</div>

<!-- Intro screen -->
<div bind:this={introElement} class="absolute top-0 left-0 w-full h-full backdrop-blur-3xl {introOutStyles ? "bg-black/0 -translate-y-full pointer-events-none" : "bg-black/50"} transition duration-1000 ease-[cubic-bezier(.18,.7,0,1)] flex flex-col flex-nowrap gap-36 items-center justify-center">
    <span class="text-zinc-100 text-8xl font-comfortaa font-medium tracking-widest">Rhythora</span>
    <span bind:this={startTextElement} class="text-zinc-100 text-lg font-poppins tracking-widest">- Loading... -</span>
</div>

<!-- Too little screen space warning screen -->
<div class="hidden absolute top-0 left-0 w-full h-full backdrop-blur-3xl bg-black/50 {global.screen !== "game" ? "max-padv:flex" : ""} flex-col flex-nowrap gap-6 items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-100">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
    </svg>
    <span class="text-zinc-100 text-lg font-poppins tracking-wide">More screen space needed</span>
</div>