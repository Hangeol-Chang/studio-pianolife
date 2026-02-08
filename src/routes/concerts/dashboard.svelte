<script>
    import { flip } from 'svelte/animate';
    import { onMount, onDestroy } from 'svelte';
    import concertShuman from '$lib/assets/images/concerts/250224_shuman.jpg';
    import concertShopinRavel from '$lib/assets/images/concerts/250215_shopinRavel.jpg';
    import concertAmatuer from '$lib/assets/images/concerts/250829_amatuer.png';
    import MoreButton from '@/components/common/moreButton.svelte';

    const rawConcerts = [
        { id: 1, title: '슈만 | 시인은, 말한다', image: concertShuman },
        { id: 2, title: '쇼팽과 라벨', image: concertShopinRavel },
        { id: 3, title: '아마추어를 만나다', image: concertAmatuer },
        { id: 4, title: '슈만 | 시인은, 말한다', image: concertShuman },
        { id: 5, title: '쇼팽과 라벨', image: concertShopinRavel },
        { id: 6, title: '아마추어를 만나다', image: concertAmatuer }

    ];

    // 한장 왼쪽에 채우기 위해서 마지막 아이템을 앞으로 이동
    let concerts = [rawConcerts[rawConcerts.length - 1], ...rawConcerts.slice(0, rawConcerts.length -1)];
    let intervalId;
    let progressIntervalId;
    let progress = 0;
    const SCROLL_DURATION = 5000;

    // Move first item to the end
    function rotateNext() {
        if (!concerts.length) return;
        concerts = [...concerts.slice(1), concerts[0]];
    }

    // Move last item to the start
    function rotatePrev() {
        if (!concerts.length) return;
        concerts = [concerts[concerts.length - 1], ...concerts.slice(0, -1)];
    }

    // Auto rotate every 5 seconds
    function startAutoRotation() {
        clearInterval(intervalId);
        clearInterval(progressIntervalId);
        
        let startTime = Date.now();
        progress = 0;

        intervalId = setInterval(() => {
            rotateNext();
            startTime = Date.now();
            progress = 0;
        }, SCROLL_DURATION);

        progressIntervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;
            progress = Math.min((elapsed / SCROLL_DURATION) * 100, 100);
        }, 20);
    }

    function stopAutoRotation() {
        clearInterval(intervalId);
        clearInterval(progressIntervalId);
        progress = 0;
    }

    onMount(() => { startAutoRotation(); });
    onDestroy(() => { stopAutoRotation(); });
</script>

<section>
    <h1 class="section-title-center">Concerts</h1>
    <MoreButton href="/concerts" />    

    <!-- Desktop Grid View -->
    <div class="grid-wrapper">
        <div class="concerts-grid-container" 
            role="region" aria-label="Concert Carousel"
        >
            {#each concerts.slice(0, 5) as concert, i (concert.id)} 
                <div 
                    class="concert-item-grid" 
                    class:main-poster={i === 1}
                    class:buffer-item={i === 0 || i === 4}
                    animate:flip={{duration: 500}}
                >
                    <a href="/concerts" class="concert-link">
                        <div class="concert-image">
                            <img src={concert.image} alt={concert.title} />
                            <!-- Overlay for non-active items -->
                            {#if i !== 1}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div class="inactive-overlay" on:click|preventDefault={() => {
                                rotateNext();
                                startAutoRotation();
                            }}></div>
                            {/if}
                        </div>
                    </a>
                    
                    {#if i === 1}
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: {progress}%;"></div>
                        </div>
                    {/if}

                    <div class="concert-info">
                        <h3>{concert.title}</h3>
                    </div>
                </div>
            {/each}
        </div>
    </div>

</section>

<style lang="scss">
    .grid-wrapper {
        max-width: 1280px;
        margin: 3rem auto 0 auto;
        overflow: hidden;
    }

    .concerts-grid-container {
        display: grid;
        width: calc(100% + 600px + 4rem);
        margin-left: calc(-300px - 2rem);
        
        grid-template-columns: 300px 2fr 1.5fr 1.5fr 300px; 
        align-items: start;
        
        @media (--tablet) {
            grid-template-columns: 300px 2fr 1.5fr 300px 0px;
        }
    }

    .concert-item-grid {
        width: 100%;
        display: flex;
        flex-direction: column;
        transition: all 0.5s ease;
        position: relative;
        padding: 2rem;

        @media (--tablet) {
            padding: 1rem;
        }

        &.buffer-item {
            opacity: 0;
            pointer-events: none;
        }

        .concert-image {
            width: 100%;
            height: auto;
            transition: all 0.5s ease;
            cursor: pointer;
            box-shadow: none; 
            transform-origin: top center;

        }
        
        h3 {
            font-size: 1rem;
            opacity: 0.6;
            transition: all 0.5s ease;
            text-align: center;
        }

        &.main-poster {
            .concert-image {
                opacity: 1;
                cursor: default;
            }
            
            h3 {
                font-size: 1.4rem;
                opacity: 1;
                font-weight: 500;
            }
        }
    }

    .progress-bar-container {
        width: 100%;
        height: 2px;
        background-color: #eee;
        margin-top: 1rem;
        margin-bottom: 1rem;
        border-radius: 1px;
        overflow: hidden;
    }

    .progress-bar {
        height: 100%;
        background-color: #333;
        width: 0%;
        transition: width 0.05s linear;
    }

    .inactive-overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 10;
    }

    .concert-link {
        display: block;
        text-decoration: none;
        color: inherit;
    }

    .concert-image {
        width: 100%;
        background-color: #e5e5e5;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        overflow: hidden;
        position: relative;
        
        img {
            width: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
    }

    .concert-info {
        h3 {
            color: #333;
            margin: 0;
            line-height: 1.4;
            text-align: left;
        }
    }
</style>