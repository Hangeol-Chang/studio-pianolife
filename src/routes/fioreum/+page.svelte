<script>
    import { onMount } from 'svelte';
    import fioreum_wallpaper from '$lib/assets/images/fioreum/fioreum_wallpaper.png';
    import FlowerLine from '@/components/fioreum/Flower.svelte';
    import flower_ref_image from '$lib/assets/images/fioreum/flower.jpg';
    import FioreumTitle from '@/components/fioreum/FioreumTitle.svelte';

    let canvas;
    let points = [];
    let isAutoScrolling = true;

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    function smoothScrollTo(target, duration) {
        const start = window.scrollY;
        const change = target - start;
        const startTime = performance.now();

        function animateScroll(currentTime) {
            const timeElapsed = currentTime - startTime;
            if (timeElapsed < duration) {
                const progress = easeInOutQuad(timeElapsed, start, change, duration);
                window.scrollTo(0, progress);
                requestAnimationFrame(animateScroll);
            } else {
                window.scrollTo(0, target);
                isAutoScrolling = false;
            }
        }
        requestAnimationFrame(animateScroll);
    }

    onMount(() => {
        // Auto scroll
        const image_height = document.querySelector('.hero-image').height;

        setTimeout(() => {
            smoothScrollTo(1500 + image_height, 3000); 
        }, 100);

        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = flower_ref_image;
        img.onload = () => {
             const w = 500;
             const h = (img.height / img.width) * w;
             
             canvas.width = w;
             canvas.height = h;
             
             ctx.drawImage(img, 0, 0, w, h);
        };
    });

    function handleCanvasClick(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        points = [...points, [Math.round(x), Math.round(y)]];
    }

    function clearPoints() {
        points = [];
    }

    function copyPoints() {
        if (points.length === 0) return;
        navigator.clipboard.writeText(JSON.stringify(points));
    }
</script>


<div>
    {#if isAutoScrolling}
        <div class="scroll-blocker"></div>
    {/if}
    <div class="hero-container">
        <img src={fioreum_wallpaper} alt="Fioreum Wallpaper" class="hero-image"/>
        <div class="hero-overlay"></div>
        <div class="hero-title">FIOREUM</div>
    </div>

    <div class="line-container">
        <svg class="line" width="100px" height="2000px">
            <defs>
                <linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="2000">
                    <stop offset="0%"   stop-color="#FFF"/>
                    <stop offset="20%" stop-color="#000" />
                    <stop offset="80%" stop-color="#000" />
                    <stop offset="95%" stop-color="#EEE"/>
                </linearGradient>
            </defs>
            <path d="M50 0 L50 2000" stroke="url(#gradient)" stroke-width="2" fill="none"/>
        </svg>
        <div class="flower">
            <FlowerLine width="500px"/>
        </div>
    </div>

    <div style="margin-bottom: 100px;">
        <h1 class="section-title-center" style="letter-spacing: 1rem; font-weight: 100;">
            Where Music Blooms
        </h1>
        <h3 class="section-subtitle-center" style="letter-spacing: 0.8rem;">
            연주자의 음악을 치어나게 하는 곳
        </h3>
    </div>
    <div style="height: 150px;"></div>
    <FioreumTitle />
    <div style="height: 500px;"></div>
</div>

<style lang="scss">
    .hero-container {
        position: relative;
        width: 100%;
        height: auto;
        overflow: hidden;
    }
    
    .hero-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        max-height: 800px;
    }

    .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, 
            rgba(0, 0, 0, 0.5) 20%, 
            rgba(0, 0, 0, 0.8) 70%,
            rgba(0, 0, 0, 1) 90%
        );
    }

    .hero-title {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 3rem;
        text-align: center;
        
        font-weight: 100;
        letter-spacing: 2rem;
    }

    .line-container {
        height: 2200px;
        position: relative;
    }
    .line {
        position: absolute;
        top: -250px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 11;
        
        @media(--desktop) {
            top: -20vw;
        }
    }
    
    .flower {
        position: absolute;
        top: calc(2000px - 220px);
        left: calc(50% + 40px);
        transform: translate(-50%, -50%) rotateZ(-175deg);
        z-index: 12;
    }

    .scroll-blocker {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
    }
</style>