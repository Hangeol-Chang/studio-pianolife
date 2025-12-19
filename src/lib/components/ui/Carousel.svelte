<script>
    import { onMount } from 'svelte';
    import ResponsiveImage from './ResponsiveImage.svelte';
    import { fade } from 'svelte/transition';

    export let imageList = [];
    export let imageWidth = 300;
    export let imageGap = 30;
    export let autoscroll = 0; // 0: off, >0: speed

    let nowIndex = 0;
    let container;
    let interval;

    function next() {
        nowIndex = (nowIndex + 1) % imageList.length;
    }

    function prev() {
        nowIndex = (nowIndex - 1 + imageList.length) % imageList.length;
    }

    function goTo(index) {
        nowIndex = index;
    }

    onMount(() => {
        if (autoscroll > 0) {
            interval = setInterval(next, autoscroll * 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    });
</script>

<div class="carousel-wrapper" style="--image-width: {imageWidth}px; --image-gap: {imageGap}px;">
    <div class="carousel-container">
        <div class="carousel-track" style="transform: translateX(calc(-1 * {nowIndex} * (var(--image-width) + var(--image-gap))));">
            {#each imageList as image, i}
                <div class="carousel-item" class:active={i === nowIndex}>
                    <!-- Assuming image object has path and name, or is just a string path? 
                         Looking at usage in React code: imageList={carouselItems} where carouselItems is mapped from thumbnails.
                         Let's assume image is an object { path, name } or similar.
                         Wait, in React code: `const posterImageList = mediaInfos.map(info => info.src);`
                         It seems it might be just a path string or object.
                         Let's handle object {path, name} as per ResponsiveImage.
                    -->
                    {#if typeof image === 'object' && image.path && image.name}
                        <ResponsiveImage path={image.path} name={image.name} alt="carousel-image-{i}" />
                    {:else if typeof image === 'string'}
                         <img src={image} alt="carousel-image-{i}" />
                    {:else}
                        <!-- Fallback or custom component passed as slot? React code was complex. -->
                        <!-- For now, let's assume it's compatible with ResponsiveImage props -->
                        <div class="placeholder">Image {i}</div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <button class="nav-btn prev" on:click={prev}>&lt;</button>
    <button class="nav-btn next" on:click={next}>&gt;</button>

    <div class="indicators">
        {#each imageList as _, i}
            <button class="indicator" class:active={i === nowIndex} on:click={() => goTo(i)}></button>
        {/each}
    </div>
</div>

<style lang="scss">
    .carousel-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .carousel-container {
        width: 100%;
        overflow: hidden;
        padding: 20px 0;
    }

    .carousel-track {
        display: flex;
        gap: var(--image-gap);
        transition: transform 0.5s ease-in-out;
        width: max-content;
        padding-left: calc(50% - var(--image-width) / 2); /* Center the active item */
    }

    .carousel-item {
        width: var(--image-width);
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0.5;
        transform: scale(0.9);
        
        &.active {
            opacity: 1;
            transform: scale(1.1);
            z-index: 10;
        }

        img, :global(img) {
            width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    }

    .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.7);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        z-index: 20;
        font-size: 1.2rem;
        
        &.prev { left: 10px; }
        &.next { right: 10px; }

        &:hover {
            background: white;
        }
    }

    .indicators {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ccc;
        border: none;
        cursor: pointer;
        padding: 0;

        &.active {
            background: #333;
        }
    }
</style>
