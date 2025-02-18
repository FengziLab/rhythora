<script lang="ts">
	import "../app.css";
	let { children } = $props();
    import { onMount } from "svelte";
    import { initializeAudioContext } from "$lib/system/audioContext";
    import { playRandomBackgroundMusic } from "$lib/system/audioHelpers";

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
<div class="absolute top-0 left-0 w-full h-full backdrop-blur-3xl">
	{@render children()}
</div>

<!-- Intro screen -->
<div bind:this={introElement} class="absolute top-0 left-0 w-full h-full backdrop-blur-3xl {introOutStyles ? "bg-black/0 -translate-y-full pointer-events-none" : "bg-black/50"} transition duration-1000 ease-[cubic-bezier(.18,.7,0,1)] flex flex-col flex-nowrap gap-36 items-center justify-center" hidden>
	<span class="text-zinc-100 text-8xl font-comfortaa font-medium tracking-widest">Rhythora</span>
    <span bind:this={startTextElement} class="text-zinc-100 text-lg font-poppins tracking-widest">- Loading... -</span>
</div>