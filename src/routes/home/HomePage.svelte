<script>
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    import { onMount } from 'svelte';

    // Asset Imports
    import bgImage from '$lib/assets/images/home/home_wallpaper.png';
    import profile1 from '$lib/assets/images/artists/artist_1.png';
    import profile2 from '$lib/assets/images/artists/profile_2.png';
    import profile3 from '$lib/assets/images/artists/profile_3.png';
    import concertShuman from '$lib/assets/images/concerts/250224_shuman.jpg';
    import concertShopinRavel from '$lib/assets/images/concerts/250215_shopinRavel.jpg';
    import concertAmatuer from '$lib/assets/images/concerts/250829_amatuer.png';
    import Vision from '@/components/about/Vision.svelte';
    
    // Data Definition
    const artists = [
        { nameKo: '고정우 (공피라)', nameEn: 'Ko Jeong Woo', image: profile1 },
        { nameKo: '포뮤직스', nameEn: 'Four Musics', image: profile2 },
        { nameKo: '김준한', nameEn: 'JunHan', image: profile3 },
        { nameKo: '밤하늘', nameEn: 'Night Sky', image: profile1 }
    ];

    const concerts = [
        { title: '슈만 | 시인은, 말한다', image: concertShuman },
        { title: '쇼팽과 라벨', image: concertShopinRavel },
        { title: '아마추어를 만나다', image: concertAmatuer }
    ];

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

