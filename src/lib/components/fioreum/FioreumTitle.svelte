<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let visible = false;
    let container;

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visible = true;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        if (container) {
            observer.observe(container);
        }

        return () => {
            if (container) observer.unobserve(container);
        };
    });
</script>

<div>
    <div class="fioreum-title-container" bind:this={container}>
        {#if visible}
            <div class="word left" in:fly={{ x: -100, duration: 2000, delay: 2000, easing: cubicOut }}>
                Fiore
            </div>
            <div class="word unimportant" in:fly={{ y: 50, duration: 2000, delay: 2400, easing: cubicOut }}>
                +
            </div>
            <div class="word right" in:fly={{ x: 100, duration: 2000, delay: 2000, easing: cubicOut }}>
                um
            </div>
        {/if}
    </div>
    <div class="fioreum-title-container">
        {#if visible}
            <div class="word unimportant" in:fly={{ y: 50, duration: 2000, delay: 3000, easing: cubicOut }}>
                음악이 피어나는 장소
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .fioreum-title-container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 3rem;
        overflow: hidden;
    }

    .word {
        font-size: 3rem;
        font-weight: 300;
        letter-spacing: 0.5rem;
        text-transform: uppercase;
        font-family: 'YesMyungjo';
    }
    
    // 필요하다면 개별 스타일링
    .left {
        text-align: right;
    }
    .right {
        text-align: left;
    }
    .unimportant {
        color: gray;
        font-weight: 100;
        font-size: 2rem;
    }
</style>
