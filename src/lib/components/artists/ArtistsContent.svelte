<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'; // Update: Use for navigation if needed, or just anchor tags

    // Mock Data for Artists
    const artists = [
        {
            id: 'ko-jeong-woo',
            name: "고정우",
            en: "KO JEONG WOO",
            instrument: "Piano",
            intro: "음악 속에서 자유를 찾는 연주자",
            image: ""
        },
        {
            id: 'hwang-soo-yeon',
            name: "황수연",
            en: "HWANG SOO YEON",
            instrument: "Piano",
            intro: "섬세한 터치로 감동을 전하는 피아니스트",
            image: ""
        },
        {
            id: 'kim-hyo-jae',
            name: "김효재",
            en: "KIM HYO JAE",
            instrument: "Piano",
            intro: "강렬한 에너지와 열정의 하모니",
            image: ""
        },
        {
            id: 'park-tae-won',
            name: "박태원",
            en: "PARK TAE WON",
            instrument: "Piano",
            intro: "깊이 있는 해석, 진정성 있는 울림",
            image: ""
        },
         {
            id: 'lee-jun-ho',
            name: "이준호",
            en: "LEE JUN HO",
            instrument: "Violin",
            intro: "노래하듯 흐르는 선율의 미학",
            image: ""
        },
         {
            id: 'park-jimin',
            name: "박지민",
            en: "PARK JIMIN",
            instrument: "Cello",
            intro: "중저음의 따뜻함으로 위로를 건네다",
            image: ""
        }
    ];

    let observer;
    const observe = (node) => {
        if (observer) observer.observe(node);
        return {
            destroy() {
                if (observer) observer.unobserve(node);
            }
        };
    };

    onMount(() => {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        return () => {
            if (observer) observer.disconnect();
        };
    });
</script>

<div class="artists-page">
    <!-- 1. Hero Section -->
    <section class="hero-section" use:observe>
        <div class="hero-bg">
            <!-- Background Image Placeholder -->
        </div>
        <h1 class="page-title">Artists</h1>
    </section>

    <!-- 2. Intro Section -->
    <section class="intro-section" use:observe>
        <div class="container intro-layout">
            <div class="text-group">
                <h2 class="main-copy">오늘의 신예,<br>내일의 거장</h2>
                <div class="divider"></div>
                <div class="desc-group">
                    <p class="desc-kr">
                        순수한 열정으로 빚어낸 깊이 있는 해석과 과감한 도전.<br>
                        우리가 주목해야 할 새로운 재능을 가장 먼저 확인하세요.
                    </p>
                    <p class="desc-en">
                        Experience profound interpretations and bold challenges crafted with pure passion. Be the first to discover the new talents that deserve your attention.
                    </p>
                </div>
            </div>
            <div class="image-group">
                <div class="intro-image">
                    <!-- Intro Image Placeholder -->
                </div>
            </div>
        </div>
    </section>

    <!-- 3. Artist Grid Section -->
    <section class="artist-grid-section" use:observe>
        <div class="container">
            <div class="grid-wrapper">
                {#each artists as artist}
                    <a href="/artists/{artist.id}" class="artist-card">
                        <div class="card-image">
                             <!-- Profile Image Placeholder -->
                        </div>
                        <div class="card-info">
                            <h3 class="name-kr">{artist.name}</h3>
                            <p class="name-en">{artist.en}</p>
                            <div class="card-divider"></div>
                            <p class="artist-intro">{artist.intro}</p>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </section>
</div>

<style lang="scss">
    @use '../../styles/common.scss' as *;

    .artists-page {
        width: 100%;
        background-color: $color-white;
        padding-bottom: 8rem;
    }

    /* Animation */
    .hero-section, .intro-section, .artist-grid-section {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s ease-out;
        &.visible {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* 1. Hero */
    .hero-section {
        position: relative;
        width: 100%;
        height: 40vh;
        min-height: 300px;
        background-color: #111; // Dark placeholder
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        .hero-bg {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: #333;
            opacity: 0.5;
        }

        .page-title {
            position: relative;
            font-size: 3rem;
            font-weight: 300;
            color: white;
            letter-spacing: 0.5rem;
            text-transform: uppercase;
            z-index: 2;
        }
    }

    /* 2. Intro */
    .intro-section {
        padding: 6rem 0;
        
        .intro-layout {
            display: flex;
            flex-direction: column;
            gap: 4rem;

            @include min-width(1024px) {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                gap: 5%;
            }
        }

        .text-group {
            flex: 1;

            .main-copy {
                font-size: 2rem;
                font-weight: 700;
                line-height: 1.3;
                margin-bottom: 2rem;
                color: $color-text-primary;
            }

            .divider {
                width: 60px;
                height: 2px;
                background-color: black;
                margin-bottom: 2rem;
            }

            .desc-group {
                font-size: 1rem;
                font-weight: 300;
                line-height: 1.7;
                color: $color-text-secondary;

                .desc-kr {
                    margin-bottom: 1.5rem;
                }
                .desc-en {
                    font-size: 0.85rem;
                    opacity: 0.8;
                }
            }
        }

        .image-group {
            flex: 1.2;
            
            .intro-image {
                width: 100%;
                aspect-ratio: 4/3;
                background-color: #f0f0f0;
                border-radius: 4px;
            }
        }
    }

    /* 3. Grid */
    .artist-grid-section {
        padding: 0 0 6rem 0;

        .grid-wrapper {
            display: grid;
            grid-template-columns: repeat(1, 1fr); // C: Mobile 1 column
            gap: 2rem;
            
            @include min-width(600px) {
                grid-template-columns: repeat(2, 1fr); 
            }

            @include min-width(1024px) {
                grid-template-columns: repeat(3, 1fr); // PC 3 columns
                gap: 3rem;
            }
        }

        .artist-card {
            display: flex;
            flex-direction: column;
            text-decoration: none;
            color: inherit;
            group: 'card'; // For hover effects
            
            &:hover {
                .card-image {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .name-kr {
                    color: #000; // Highlight
                }
            }

            .card-image {
                width: 100%;
                aspect-ratio: 3/4;
                background-color: #f5f5f5;
                margin-bottom: 1.5rem;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                overflow: hidden;
            }

            .card-info {
                text-align: center;
                padding: 0 1rem;

                .name-kr {
                    font-size: 1.25rem;
                    font-weight: 400;
                    margin-bottom: 0.5rem;
                    transition: color 0.3s;
                }

                .name-en {
                    font-size: 0.8rem;
                    color: #999;
                    text-transform: uppercase;
                    letter-spacing: 0.1rem;
                    margin-bottom: 1rem;
                }

                .card-divider {
                    width: 30px;
                    height: 1px;
                    background-color: #ddd;
                    margin: 0 auto 1rem auto;
                }

                .artist-intro {
                    font-size: 0.95rem;
                    font-weight: 300;
                    color: $color-text-secondary;
                    line-height: 1.5;
                    
                    // Ellipsis
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            }
        }
    }
</style>
