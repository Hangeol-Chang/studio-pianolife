<script>
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    import { onMount } from 'svelte';

    // Asset Imports
    import bgImage from '$lib/assets/images/home/home_wallpaper.png';
    import Vision from '@/components/about/Vision.svelte';
    import ArtistsDashboard from '$routes/artists/dashboard.svelte';
    import ConcertsDashboard from '$routes/concerts/dashboard.svelte';
    import GalleryDashboard from '$routes/gallery/dashboard.svelte';
    
    import concertShuman from '$lib/assets/images/concerts/250224_shuman.jpg';
    import concertShopinRavel from '$lib/assets/images/concerts/250215_shopinRavel.jpg';
    import concertAmatuer from '$lib/assets/images/concerts/250829_amatuer.png';

    // Banner Slides Data
    const slides = [
        { type: 'main' },
        { type: 'link', image: concertShuman, link: '/concerts/shuman', title: '슈만 | 시인은, 말한다' },
        { type: 'link', image: concertShopinRavel, link: '/concerts/chopin', title: '쇼팽과 라벨' },
        { type: 'link', image: concertAmatuer, link: '/concerts/amatuer', title: '아마추어를 만나다' }
    ];

    let scrollY = 0;
    let currentSlide = 0;

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }

    function goToSlide(index) {
        currentSlide = index;
    }
</script>

<svelte:window bind:scrollY={scrollY} />

<div class="home-page">
    <!-- Main Banner Slider -->
    <div class="banner-slider-container">
        <div class="slider-track" style="transform: translateX(-{currentSlide * 100}%)">
            {#each slides as slide, index}
                <div class="slide-item">
                    {#if slide.type === 'main'}
                        <!-- Main Banner (Original Content) -->
                        <div class="main-banner">
                            <div class="main-banner-bg" style="--scroll-y: {scrollY}">
                                <img src={bgImage} alt="Hero Background" />
                                <div class="overlay"></div>
                            </div>
                            
                            <div class="banner-content">
                                <h3 class="sub-title">예술가들의 음악이 피어나는 곳</h3>
                                <h1 class="main-title">Fiore에서 만나는 클래식의 감동</h1>
                            </div>
                        </div>
                    {:else}
                        <!-- Link Banner -->
                        <a href={slide.link} class="link-banner main-banner-bg" style="--scroll-y: {scrollY}">
                            <img src={slide.image} alt={slide.title} />
                            <div class="link-overlay">
                                <h2 class="link-title">{slide.title}</h2>
                            </div>
                        </a>
                    {/if}
                </div>
            {/each}
        </div>

        <!-- Navigation Controls -->
        <button class="nav-btn prev" onclick={prevSlide} aria-label="Previous slide">
            <ChevronLeft size={32} color="white" />
        </button>
        <button class="nav-btn next" onclick={nextSlide} aria-label="Next slide">
            <ChevronRight size={32} color="white" />
        </button>

        <!-- Indicators -->
        <div class="indicators">
            {#each slides as _, i}
                <button 
                    class="indicator-dot {currentSlide === i ? 'active' : ''}" 
                    onclick={() => goToSlide(i)}
                    aria-label="Go to slide {i + 1}"
                ></button>
            {/each}
        </div>
    </div>

    <Vision />
    <ArtistsDashboard />
    <ConcertsDashboard />
    <GalleryDashboard />
</div>

<style lang="scss">
    .home-page {
        // 직계 자식 요소 선택 (Vision, Dashboard 컴포넌트 등)
        & > :global(*:nth-child(2n)) {
            background-color: #f9f9f9;
        }
    }

    /* Slider Styles */
    .banner-slider-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        max-height: 700px;
        margin-left: calc(50% - 50vw);
        background-color: black;
        overflow: hidden;
    }

    .slider-track {
        display: flex;
        width: 100%;
        height: 100%;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        will-change: transform;
        // z-index: -1; // Removed
    }

    .slide-item {
        min-width: 100%;
        height: 100%;
        position: relative;
    }

    .link-banner {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        text-decoration: none;
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: -1;
        }

        .link-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 4rem 2rem;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            color: white;
            text-align: center;
        }

        .link-title {
            font-size: 2rem;
            font-weight: 300;
            letter-spacing: 0.1em;
            color: white;
        }
    }

    /* Navigation */
    .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0,0,0,0.2);
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        transition: background 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 6;
        
        &:hover {
            background: rgba(0,0,0,0.5);
        }

        &.prev {
            left: 0;
            border-radius: 0 50% 50% 0;
        }
        &.next { 
            right: 0; 
            border-radius: 50% 0 0 50%;
        }
    }

    .indicators {
        position: absolute;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 0.5rem;
        z-index: 10;

        .indicator-dot {
            width: 8px;
            height: 8px;
            background: rgba(255,255,255,0.4);
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            padding: 0;
            border-radius: 50%;

            &.active {
                background: white;
                transform: scale(1.2);
            }
        }
    }

    /* Hero Section */
    .main-banner {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        text-align: center;
        // overflow: hidden;
        background-color: black;
        z-index: -1; 
    }

    .main-banner-bg {
        will-change: transform, opacity;
        transform: translateY(calc(var(--scroll-y) * 0.7px));
        opacity: calc(1 - (var(--scroll-y) / 1000));
        position: absolute;
        top: 0;
        left: 0;
        width: 100%; 
        height: 100%;
        
        img {
            width: 100%;
            height: 100%; 
            object-fit: cover;
        }
        .overlay {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: 
            linear-gradient(to bottom, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.9) 100%);
        }
    }

    .banner-content {
        padding: 0 1rem;

        .main-title {
            font-weight: 100;
            letter-spacing: 0.15em;
            margin-bottom: 1rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            color: white;
            animation: spacingDown 1s ease-out forwards;
        }
        
        .sub-title {
            font-weight: 100;
            letter-spacing: 0.1em;
            opacity: 0.9;
            color: white;
            animation: floatUp 1s ease-out forwards;
        }

        .hero-divider {
            margin-top: 4rem;
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            align-items: center;
            
            .dot { width: 4px; height: 4px; background: #fff; border-radius: 50%; opacity: 0.8; }
            .dash-group { display: flex; gap: 0.5rem; align-items: center; }
            .dash { width: 24px; height: 1px; background: #fff; opacity: 0.8; }
        }
    }

    @keyframes spacingDown {
        0% { letter-spacing: 0.5em; opacity: 0; }
        100% { letter-spacing: 0.15em; opacity: 1; }
    }
    @keyframes floatUp {
        0% { transform: translateY(10px); opacity: 0; }
        50% { transform: translateY(10px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
</style>