<script>
    import { onMount } from 'svelte';
    
    export let title = '';
    export let subTitle = '';
    
    // Svelte 5 runes or standard props can be used. Using standard export let for compatibility with current setup.
    
    let iconLeft = 0;
    let mounted = false;

    function handleResize() {
        if (typeof window !== 'undefined') {
            // Responsive logic for the note icon position
            const width = window.innerWidth;
            iconLeft = 14 - 7 * 768 / width;
        }
    }

    onMount(() => {
        mounted = true;
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

{#if mounted}
    <div class="page-title-container">
        <h1 class="title-text">{title}</h1>
        <div class="decoration-wrapper">
            <div class="music-sheet">
                {#each Array(5) as _}
                    <hr class="line" />
                {/each}
                
                <div class="note-icon" style="left: {iconLeft}vw;">
                    ♪
                </div>
            </div>
            {#if subTitle}
                <h3 class="subtitle">{subTitle}</h3>
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    .page-title-container {
        margin: 20px 5vw;
        opacity: 0;
        animation: fadeIn 0.5s forwards;
    }

    @keyframes fadeIn {
        to { opacity: 1; }
    }

    .title-text {
        font-size: 2rem;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .music-sheet {
        position: relative;
        padding: 10px 0;
        width: 100%;
    }

    .line {
        height: 1px;
        background-color: #222;
        margin: 8px 0;
        border: 0;
    }

    .note-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-size: 24px;
        transition: left 0.3s ease;
    }

    .subtitle {
        margin-top: 10px;
        font-weight: normal;
        color: #666;
        font-size: 1rem;
    }
</style>
