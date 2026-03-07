<script>
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    import { onMount } from 'svelte';

    // Asset Imports
    // import bgImage from '$lib/assets/images/home/home_wallpaper.png';
    import bgImage from '$lib/assets/images/about/membership_wallpaper.jpg';
    import Vision from '@/components/about/Vision.svelte';
    import ArtistsDashboard from '$routes/artists/dashboard.svelte';
    import ConcertsDashboard from '$routes/concerts/dashboard.svelte';
    import GalleryDashboard from '$routes/gallery/dashboard.svelte';
    
    import { PIANOLIFE_BACKEND_URL } from '$env/static/public';

    const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';

    // Banner Slides Data (dynamically fetched)
    // Start with loading placeholders so the slider is usable immediately
    let slides = $state([
        { type: 'main' },
        { type: 'loading', id: 'concert' },
        { type: 'loading', id: 'audition' },
        { type: 'loading', id: 'concours' },
    ]);

    let scrollY = $state(0);
    let currentSlide = $state(0);

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }

    function goToSlide(index) {
        currentSlide = index;
    }

    onMount(async () => {
        const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

        // const [concertsRes, auditionsRes, concoursRes] = await Promise.allSettled([
        //     fetch(`${API}/api/concerts?active_only=true`).then(r => r.json()),
        //     fetch(`${API}/api/auditions?active_only=false`).then(r => r.json()),
        //     fetch(`${API}/api/concours?active_only=false`).then(r => r.json()),
        // ]);
        const [concertsRes, auditionsRes] = await Promise.allSettled([
            fetch(`${API}/api/concerts?active_only=true`).then(r => r.json()),
            fetch(`${API}/api/auditions?active_only=false`).then(r => r.json())
        ]);
        
        const newSlides = [{ type: 'main' }];

        // 가장 가까운 예정 공연 (date >= today)
        if (concertsRes.status === 'fulfilled' && Array.isArray(concertsRes.value)) {
            const upcoming = concertsRes.value
                .filter(c => c.date && c.date >= today)
                .sort((a, b) => a.date.localeCompare(b.date));
            if (upcoming.length > 0) {
                const c = upcoming[0];
                const image = c.banner_image_url || c.poster_url;
                if (image) newSlides.push({ type: 'link', image, link: `/concerts/${c.id}` });
            }
            if(upcoming.length > 1) {
                const c = upcoming[1];
                const image = c.banner_image_url || c.poster_url;
                if (image) newSlides.push({ type: 'link', image, link: `/concerts/${c.id}` });
            }
        }

        // 가장 가까운 오디션 (end_date >= today)
        if (auditionsRes.status === 'fulfilled' && Array.isArray(auditionsRes.value)) {
            const upcoming = auditionsRes.value
                .filter(a => a.end_date && a.end_date >= today)
                .sort((a, b) => a.end_date.localeCompare(b.end_date));
            if (upcoming.length > 0) {
                const a = upcoming[0];
                const image = a.banner_image_url || a.poster_url;
                if (image) newSlides.push({ type: 'link', image, link: `/auditions/${a.id}` });
            }
        }

        // 가장 가까운 콩쿠르 (end_date >= today)
        // if (concoursRes.status === 'fulfilled' && Array.isArray(concoursRes.value)) {
        //     const upcoming = concoursRes.value
        //         .filter(c => c.end_date && c.end_date >= today)
        //         .sort((a, b) => a.end_date.localeCompare(b.end_date));
        //     if (upcoming.length > 0) {
        //         const c = upcoming[0];
        //         const image = c.banner_image_url || c.poster_url;
        //         if (image) newSlides.push({ type: 'link', image, link: `/concours/${c.id}` });
        //     }
        // }

        slides = newSlides;
        // Clamp active index in case placeholders were removed
        if (currentSlide >= slides.length) currentSlide = slides.length - 1;
    });
</script>

<svelte:window bind:scrollY={scrollY} />

<div class="home-page">
    <!-- Main Banner Slider -->
    <div class="banner-slider-container">
        <div class="slider-track" style="transform: translateX(-{currentSlide * 100}%)">
            {#each slides as slide, index}
                <div class="slide-item">
                    {#if slide.type === 'main'}
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
                    {:else if slide.type === 'loading'}
                        <!-- Loading Skeleton -->
                        <div class="loading-slide">
                            <div class="shimmer"></div>
                            <div class="loading-label">불러오는 중…</div>
                        </div>
                    {:else}
                        <!-- Link Banner -->
                        <a href={slide.link} class="link-banner main-banner-bg" style="--scroll-y: {scrollY}">
                            <img src={slide.image} class="background-blur-img" alt="" />
                            <img src={slide.image} class="banner-img" alt="" />
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
        height: 9/16 * 100vw; // 16:9 비율 유지
        max-height: 700px;
        margin-left: 0;
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
        
        
        .background-blur-img {
            position: absolute;
            left: 50%;
            width: 100%; height: 100%;

            object-fit: cover;
            filter: blur(20px) brightness(0.5);
            transform: translateX(-50%) scaleY(1.2);
            z-index: -2;
            overflow: hidden;
        }

        .banner-img {
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);

            width: 100%;
            max-width: 16/9 * 700px; // 16:9 비율로 최대 높이 700px
            height: 100%;
            object-fit: cover;
            z-index: -1;
        }
    }

    /* Loading skeleton slide */
    .loading-slide {
        width: 100%;
        height: 100%;
        background: #111;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        .shimmer {
            position: absolute;
            inset: 0;
            background: linear-gradient(
                105deg,
                transparent 40%,
                rgba(255, 255, 255, 0.07) 50%,
                transparent 60%
            );
            background-size: 200% 100%;
            animation: shimmerMove 1.6s ease-in-out infinite;
        }

        .loading-label {
            position: relative;
            z-index: 1;
            color: rgba(255, 255, 255, 0.35);
            font-size: 0.9rem;
            letter-spacing: 0.15em;
        }
    }

    @keyframes shimmerMove {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
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
        // height: 100%;
        
        img {
            width: 100%;
            height: 100%; 
            object-fit: cover;
            max-height: 700px;
            aspect-ratio: 16/9;
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