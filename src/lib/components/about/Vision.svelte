<script>
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import { ChevronLeft, ChevronRight, Users, Heart, TrendingUp, Sparkles, Theater } from 'lucide-svelte';
    import aboutImage from '$lib/assets/images/about/about_1.jpg';
    import aboutImage2 from '$lib/assets/images/about/about_2.jpg';
    import aboutImage3 from '$lib/assets/images/about/about_wallpaper.png';
    import aboutImage4 from '$lib/assets/images/about/membership_wallpaper.jpg';

    let isVisible = false;
    let sectionRef;
    let currentVisionIndex = 0;
    let timer;

    const visions = [
        {
            title: "고객이 아닌 소속 아티스트",
            desc: "연주자가 그저 기획사의 고객이 아닌 소속 아티스트로서 오직 음악에만 집중할 수 있는 무대를 만들어 나갑니다.",
            icon: Users
        },
        {
            title: "아티스트와 팬덤",
            desc: "인터뷰, 연주회 홍보 프로모션 등 아티스트 홍보 뿐만이 아니라 '팬덤'을 만들어 나갈 수 있는 다양한 컨텐츠를 제작해 나갑니다.",
            icon: Sparkles
        },
        {
            title: "오늘의 신예, 내일의 거장",
            desc: "숨겨진  보석 같은 신예 아티스트를 발굴하고 그들의 무대를 지원해 나갑니다.",
            icon: TrendingUp
        },
        {
            title: "사랑하는 마음, Amo",
            desc: "음악을 사랑하는 아마추어들을 위한 다양한 무대를 제공해드립니다.",
            icon: Heart
        },
        {
            title: "무대의 다양성",
            desc: "단순히 이름만 걸고 하는 연주회가 아닌 다양한 기획 무대를 통해 단순한 관람을 넘어 새로운 경험을 선사해드립니다.",
            icon: Theater
        }
    ];

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible = true;
                } else {
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
        };
    });
</script>

<section>
    <div bind:this={sectionRef} class="section-content-wrapper">
        <div class="image-area {isVisible ? 'animate' : ''}">
            <img 
                src={aboutImage} 
                alt="Vision" 
                in:fade={{ duration: 1000 }}
                out:fade={{ duration: 1000 }}
            />
        </div>
        
        <div class="text-area {isVisible ? 'animate' : ''}">
            <div class="main-vision" 
                in:fly={{ y: 20, duration: 1000, delay: 400 }} 
                out:fly={{ y: -20, duration: 1000 }}>
                
                <h1 class="title">Our Vision</h1>
                <p class="desc">
                    Fiore는 연주자의 음악이<br />
                    가장 아름답게 피어날 수 있도록,
                    <br /><br />
                    아티스트가 무대를 소모하는 것이 아닌<br />
                    아티스트가 빝나는 무대를 만드는 것.<br />
                    그것이 피오레의 핵심 목표입니다.
                </p>
            </div>
        </div>
    </div>

    <div class="vision-grid section-content-wrapper">
        {#each visions as vision, index}
            <div class="vision-item">
                <div class="vision-icon">
                    <svelte:component this={vision.icon} size={24} strokeWidth={1.5} />
                </div>
                <h3>{vision.title}</h3>
                <p>{@html vision.desc}</p>
            </div>
        {/each}
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

    .main-vision {
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

    .vision-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        margin-top: 4rem;

        @media(--tablet) {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }

        .vision-item {
            padding: 1rem;
            max-width: 400px;

            .vision-icon {
                display: inline-block;
                margin-left: clamp(0px, 5vw, 38.4px);
                opacity: 0.8;
            }

            h3 {
                margin-top: 4px;
                font-weight: 500;
                margin-bottom: 1rem;
                color: #333;
            }

            p {
                line-height: 1.6;
                color: #666;
            }

            @media(--tablet) {
                padding: 0.5rem;
            }
            @media(--mobile) {
                padding: 0rem;
            }
        }
    }
</style>