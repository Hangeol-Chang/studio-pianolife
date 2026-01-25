<script>
    // Asset Imports (실제 경로에 맞춰 수정이 필요하면 변경해주세요)
    const bgImage = "/background/raw/hq720.avif"; 
    
    // Data Definition
    const artists = [
        { nameKo: '고정우 (공피라)', nameEn: 'Ko Jeong Woo', image: '/profile/face/default.jpg' },
        { nameKo: '포뮤직스', nameEn: 'Four Musics', image: '/profile/face/default.jpg' },
        { nameKo: '김준한', nameEn: 'JunHan', image: '/profile/face/default.jpg' },
        { nameKo: '밤하늘', nameEn: 'Night Sky', image: '/profile/face/default.jpg' }
    ];

    const concerts = [
        { title: '슈만 | 시인은, 말한다', image: '' },
        { title: '쇼팽과 라벨', image: '' },
        { title: '아마추어를 만나다', image: '' }
    ];
</script>

<div class="main-container">
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-bg">
            <img src={bgImage} alt="Hero Background" onerror={(e) => e.currentTarget.src = '/background/play_cut_wide_1.png'}/>
            <div class="overlay"></div>
        </div>
        
        <div class="hero-content">
            <h1 class="hero-title">Fiore에서 만나는 클래식의 감동</h1>
            <p class="hero-subtitle">예술가들의 음악이 피어나는 곳</p>
            
            <div class="hero-divider">
                <span class="dot"></span>
                <span class="dot"></span>
                <div class="dash-group">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dash"></span>
                </div>
            </div>
        </div>
    </section>

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
                        <!-- Placeholder for Concert Image -->
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

    $text-main: #000;
    $text-light: #fff;
    $bg-gray: #f3f3f3;
    
    // Component Styles
    .main-container {
        width: 100%;
        overflow-x: hidden;
        font-family: 'Pretendard', sans-serif; // 기본 폰트 가정
    }

    /* Common Styles */
    .section {
        padding: 4rem 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
        
        @media (min-width: 768px) {
            padding: 6rem 3rem;
        }
    }

    .section-title {
        font-size: 2rem;
        font-weight: 300;
        text-align: center;
        margin-bottom: 0.5rem;
        letter-spacing: 0.1em;
        color: $text-main;
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

    /* Hero Section */
    .hero-section {
        position: relative;
        height: 100vh;
        max-height: 900px;
        min-height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $text-light;
        text-align: center;
    }

    .hero-bg {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: -1;
        background-color: #1a1a1a;
        
        img {
            width: 100%; height: 100%; object-fit: cover;
            opacity: 0.8;
        }
        .overlay {
            position: absolute; top:0; left:0; width:100%; height:100%;
            background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5));
        }
    }

    .hero-content {
        z-index: 1;
        padding: 0 1rem;

        .hero-title {
            font-size: 1.8rem;
            font-weight: 200;
            letter-spacing: 0.15em;
            margin-bottom: 1rem;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            
            @media (min-width: 768px) {
                font-size: 2.5rem;
            }
        }
        
        .hero-subtitle {
            font-size: 1rem;
            font-weight: 200;
            letter-spacing: 0.1em;
            opacity: 0.9;
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
            
            // 짝수 번째 아이템 이미지를 오른쪽으로 배치하려면 아래 주석 해제
            /* &:nth-child(even) {
                flex-direction: row-reverse;
                text-align: right;
                .btn-detail { align-self: flex-end; }
            } */
        }

        .concert-image {
            width: 100%;
            height: 250px;
            background-color: #e5e5e5;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            
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