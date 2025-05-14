<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import FlashEffect from "$lib/ui/misc/FlashEffect.svelte";
    import TopBar from "$lib/ui/top-bar/TopBar.svelte";
    import MiddleContent from "$lib/ui/middle-content/MiddleContent.svelte";
    import BottomBar from "$lib/ui/bottom-bar/BottomBar.svelte";
    import SettingsPanel from "$lib/ui/panels/SettingsPanel.svelte";
    import NotificationsPanel from "$lib/ui/panels/NotificationsPanel.svelte";
    import DebugPanel from "$lib/ui/misc/DebugPanel.svelte";
    import { audioContext, initializeAudioSystem } from "$lib/system/audio-system";
    import { playRandomBackgroundMusic, resumeMusic } from "$lib/system/audio-helpers";
    import { global, loadUserSettings, setScreen } from "$lib/system/global.svelte";

    // Local states
    let introElement: HTMLDivElement;
    let introStartTextElement: HTMLSpanElement;
    let isIntroOutStylesEnabled = $state(false);

    // When js is ready
    onMount(async () => {
        // Try to apply settings from localStorage
        loadUserSettings();

        // Can click and start game, also update hint text    
        introElement.addEventListener("click", introClickHandler);
        introElement.addEventListener("keyup", introClickHandler);
        global.waitingCount--;
        introStartTextElement.innerHTML = "- Click anywhere to start -";

        // App-wide keydown listener
        window.addEventListener("keydown", event => {
            // Debug panel control
            if (event.key === "Backspace" && !(document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA")) {
                global.isDebugPanelShowing = !global.isDebugPanelShowing;
            }

            // Settings shortcut
            else if (event.ctrlKey === true && event.key === "s") {
                event.preventDefault();
                global.openPanel = global.openPanel !== "settings" ? "settings" : "none";
            }

            // Global main button and back button
            else if (event.key === "Enter" && event.target === document.body) {
                switch (global.screen) {
                    case "home":
                        setScreen("song-select", "to-right");
                        break;
                    case "song-select":
                        setScreen("game", "to-right");
                        break;
                    case "editor":
                        setScreen("home", "to-right");
                        break;
                }
            } else if (event.key === "Escape" && event.target === document.body) {
                switch (global.screen) {
                    case "song-select":
                        setScreen("home", "to-left");
                        break;
                    // case "game": // TODO
                    //     if (global.gameScreenStatus === "loading") {
                    //         setScreen("song-select", "to-left");
                    //     }
                    //     break;
                    case "editor":
                        setScreen("home", "to-right");
                        break;
                }
            }

            // Escape focus
            else if (event.key === "Escape") {
                (document.activeElement as HTMLElement).blur(); // NOTE: the activeElement is probably an HTMLElement so make ts happy
            }
        });

        // Start loading random background music (assume audioContext is suspended instead of starting source on user input since creating music source can take time) (TODO: actually just depends on if i want to ensure initial bgm loads before intro screen can go up)
        // await playRandomBackgroundMusic(-1); // DEBUG
    });

    /** (Remove intro-specific event listeners, start sounds, and fade away) */
    async function introClickHandler() {
        // Remove intro-specific event listeners
        introElement.removeEventListener("click", introClickHandler);
        introElement.removeEventListener("keyup", introClickHandler);

        // Ensure audio is playable since this is first user event and start sounds
        initializeAudioSystem();
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
    <meta name="theme-color" content="oklch(45.2% 0.211 324.591)"> <!-- fuchsia-800 -->
    <!-- <link rel="preconnect" href="https://api.rhythora.com" /> -->
</svelte:head>

<!-- Backgrounds -->
<div class="absolute inset-0 w-full h-full bg-[url(/assets/backgrounds/background-0.jpg)] bg-no-repeat bg-cover bg-center brightness-70"></div>
{#if (global.gameScreenStatus !== "inactive" && global.gameScreenStatus !== "loading") || global.screen === "calibration"}
<div in:fade={{ duration: 1000 }} out:fade={{ duration: 500, easing: circOut }} class="absolute inset-0 w-full h-full bg-[url(/assets/backgrounds/background-1.jpg)] bg-no-repeat bg-cover bg-center brightness-50"></div>
{/if}
<div class="absolute inset-0 w-full h-full {global.screen === "game" ?  "bg-black/50" : ""} backdrop-blur-3xl transition duration-1000 ease-circ-out"></div>

<!-- Background music flashing effect -->
<FlashEffect />

<!-- Page layout -->
<div class="relative w-full h-full overflow-clip flex flex-col flex-nowrap">
    <!-- Top bar (fixed height, self-controlled) -->
    <TopBar />

    <!-- Middle content (fill height) -->
    <MiddleContent />

    <!-- Bottom bar (fixed height, self-controlled) -->
    <BottomBar />

    <!-- Panels -->
    {#if global.openPanel === "settings"}
    <SettingsPanel />
    {:else if global.openPanel === "notifications"}
    <NotificationsPanel />
    {/if}
</div>

<!-- Intro overlay -->
<div bind:this={introElement} class="absolute inset-0 w-full h-full backdrop-blur-3xl {isIntroOutStylesEnabled === true ? "bg-black/0 -translate-y-full pointer-events-none" : "bg-black/50"} transition duration-1000 ease-[cubic-bezier(.18,.7,0,1)] flex flex-col flex-nowrap gap-36 items-center justify-center" hidden> <!-- DEBUG -->
    <span class="text-zinc-50 text-8xl font-comfortaa font-medium tracking-widest select-none">Rhythora</span>
    <span bind:this={introStartTextElement} class="text-zinc-50 text-lg font-poppins tracking-widest select-none">- Loading... -</span>
</div>

<!-- Too little screen space warning overlay -->
<div class="hidden absolute inset-0 w-full h-full backdrop-blur-3xl bg-black/50 {global.screen !== "game" ? "max-padv:flex" : ""} flex-col flex-nowrap gap-6 items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 stroke-zinc-50">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
    </svg>
    <span class="text-zinc-50 text-lg font-poppins tracking-wide">More screen space needed</span>
</div>

<!-- Debug panel -->
{#if global.isDebugPanelShowing === true}
<DebugPanel />
{/if}