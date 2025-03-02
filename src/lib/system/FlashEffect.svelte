<script lang="ts">
    // Local states
    let enabled = $state(false);
    let flashOpacity = $state(0);

    /** Start flash animation */
    export function start() {
        enabled = true;
        // animate();
    }
    /** Stop flash animation */
    export function stop() {
        enabled = false;
    }
</script>

<!-- Background music flashing effect (TODO) -->
<div style="opacity: {flashOpacity};" class="-z-10 absolute top-0 left-0 inset-0 pointer-events-none">
    <div class="absolute top-0 left-0 w-36 h-full bg-gradient-to-r from-zinc-700/30 to-transparent"></div>
    <div class="absolute top-0 right-0 w-36 h-full bg-gradient-to-l from-zinc-700/30 to-transparent"></div>
    <!-- <div class="absolute top-0 left-0 h-36 w-full bg-gradient-to-b from-zinc-700/30 to-transparent"></div>
    <div class="absolute bottom-0 left-0 h-36 w-full bg-gradient-to-t from-zinc-700/30 to-transparent"></div> -->
</div>