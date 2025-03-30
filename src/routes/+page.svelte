<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import FlashEffect from "$lib/ui/misc/FlashEffect.svelte";
    import TopBar from "$lib/ui/top-bar/TopBar.svelte";
    import MiddleContent from "$lib/ui/middle-content/MiddleContent.svelte";
    import BottomBar from "$lib/ui/bottom-bar/BottomBar.svelte";
    import SettingsPanel from "$lib/ui/panels/SettingsPanel.svelte";
    import DebugPanel from "$lib/ui/misc/DebugPanel.svelte";
    import { audioContext, initializeAudioContext } from "$lib/system/audio-system";
    import { playRandomBackgroundMusic } from "$lib/system/audio-helpers";
    import { global, setScreen } from "$lib/system/global.svelte";

    // Local states
    let introElement: HTMLDivElement;
    let introStartTextElement: HTMLSpanElement;
    let isIntroOutStylesEnabled = $state(false);
    let isDebugPanelShown = $state(false);

    // When js is ready
    onMount(async () => {
        // Try to apply settings from localStorage
        const storedMusicVolume = localStorage.getItem("userSettings.musicVolume");
        if (storedMusicVolume !== null) {
            global.userSettings.musicVolume = parseFloat(storedMusicVolume);
        }
        const storedSoundEffectsVolume = localStorage.getItem("userSettings.soundEffectsVolume");
        if (storedSoundEffectsVolume !== null) {
            global.userSettings.soundEffectsVolume = parseFloat(storedSoundEffectsVolume);
        }
        const storedHitsoundsVolume = localStorage.getItem("userSettings.hitsoundsVolume");
        if (storedHitsoundsVolume !== null) {
            global.userSettings.hitsoundsVolume = parseFloat(storedHitsoundsVolume);
        }
        const storedLatency = localStorage.getItem("userSettings.latency");
        if (storedLatency !== null) {
            global.userSettings.latency = parseInt(storedLatency);
        }
        const storedFPSCounter = localStorage.getItem("userSettings.fpsCounter");
        if (storedFPSCounter === "true") {
            global.userSettings.fpsCounter = true;
        } else if (storedFPSCounter === "false") {
            global.userSettings.fpsCounter = false;
        }
        const storedBackgroundFlashEffect = localStorage.getItem("userSettings.backgroundFlashEffect");
        if (storedBackgroundFlashEffect === "true") {
            global.userSettings.backgroundFlashEffect = true;
        } else if (storedBackgroundFlashEffect === "false") {
            global.userSettings.backgroundFlashEffect = false;
        }
        const storedChosenLevel = localStorage.getItem("chosenLevel");
        if (storedChosenLevel === "ez") {
            global.chosenLevel = "ez";
        } else if (storedChosenLevel === "hd") {
            global.chosenLevel = "hd";
        } else if (storedChosenLevel === "in") {
            global.chosenLevel = "in";
        }

        // Can click and start game, also update hint text    
        introElement.addEventListener("click", introClick);
        introElement.addEventListener("keyup", introClick);
        global.waitingCount--;
        introStartTextElement.innerHTML = "- Click anywhere to start -";

        // Game-wise keydown listener
        window.addEventListener("keydown", event => {
            // Debug panel control
            if (event.key === "Backspace" && !(document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA")) {
                isDebugPanelShown = !isDebugPanelShown;
            }

            // Global main button and back button
            else if (event.key === "Enter" && event.target === document.body) {
                switch (global.screen) {
                    case "home":
                        setScreen("song-select");
                        break;
                    case "song-select":
                        setScreen("game");
                        break;
                    case "editor":
                        setScreen("home");
                }
            } else if (event.key === "Escape" && event.target === document.body) {
                switch (global.screen) {
                    case "song-select":
                        setScreen("home", true);
                        break;
                    case "game":
                        // if (global.gameScreenStatus === "loading") {
                        //     setScreen("song-select", true);
                        // } // TODO
                        break;
                    case "editor":
                        setScreen("home");
                        break;
                }
            } else if (event.key === "Escape") {
                (document.activeElement as HTMLElement).blur(); // NOTE: the activeElement is probably an HTMLElement so make ts happy
            }
        });

        // Start loading random background music (assume audioContext is suspended instead of starting source on user input since creating music source can take time) (TODO: actually just depends on if i want to ensure initial bgm loads before intro screen can go up)
        // await playRandomBackgroundMusic(-1); // DEBUG
    });

    /** Event handler to disable intro and enter the game */
    async function introClick() {
        // Remove intro-specific event listeners
        introElement.removeEventListener("click", introClick);
        introElement.removeEventListener("keyup", introClick);

        // Ensure audio is playable since this is first user event and start sounds
        initializeAudioContext();
        if (audioContext!.state === "suspended") await audioContext!.resume(); // NOTE: guaranteed audioContext so make ts happy
        // TODO: play sound effect

        // Transition out intro element
        isIntroOutStylesEnabled = true;
        setTimeout(() => {
            introElement.remove();
        }, 1000);
    }
</script>

<svelte:head>
    <title>Rhythora</title>
    <!-- <meta name="description" content="Tap the keyboard to the beat!"> -->
    <meta name="keywords" content="rhythora,rhythm game,music game,fengzi lab,online,free">
    <meta name="theme-color" content="oklch(0.401 0.17 325.612)"> <!-- fuchsia-900 -->
    <!-- <link rel="preconnect" href="https://api.rhythora.com" /> -->
</svelte:head>

<!-- Background -->
<div class="absolute inset-0 w-full h-full bg-[url(/assets/background-0.jpg)] bg-no-repeat bg-cover bg-center brightness-60"></div>
<!-- {#if (global.gameScreenStatus !== "inactive" && global.gameScreenStatus !== "loading")}
<div transition:fade={{ duration: 500 }} class="absolute inset-0 w-full h-full bg-[url(/assets/background-1.jpg)] bg-no-repeat bg-cover bg-center brightness-50"></div>
{/if} -->
<div class="absolute inset-0 w-full h-full {global.screen === "game" ?  "bg-black/50" : ""} backdrop-blur-3xl transition duration-1000 ease-circ-out overflow-clip">
    <!-- Background music flashing effect -->
    <FlashEffect />

    <!-- Page layout -->
    <div class="w-full h-full flex flex-col flex-nowrap">
        <!-- Top bar (fixed height, self-controlled) -->
        <TopBar />

        <!-- Middle content (fill height) -->
        <MiddleContent />

        <!-- Bottom bar (fixed height, self-controlled) -->
        <BottomBar />
    </div>
</div>

<!-- Panels -->
{#if global.openPanel === "settings"}
<SettingsPanel />
<!-- {:else if global.openPanel === "notifications"} -->

{/if}

<!-- Intro screen -->
<div bind:this={introElement} class="absolute inset-0 w-full h-full backdrop-blur-3xl {isIntroOutStylesEnabled === true ? "bg-black/0 -translate-y-full pointer-events-none" : "bg-black/50"} transition duration-1000 ease-[cubic-bezier(.18,.7,0,1)] flex flex-col flex-nowrap gap-36 items-center justify-center" hidden> <!-- DEBUG -->
    <span class="text-zinc-50 text-8xl font-comfortaa font-medium tracking-widest select-none">Rhythora</span>
    <span bind:this={introStartTextElement} class="text-zinc-50 text-lg font-poppins tracking-widest select-none">- Loading... -</span>
</div>

<!-- Too little screen space warning screen -->
<div class="hidden absolute inset-0 w-full h-full backdrop-blur-3xl bg-black/50 {global.screen !== "game" ? "max-padv:flex" : ""} flex-col flex-nowrap gap-6 items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
    </svg>
    <span class="text-zinc-50 text-lg font-poppins tracking-wide">More screen space needed</span>
</div>

<!-- Debug panel -->
{#if isDebugPanelShown === true}
<DebugPanel />
{/if}