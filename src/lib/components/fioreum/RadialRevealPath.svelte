<script>
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import { quartIn } from "svelte/easing";

    export let d;
    export let fill = "black";
    export let delay = 0;
    export let duration = 2000;
    
    // Unique ID for the gradient
    const uid = "grad-" + Math.random().toString(36).substr(2, 9);
    
    const progress = tweened(0, {
        duration,
        easing: quartIn,
        delay
    });

    onMount(() => {
        progress.set(1);
    });
</script>

<defs>
    <radialGradient id={uid} gradientUnits="userSpaceOnUse" cx="295" cy="275" r="350">
        <stop offset="{$progress}" stop-color={fill} />
        <stop offset="{$progress}" stop-color="transparent" stop-opacity="0" />
    </radialGradient>
</defs>

<path {d} fill="url(#{uid})" />
