<script lang="ts">
    import { audioContext, musicSource, musicVolumeNode, setMusicVolume } from "$lib/system/audioContext";
    import { playRandomBackgroundMusic } from "$lib/system/audioHelpers";

    let displayText = $state("Debug");
    function updateValue() {
        try {
            displayText = `musicVolume: ${musicVolumeNode.gain.value} currentTime: ${Math.round(audioContext.currentTime)} baseLatency: ${audioContext.baseLatency} outputLatency: ${audioContext.outputLatency} sampleRate: ${audioContext.sampleRate} state: ${audioContext.state}`;
        } catch (error) {
            console.warn(error);
        }
    }
    updateValue();
    setInterval(updateValue, 100);
</script>

<button onclick={() => { playRandomBackgroundMusic() }} class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
    <span class="text-zinc-100 font-mono select-none">Load New Music</span>
</button>

<!-- <button onclick={() => { setMusicVolume(2) }} class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
    <span class="text-zinc-100 font-mono select-none">Volume Up</span>
</button>
<button onclick={() => { setMusicVolume(1) }} class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
    <span class="text-zinc-100 font-mono select-none">Volume Down</span>
</button> -->

<!-- <button onclick={() => { musicSource.start() }} class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
    <span class="text-zinc-100 font-mono select-none">Start</span>
</button>
<button onclick={() => { musicSource.stop() }} class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
    <span class="text-zinc-100 font-mono select-none">Stop</span>
</button> -->

<button onclick={updateValue} class="h-full px-4 rounded-lg hover:bg-zinc-500/50 active:translate-y-0.5 transition duration-100 ease-[ease] flex items-center justify-center">
    <span class="text-zinc-100 font-mono select-none">{displayText}</span>
</button>