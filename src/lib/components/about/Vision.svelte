<script>
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    import aboutImage from '$lib/assets/images/about/about_1.jpg';
    import aboutImage2 from '$lib/assets/images/about/about_2.jpg';
    import aboutImage3 from '$lib/assets/images/about/about_wallpaper.jpg';
    import aboutImage4 from '$lib/assets/images/about/membership_wallpaper.jpg';

    let isVisible = false;
    let sectionRef;
    let currentVisionIndex = 0;
    let timer;

    const visions = [
        {
            title: "Our Vision",
            desc: "Fiore는 연주자의 음악이 가장 아름답게 피어날 수 있도록,<br />최상의 무대와 감동적인 경험을 만들어갑니다.",
            image: aboutImage
        },
        {
            title: "Respect",
            desc: "연주자가 오직 음악에만 몰입하여 최고의 기량을 펼칠 수 있는<br />완벽한 무대를 만듭니다.",
            image: aboutImage2
        },
        {
            title: "Creation",
            desc: "무대위 뿐만이 아닌 무대 밖에서도 연주자를 만나 교감할 수 있는<br />다채로운 컨텐츠를 기획합니다.",
            image: aboutImage3
        },
        {
            title: "Ultimate Experience",
            desc: "다양한 기획 무대로 관객의 오감을 만족시키며<br />단순한 관람을 넘어 감동적인 경험을 선사합니다",
            image: aboutImage4
        },
        {
            title: "Discovery & Growth",
            desc: "숨겨진 보석같은 아티스트를 발굴하고,<br />그들이 세계적인 연주자로 성장할 수 있도록 든든한 발판이 됩니다.",
            image: aboutImage2
        },
        {
            title: "Pure Passion",
            desc: "음악을 사랑하는 마음(Amo)을 원동력 삼아,<br />연주자와 관객 모두가 행복할 수 있는 서비스를 지향합니다.",
            image: aboutImage4
        }
    ];

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    startSlide();
                } else {
                    stopSlide();
                }
            });
        }, { 
            threshold: 0.7
        });

        if (sectionRef) {
            observer.observe(sectionRef);
        }

        return () => {
            if (sectionRef) observer.unobserve(sectionRef);
            stopSlide();
        };
    });

    function startSlide() {
        if (timer) return;
        timer = setInterval(() => {
            currentVisionIndex = (currentVisionIndex + 1) % visions.length;
        }, 8000);
    }

    function stopSlide() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function nextVision() {
        currentVisionIndex = (currentVisionIndex + 1) % visions.length;
        resetTimer();
    }

    function prevVision() {
        currentVisionIndex = (currentVisionIndex - 1 + visions.length) % visions.length;
        resetTimer();
    }

    function resetTimer() {
        stopSlide();
        startSlide();
    }
</script>

<section bind:this={sectionRef}>
    <div class="section-content-wrapper">
        <div class="image-area {isVisible ? 'animate' : ''}">
            {#key currentVisionIndex}
                <img 
                    src={visions[currentVisionIndex].image} 
                    alt={visions[currentVisionIndex].title} 
                    in:fade={{ duration: 1000 }}
                    out:fade={{ duration: 1000 }}
                />
            {/key}
        </div>
        
        <div class="text-area {isVisible ? 'animate' : ''}">
            <div class="visions-slider">
                {#key currentVisionIndex}
                    {@const ActiveVision = visions[currentVisionIndex]}
                    <div class="vision-item" 
                        in:fly={{ y: 20, duration: 1000, delay: 400 }} 
                        out:fly={{ y: -20, duration: 1000 }}>
                        
                        <h1 class="title">
                            {ActiveVision.title}
                        </h1>
                        
                        <p class="desc">
                            {@html ActiveVision.desc}
                        </p>
                    </div>
                {/key}
            </div>

            <p class="controls">
                <button class="nav-btn" onclick={prevVision} aria-label="Previous Vision">
                    <ChevronLeft size={20} strokeWidth={1} />
                </button>
                <span class="page-indicator">
                    {currentVisionIndex + 1} / {visions.length}
                </span>
                <button class="nav-btn" onclick={nextVision} aria-label="Next Vision">
                    <ChevronRight size={20} strokeWidth={1} />
                </button>
            </p>
        </div>
    </div>
</section>

<style lang="scss">
    section {
        padding: 4rem 0;
    }
    .section-content-wrapper {
        display: grid;
        grid-template-columns: 2fr minmax(380px, 1fr);
        align-items: stretch;
        @media(--tablet) {
            grid-template-columns: 1fr minmax(300px, 1fr);
        }
        @media (--mobile) {
            grid-template-columns: 1fr 6fr;
        }
    }

    // 비율 설정
    .image-area {
        flex: 1; // Tablet & Desktop: 1:1 비율
        width: 100%;
        height : 1200px;
        max-width: 800px;

        overflow: hidden;
        position: relative;
        opacity: 0;
        transform: translateY(40px);
        transition: all 2s cubic-bezier(0.22, 1, 0.36, 1);

        @media(--desktop) {
            height: 900px;
        }
        @media(--tablet) {
            height: 600px;
        }
        @media(--mobile) {
            height: 400px;
        }

        &.animate {
            opacity: 1;
            transform: translateY(0);
        }

        img {
            width: 100%;
            height: 100%;
            aspect-ratio: 1 / 5;
            object-fit: cover;
            display: block;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            position: absolute;
            top: 0;
            left: 0;
        }
    }

    .text-area {
        flex: 1;
        text-align: right;
        opacity: 0;
        transition: opacity 1s ease-in-out;
        transition-delay: 0.4s;
        padding-right: 1.5rem;
        padding-top: 2rem;
        position: relative;
        display: flex;
        flex-direction: column;

        &.animate {
            opacity: 1;
        }
    }

    .visions-slider {
        position: relative;
        width: 100%;
        height: 350px; /* 슬라이더 영역 높이 고정 */
    }

    .vision-item {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .title {
        font-weight: 300;
        letter-spacing: 0.05em;
        color: #000;
    }

    .desc {
        line-height: 1.8;
        font-weight: 300;
        color: #555;
        margin-bottom: 3rem;
        word-break: keep-all;
    }

    .controls {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
    }

    .nav-btn {
        border: none;
        background: none;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
            
        transition: all 0.2s;
        &:hover {
            background-color: #f0f0f0;
        }
    }

    .page-indicator {
        font-size: 0.9rem;
        font-weight: 100;
        color: #888;
        letter-spacing: 0.1em;
        min-width: 60px;
        text-align: center;
    }
</style>