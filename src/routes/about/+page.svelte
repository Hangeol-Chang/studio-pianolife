<script>
    import { onMount } from 'svelte';
    import visionImage from '$lib/assets/images/about/about_1.jpg';
    import heroImage from '$lib/assets/images/about/about_wallpaper.png';
    
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

            <img src={heroImage} alt="Hero Image" class="hero-image" />
            <div class="hero-image-overlay"></div>
        </div>
        
        <div class="hero-content">
            <h1 class="main-title">FIORE</h1>
            <h2 class="sub-title">Where Musicians’ Music Blooms</h2>
            <div class="divider"></div>
            <p class="description">연주자의 음악을 피어나게 하는 곳</p>
        </div>
    </section>

    <!-- 2. Vision Section -->
    <section class="vision-section">
        <div class="vision-content-wrapper">
            <div class="vision-text" use:observe>
                <h3 class="vision-label">Our Vision</h3>
                <p class="vision-desc">
                    Fiore는 연주자의 음악이 <br class="mobile-only" />가장 아름답게 피어날 수 있도록,<br/>
                    최상의 무대와 감동적인 경험을 만들어갑니다.
                </p>
                
                <div class="detail-link">
                   <a href="/vision">+ more</a>
                </div>
            </div>
            
            <div class="vision-image-container" use:observe>
                <img src={visionImage} alt="Vision" onerror={(e) => e.currentTarget.parentNode.style.backgroundColor='#ddd'} />
            </div>
        </div>
    </section>

    <!-- 3. History Section -->
    <section class="history-section">
        <div class="section-header center" use:observe>
            <h2 class="section-title">History</h2>
            <p class="section-subtitle">2019년 설립 이래 Fiore의 발자취를 소개합니다</p>
        </div>

        <div class="timeline-container">
            <div class="timeline-line"></div>
            
            {#each historyEvents as event}
                <div class="timeline-item" use:observe>
                    <div class="timeline-dot"></div>
                    <div class="timeline-year">{event.year}</div>
                    <div class="timeline-content">
                        <h4 class="event-title">{event.title}</h4>
                        {#if event.content}
                            <p class="event-desc">{event.content}</p>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </section>
    
    <!-- 4. Sponsor Section -->
    <section class="sponsor-section" use:observe>
        <div class="sponsor-bg">
            <!-- Background Image for sponsor -->
        </div>
        <div class="sponsor-content">
            <div class="sponsor-text-group">
                <h3 class="sponsor-title">Fiore with You</h3>
                <p class="sponsor-desc">
                    Fiore는 아무튼 좋은 일을 하는 피아노 집단입니다.<br/>
                    스폰서로 등록해주시면 좋은 치킨값이 됩니다.
                </p>
            </div>
            <a href="/contact" class="sponsor-link">sponsor <span class="arrow">→</span></a>
        </div>
    </section>
</div>

<style>
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
        position: relative;
        height: 0;
        z-index: 5;
        opacity: 1;

        .main-title {
            position: absolute;
            left: 50%;
            top: 150px;
            transform: translateX(-50%);

            position: relative;
            
            color: white;
            font-weight: 100;

            font-size: 3.5rem;
            margin: 0 auto;
            letter-spacing: 0.5em;
            margin-bottom: 1rem;
            
            @media (min-width: 768px) {
                font-size: 5rem; 
            }
        }
        
        .sub-title {
            font-size: 1.2rem;
            letter-spacing: 0.1em;
            margin-bottom: 2rem;
            color: rgba(255, 255, 255, 0.9);
            
            @media (min-width: 768px) {
                font-size: 2rem;
            }
        }
        
        .divider {
            width: 1px;
            height: 60px;
            background-color: rgba(255,255,255,0.5);
            margin: 0 auto 2rem;
        }
        
        .description {
            font-size: 1rem;
            letter-spacing: 0.2em;
            opacity: 0.8;
        }
    }

    /* 2. Vision Section */

    .vision-content-wrapper {
        display: flex;
        flex-direction: column-reverse;
        gap: 3rem;
        
        @media (min-width: 768px) {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
    }

    .vision-text {
        flex: 1;
        text-align: right; 
        opacity: 0;
        transform: translateX(-30px);
        transition: all 0.8s ease;
        
        &.visible { opacity: 1; transform: translateX(0); }

        .vision-label {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            
            @media (min-width: 768px) { font-size: 2.5rem; }
        }
        
        .vision-desc {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            color: #333;
            word-break: keep-all;
        }
        
        .detail-link {
            a {
                display: inline-block;
                padding: 0.5rem 1.5rem;
                border: 1px solid #ccc;
                text-decoration: none;
                color: #333;
                font-size: 0.9rem;
                transition: 0.3s;
                
                &:hover {
                    background-color: #000;
                    color: #fff;
                    border-color: #000;
                }
            }
        }
    }

    .vision-image-container {
        flex: 1.2;
        min-height: 300px;
        position: relative;
        opacity: 0;
        transform: translateX(30px);
        transition: all 0.8s ease 0.2s;
        
        &.visible { opacity: 1; transform: translateX(0); }
        
        img {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 4px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
    }

    /* 3. History Section */
    .history-section {
        background-color: #fafafa;
        position: relative;
    }
    
    .section-header {
        text-align: center;
        margin-bottom: 4rem;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease;
        &.visible { opacity: 1; transform: translateY(0); }
        
        .section-title {
            font-size: 2rem;
            font-weight: light;
            margin-bottom: 0.5rem;
        }
        
        .section-subtitle {
            font-size: 0.9rem;
            color: #666;
        }
    }

    .timeline-container {
        position: relative;
        max-width: 800px;
        padding-left: 2rem;
        
        @media (min-width: 768px) {
            padding-left: 0;
        }
    }
    
    .timeline-line {
        position: absolute;
        left: 2rem; 
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: #000;
        
        @media (min-width: 768px) {
            left: 50%;
            transform: translateX(-50%);
        }
    }

    .timeline-item {
        position: relative;
        margin-bottom: 4rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
        &.visible { opacity: 1; transform: translateY(0); }
        
        &:last-child { margin-bottom: 0; }
        
        @media (min-width: 768px) {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            width: 100%;
            
            &:nth-child(odd) {
                flex-direction: row-reverse;
                .timeline-content { text-align: left; padding-left: 3rem; padding-right: 0;}
                .timeline-year { text-align: right; padding-right: 3rem; padding-left: 0; }
            }
            
            &:nth-child(even) {
                .timeline-content { text-align: right; padding-right: 3rem; padding-left: 0;}
                .timeline-year { text-align: left; padding-left: 3rem; padding-right: 0; }
            }
        }
    }
    
    .timeline-dot {
        position: absolute;
        top: 0.5rem;
        width: 12px;
        height: 12px;
        background-color: #000;
        border-radius: 50%;
        transform: translateX(-50%);
        z-index: 1;
        
        left: 0; 
        left: calc(0px - 6px);
        
        @media (min-width: 768px) {
            left: 50%;
        }
    }

    .timeline-year {
        font-size: 1.2rem;
        margin-bottom: 0.5rem;
        padding-left: 2rem;
        color: #000;
        
        @media (min-width: 768px) {
            flex: 1;
            margin-bottom: 0;
            padding: 0;
        }
    }

    .timeline-content {
        padding-left: 2rem;
        color: #333;
        
        @media (min-width: 768px) {
            flex: 1;
            padding: 0;
        }
        
        .event-title {
            font-size: 1.1rem;
            margin-bottom: 0.2rem;
        }
        
        .event-desc {
            font-size: 0.9rem;
        }
    }

    /* 4. Sponsor Section */
    .sponsor-section {
        background-color: #000;
        color: #fff;
        padding: 6rem 1.5rem;
        position: relative;
        overflow: hidden;
        
        .sponsor-bg {
             position: absolute; top: 0; left: 0; width: 100%; height: 100%;
             opacity: 0.3;
             background: linear-gradient(45deg, #111, #333);
        }
        
        .sponsor-content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            
            @media (min-width: 768px) {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
        }
        
        .sponsor-text-group {
            .sponsor-title {
                font-size: 2rem;
                margin-bottom: 1rem;
            }
            .sponsor-desc {
                font-size: 1rem;
                opacity: 0.8;
                line-height: 1.6;
            }
        }
        
        .sponsor-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #fff;
            text-decoration: none;
            font-size: 1.2rem;
            padding: 1rem 2rem;
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.3s;
            
            .arrow { transition: transform 0.3s; }
            
            &:hover {
                background-color: #fff;
                color: #000;
                .arrow { transform: translateX(5px); }
            }
        }
    }
</style>
