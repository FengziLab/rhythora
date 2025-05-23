<script lang="ts">
    import { fade } from "svelte/transition";
    import { circOut } from "svelte/easing";
    import { audioContext, analyserNode } from "$lib/system/audio-system";
    import { global } from "$lib/system/global.svelte";
    import { mod } from "$lib/system/helpers.svelte";

    // Local states
    let enabled = $derived(global.userSettings.backgroundFlashEffect === true && (global.screen === "home" || global.screen === "song-select") && global.musicPlayerData.isPlaying === true);
    let animateLoopLock = false; // NOTE: can upgrade to animateLoopID system in the future
    let beatSeconds: number;
    let flashOpacityLeft = $state(0);
    let flashOpacityRight = $state(0);
    let frequencyAmplitudeArray: Uint8Array;

    // Update and normalize bpm
    $effect(() => {
        let bpm = global.musicPlayerData.song.bpm;
        if (bpm > 1) {
            while (bpm < 90) {
                bpm *= 2;
            }
            while (bpm > 180) {
                bpm /= 2;
            }
        }
        beatSeconds = 60 / bpm;
    });

    // Start the animation
    $effect(() => {
        if (enabled === true && animateLoopLock === false) {
            frequencyAmplitudeArray = new Uint8Array(analyserNode!.frequencyBinCount); // NOTE: guaranteed analyserNode so make ts happy
            animateLoopLock = true;
            requestAnimationFrame(animate);
        }
    });

    /** Animate the flash effect based on frame rate */
    function animate() {
        if (audioContext !== null && analyserNode !== null) {
            // Calculate opacity factor based on beats
            const delayedSongTime = audioContext.currentTime - global.musicPlayerData.logicalStartTime - Math.max(0, global.userSettings.audioDisplacementMs / 1000) - global.musicPlayerData.song.offset; // NOTE: skipping render to start at offset is fine here since we're only calculating for beat info, for which rendering too early is expected, thus needs head start
            // v1 fast but non-negative-aware algorithm: `delayedSongTime % (beatSeconds * 2) / (beatSeconds * 2)`
            // v2 negative-aware algorithm: `1 - (((Math.floor(delayedSongTime / (beatSeconds * 2)) + 1) * (beatSeconds * 2) - delayedSongTime) / (beatSeconds * 2))`, tested to be nearly identical in performance (~900,000,000 ops/s)
            // v3, based on v1 but with modulo fix:
            const beatPositionLeft = mod(delayedSongTime, beatSeconds * 2) / (beatSeconds * 2);
            const beatOpacityLeft = 1 - (Math.min(beatPositionLeft / 0.95, (1 - beatPositionLeft) / 0.05) * 0.6);
            // v1 odd beats: `(delayedSongTime + beatSeconds) % (beatSeconds * 2) / (beatSeconds * 2)`
            // v2 not-tested algorithm based on old way: `1 - (((Math.floor((delayedSongTime + beatSeconds) / (beatSeconds * 2)) + 1) * (beatSeconds * 2) - (delayedSongTime + beatSeconds)) / (beatSeconds * 2))`
            // v3 simple half shift:
            const beatPositionRight = (beatPositionLeft + 0.5) % 1;
            const beatOpacityRight = 1 - (Math.min(beatPositionRight / 0.95, (1 - beatPositionRight) / 0.05) * 0.6);

            // Calculate opacity factor based on audio amplitude
            analyserNode.getByteFrequencyData(frequencyAmplitudeArray);
            const averageAmplitude = frequencyAmplitudeArray.slice(0, Math.floor(frequencyAmplitudeArray.length * 0.25)).reduce((a, b) => a + b) / Math.floor(frequencyAmplitudeArray.length * 0.25) / 255;

            // Apply styles
            flashOpacityLeft = beatOpacityLeft * averageAmplitude;
            flashOpacityRight = beatOpacityRight * averageAmplitude;
        }

        // Go on to next frame
        if (enabled === true) {
            requestAnimationFrame(animate);
        } else {
            animateLoopLock = false;
        }
    }
</script>

<!-- Background music flashing effect -->
{#if enabled === true}
<div transition:fade={{ duration: 300, easing: circOut }} class="absolute inset-0 {enabled === true ? "opacity-100" : "opacity-0"} transition duration-300 ease-circ-out pointer-events-none">
    <div style="opacity: {flashOpacityLeft};" class="absolute left-0 inset-y-0 w-52 max-pc:w-40 h-full bg-gradient-to-r from-zinc-500/50 to-transparent"></div>
    <div style="opacity: {flashOpacityRight};" class="absolute right-0 inset-y-0 w-52 max-pc:w-40 h-full bg-gradient-to-l from-zinc-500/50 to-transparent"></div>
</div>
{/if}