<div>
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

    <!-- VIsion -->
    <div>
        <Vision />
    </div>

    <hr />

    <!-- Artists Section -->
    <section class="section artists-section">
        <h2 class="section-title">Artists</h2>
        
        <div class="artists-grid">
            {#each artists as artist}
                <div class="artist-card">
                    <div class="profile-image">
                        <!-- 이미지 로드 실패 시 회색 박스 표시 -->
                        <img src={artist.image} alt={artist.nameEn} onerror={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentNode.classList.add('no-image'); }}/>
                    </div>
                    <div class="artist-info">
                        <p class="name-en">{artist.nameEn}</p>
                        <p class="name-ko">{artist.nameKo}</p>
                    </div>
                </div>
            {/each}
        </div>
        
        <div class="more-link text-right">
            <a href="/about">+ more</a>
        </div>
    </section>

    <!-- Concerts Section -->
    <section class="section concerts-section">
        <div class="section-header center">
            <h2 class="section-title">Concerts</h2>
            <p class="section-desc">다양한 장르와 스타일의 클래식 공연을 선보입니다</p>
        </div>

        <div class="concerts-list">
            {#each concerts as concert}
                <div class="concert-item">
                    <div class="concert-image">
                        <img src={concert.image} alt={concert.title} />
                    </div>
                    <div class="concert-info">
                        <h3>{concert.title}</h3>
                        <a href="/concerts" class="btn-detail">+ show detail</a>
                    </div>
                </div>
                <!-- Mobile Divider -->
                <div class="divider"></div>
            {/each}
        </div>

        <div class="more-link text-right">
            <a href="/concerts">+ more</a>
        </div>
    </section>

    <!-- Gallery Section -->
    <section class="section gallery-section">
        <div class="section-header center">
            <h2 class="section-title">Gallery</h2>
            <p class="section-desc">우리들이 음악으로 채운 순간들</p>
        </div>

        <div class="gallery-grid">
            <div class="gallery-item large"></div>
            <div class="gallery-item"></div>
            <div class="gallery-item"></div>
        </div>

        <div class="more-link text-right">
            <a href="/gallary">+ more</a>
        </div>
    </section>

    <!-- Vision Section -->
    <section class="section vision-section">
        <div class="vision-content">
            <h2 class="vision-title">Our Vision</h2>
            <p class="vision-desc">
                Fiore는 연주자의 음악이 가장 아름답게 피어날 수 있도록,<br />
                최상의 무대와 감동적인 경험을 만들어갑니다.
            </p>
            <div class="signature">Studio Pianolife</div>
        </div>
    </section>
</div>

<style lang="scss">
    // SCSS Variables & Mixins could be imported here
    // @use "@/styles/variables";
    $text-light: #fff;
    $bg-gray: #f3f3f3;

    .section-title {
        font-size: 2rem;
        font-weight: 300;
        text-align: center;
        margin-bottom: 0.5rem;
        letter-spacing: 0.1em;
    }

    .section-desc {
        font-size: 0.9rem;
        font-weight: 300;
        text-align: center;
        color: #666;
        margin-bottom: 3rem;
    }

    .more-link {
        margin-top: 2rem;
        text-align: right;
        
        a {
            font-size: 0.85rem;
            font-weight: 300;
            color: #333;
            text-decoration: none;
            transition: opacity 0.2s;
            &:hover { opacity: 0.7; }
        }
    }

    /* Slider Styles */
    .banner-slider-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        max-height: 700px;
        margin-left: calc(50% - 50vw);
        overflow: hidden;
        background-color: black;
    }

    .slider-track {
        display: flex;
        width: 100%;
        height: 100%;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        will-change: transform;
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
        z-index: 10;
        transition: background 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        
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
        color: $text-light;
        text-align: center;
        // overflow: hidden;
        background-color: black;
        z-index: -1;
    }

    .main-banner-bg {
        will-change: transform, opacity;
        transform: translateY(calc(var(--scroll-y) * 0.7px));
        // opacity: calc(1 - (var(--scroll-y) / 2000));
        position: absolute;
        top: 0;
        left: 0;
        width: 100%; 
        height: 100%;
        
        img {
            width: 100%;
            height: 100%; 
            object-fit: cover;
            opacity: 1;
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
        z-index: 1;
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

    /* Artists Section */
    .artists-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-top: 3rem;

        @media (min-width: 768px) {
            grid-template-columns: repeat(4, 1fr);
            gap: 2.5rem;
        }
    }

    .artist-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        @media (min-width: 768px) { align-items: flex-start; }

        .profile-image {
            width: 100%;
            aspect-ratio: 3/4;
            background-color: #f0f0f0;
            margin-bottom: 1.2rem;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
            
            &.no-image::after {
                content: '';
                position: absolute; top:0; left:0; width:100%; height:100%;
                background-color: #e0e0e0;
            }

            img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
            &:hover img { transform: scale(1.05); }
        }

        .artist-info {
            text-align: center;
            @media (min-width: 768px) { text-align: left; }

            .name-en { 
                font-size: 0.8rem; 
                font-weight: 300; 
                color: #666;
                margin-bottom: 0.3rem; 
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .name-ko { 
                font-size: 1rem; 
                font-weight: 400; 
                color: #222;
            }
        }
    }

    /* Concerts Section */
    .concerts-section {
        background-color: #f9f9f9;
    }

    .concerts-list {
        display: flex;
        flex-direction: column;
        gap: 4rem;
        margin-top: 2rem;
    }

    .concert-item {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        
        @media (min-width: 768px) {
            flex-direction: row;
            align-items: stretch;
            gap: 3rem;
        }

        .concert-image {
            width: 100%;
            height: 250px;
            background-color: #e5e5e5;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            overflow: hidden;
            
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            @media (min-width: 768px) {
                width: 280px;
                height: 380px;
                flex-shrink: 0;
            }
        }

        .concert-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            
            h3 {
                font-size: 1.5rem;
                font-weight: 300;
                margin-bottom: 2rem;
                line-height: 1.4;
            }
            
            .btn-detail {
                align-self: flex-start;
                display: inline-block;
                padding: 0.6rem 0;
                font-size: 0.85rem;
                font-weight: 300;
                color: #555;
                text-decoration: none;
                border-bottom: 1px solid transparent;
                transition: all 0.2s;
                
                &:hover {
                    color: #000;
                    border-bottom-color: #000;
                }
            }
        }
    }
    
    .divider {
        height: 1px;
        background-color: #e0e0e0;
        width: 100%;
        margin-top: -2rem;
        margin-bottom: 2rem;
        display: block; 
        @media (min-width: 768px) { display: none; }
    }

    /* Gallery Section */
    .gallery-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        
        @media (min-width: 768px) {
            grid-template-columns: 2fr 1fr;
            grid-template-rows: repeat(2, 220px);
            gap: 1.5rem;
        }

        .gallery-item {
            background-color: #eee;
            min-height: 250px;
            transition: opacity 0.3s;
            cursor: pointer;
            
            &:hover { opacity: 0.9; }

            &.large {
                @media (min-width: 768px) {
                    grid-row: span 2;
                    min-height: auto;
                }
            }
        }
    }

    /* Vision Section */
    .vision-section {
        background-color: #fff;
        text-align: right;
        padding-bottom: 8rem;
        border-top: 1px solid #eee;
    }

    .vision-content {
        max-width: 900px;
        margin-left: auto;
        padding-right: 1rem;
        
        .vision-title {
            font-size: 2rem;
            font-weight: 400;
            margin-bottom: 2rem;
            color: #222;
        }
        
        .vision-desc {
            font-size: 1.1rem;
            font-weight: 200;
            line-height: 1.8;
            color: #444;
            margin-bottom: 4rem;
            word-break: keep-all;
        }
        
        .signature {
            font-size: 1rem;
            color: #888;
            font-weight: 300;
            letter-spacing: 0.2em;
        }
    }
</style>