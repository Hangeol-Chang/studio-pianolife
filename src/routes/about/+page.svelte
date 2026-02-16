<script>
    import { onMount } from 'svelte';
    import visionImage from '$lib/assets/images/about/about_1.jpg';
    import heroImage from '$lib/assets/images/about/about_wallpaper.png';
    import Vision from '@/components/about/Vision.svelte';
    import MembershipHero from '@/components/about/MembershipHero.svelte';
    
    // Timeline Data
    const historyEvents = [
        { year: '2026', title: 'To Be Continued...', content: '' },
        { year: '2025', title: 'Fiore Art & Ent 설립', content: 'Hall Fioreum 준공 및 개관' },
        { year: '2024', title: '스튜디오 피아노라이프로 사업자명 변경', content: '' },
        { year: '2023', title: '첫 단독 기획 공연', content: '' }, // 연도가 명시되지 않아 2023으로 추정
        { year: '2019', title: '사업자 설립', content: '' }
    ]; 

    // Animation Logic (Simple Scroll Reveal)
    let visibleItems = new Set();
    
    function observe(node) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // observer.unobserve(entry.target); // Keep animating? or once? Let's keep it once for now.
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(node);
        return {
            destroy() { observer.disconnect(); }
        }
    }
</script>

<div>
    <!-- 1. Hero / Intro Section -->
    <section class="hero-section">
        <div class="hero-image-container">
            <img src={heroImage} alt="Hero Background" class="hero-image-background" />
            <div class="hero-image-background-overlay"></div>
            <img src={heroImage} alt="Hero" class="hero-image" />
            <div class="hero-image-overlay"></div>
        </div>
        
        <div class="hero-content">
            <h1 class="main-title">FIORE</h1>
            <div class="hero-description">
                <h3>Where Musicians’ Music Blooms</h3>
                <h4>연주자의 음악을 피어나게 하는 곳</h4>
            </div>
        </div>
    </section>

    <Vision />

    <MembershipHero />

    <!-- 3. History Section -->
    <section>
        <h1 class="section-title-center">History</h1>
        <h3 class="section-subtitle-center">연혁</h3>
        <p class="section-subtitle-center">2019년 설립 이래 Fiore의 발자취를 소개합니다.</p>
        
    </section>
</div>

<style lang="scss">
    .hero-section {
        position: relative;

        padding: 0;
        margin: 0;
        height: 100vh;
        max-height: 1400px;
    }

    .hero-image-container {
        position: absolute;
        display: flex;
        justify-content: center;

        * {
            min-height: 100vh;
            height: 100vh;
            max-height: 1400px;
        }

        .hero-image-background {
            height: 100vh;
            object-fit: cover;
            z-index: 1;
            width: 100vw;
            filter: blur(8px);
        }
        
        .hero-image-background-overlay {
            position: absolute; 
            top:0; left:0; 
            width:100%; height:100vh;
            background: rgba(0,0,0,0.5);
            z-index: 2;
        }
        
        .hero-image {
            position: absolute;
            height: 100vh;
            z-index: 3;
        }

        .hero-image-overlay {
            position: absolute; 
            top:0; left:0;
            width:100%; height:100vh;
            background: linear-gradient(to bottom, rgba(0,0,0,0.3) 40%, rgba(0,0,0, 0.9) 70%);
            z-index: 4;
        }

    }

    .hero-content {
        position: absolute;
        top: 0; 
        left: 0;
        height: 100%;
        display: flex; 
        flex-direction: column; 
        justify-content: space-between;
        align-items: center;
        text-align: center;
        
        z-index: 5;
        opacity: 1;
        width: 100%;

        .main-title {
            color: white;
            font-weight: 100;

            font-size: 5rem;
            margin-top: 6rem;
            letter-spacing: 0.5em;
            padding-left: 0.5em;
            margin-bottom: 1rem;
            
            @media (--tablet) {
                font-size: 3rem;
                letter-spacing: 0.3em;
                padding-left: 0.3em;
            }
            @media(--mobile) {
                font-size: 2rem;
                letter-spacing: 0.2em;
                padding-left: 0.2em;
            }
        }
        
        .hero-description * {
            letter-spacing: 0.3em;
            padding-left: 0.3em;
            font-weight: 100;
            opacity: 0.7;
            color: white;
        }

        .hero-description {
            padding-bottom: 6rem;
            h3 {
                font-size: 2rem;
                @media(--tablet) {
                    font-size: 1.2rem;
                }
            }
            h4 {
                font-size: 1.4rem;
                @media(--tablet) {
                    font-size: 1rem;
                }
            }
        }
    }
</style>
