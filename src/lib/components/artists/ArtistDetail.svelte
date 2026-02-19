<script>
    let { artist } = $props();
    let activeTab = $state('profile');
    let gradientStyle = $state('#000');

    // artist.image_url이 확정되는 즉시 CORS 이미지를 병렬로 요청.
    // 화면 <img> 로드와 동시에 진행되므로 gradient 딜레이가 최소화됨.
    $effect(() => {
        const src = artist.image_url;
        if (!src) return;

        const corsUrl = src.includes('?') ? src + '&cors=1' : src + '?cors=1';
        const corsImg = new Image();
        corsImg.crossOrigin = 'anonymous';
        corsImg.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const W = corsImg.naturalWidth;
                const H = corsImg.naturalHeight;
                canvas.width = W;
                canvas.height = H;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(corsImg, 0, 0, W, H);

                const left  = avgColor(ctx, Math.floor(W * 0.05), Math.floor(H * 0.92), 8);
                const right = avgColor(ctx, Math.floor(W * 0.95), Math.floor(H * 0.92), 8);
                gradientStyle = `linear-gradient(to right, ${left}, ${right})`;
            } catch (e) {
                console.warn('Failed to extract gradient:', e);
            }
        };
        corsImg.onerror = () => console.warn('CORS image load failed:', corsUrl);
        corsImg.src = corsUrl;
    });

    function avgColor(ctx, cx, cy, r) {
        let data;
        try {
            data = ctx.getImageData(Math.max(0, cx - r), Math.max(0, cy - r), r * 2, r * 2).data;
        } catch (e) {
            console.warn('Failed to extract image data:', e);
            return 'rgba(0,0,0,0.8)';
        }
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
            rSum += data[i]; gSum += data[i + 1]; bSum += data[i + 2]; count++;
        }
        return `rgb(${Math.round(rSum/count)},${Math.round(gSum/count)},${Math.round(bSum/count)})`;
    }

    // ── 섹션 스크롤 ────────────────────────────
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
            activeTab = id;
        }
    };

    // career: 줄바꿈 구분 텍스트를 배열로 변환
    const careerLines = $derived(
        artist.career
            ? artist.career.split('\n').map(l => l.trim()).filter(Boolean)
            : []
    );

    const videos = $derived(artist.videos || []);
    const concerts = $derived(artist.concerts || []);

    function inView(node, { threshold = 0.5 } = {}) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    node.classList.add('visible');
                    observer.disconnect(); // 한 번 표시되면 해제
                }
            },
            { threshold }
        );
        observer.observe(node);
        return { destroy() { observer.disconnect(); } };
    }

</script>

<div class="artist-detail-page">
    <!-- 이름 헤더 -->
    <header class="artist-header" style="--bg-gradient: {gradientStyle}">
        <h1 class="en-name">{artist.name_en ?? ''}</h1>
        <h2 class="kr-name">{artist.name}</h2>
    </header>

    <section class="hero-section">
        <div class="artist-hero-image">
            <div class="hero-background-gradient" style="--bg-gradient: {gradientStyle}"></div>
            <img
                src={artist.image_url}
                alt={artist.name}
            />
            <div class="hero-image-overlay"></div>
        </div>
        
        <div class="headline-bar">
            <h1 class="headline-text">{@html artist.headline}</h1>
        </div>
    </section>
    <!-- 본문 레이아웃 -->
    <div class="content-container">
        <!-- 좌: 이미지 (PC 고정) -->
        <aside class="left-sidebar" style="--bg-gradient: {gradientStyle}">
            <div class="sidebar-image" use:inView={{ threshold: 1.0 }}>
                <img
                    src={artist.image_url}
                    alt={artist.name}
                />
                <div class="hero-image-overlay"></div>
            </div>
        </aside>

        <main class="main-content">
            <!-- Profile -->
            <section id="profile" class="detail-section">
                {#if careerLines.length > 0}
                    <div class="career-group">
                        <h3 class="section-header">Career</h3>
                        <ul class="career-list">
                            {#each careerLines as item}
                                <li class="career-item">• {item}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                {#if artist.description}
                    <div class="description-text">
                        <p>{artist.description}</p>
                    </div>
                {/if}
            </section>

            <!-- Video -->
            {#if videos.length > 0}
            <section id="video" class="detail-section">
                <h3 class="section-header">Video</h3>
                <div class="video-grid">
                    {#each videos as v}
                        <div class="video-wrap">
                            <iframe
                                src="https://www.youtube.com/embed/{v.id}"
                                title={v.description ?? v.id}
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                            {#if v.description}
                                <p class="video-desc">{v.description}</p>
                            {/if}
                        </div>
                    {/each}
                </div>
            </section>
            {/if}

            <!-- Concert -->
            {#if concerts.length > 0}
            <section id="concert" class="detail-section">
                <h3 class="section-header">Concert</h3>
                <ul class="concert-list">
                    {#each concerts as c}
                        <li class="concert-item">
                            <a href="/concerts/{c.id}">
                                <span class="concert-date">{c.date ?? ''}</span>
                                <span class="concert-title">{c.title}</span>
                            </a>
                        </li>
                    {/each}
                </ul>
            </section>
            {/if}

            <!-- Notice -->
            {#if artist.notice}
            <section id="notice" class="detail-section">
                <h3 class="section-header">Notice</h3>
                <div class="notice-text">
                    <p>{artist.notice}</p>
                </div>
            </section>
            {/if}
        </main>

        <!-- 우: 섹션 내비게이션 (PC) -->
        <nav class="right-nav">
            <ul class="nav-list">
                {#each ['profile', 'video', 'concert', 'notice'] as tab}
                    <li class:active={activeTab === tab}>
                        <button onclick={() => scrollToSection(tab)}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    </li>
                {/each}
            </ul>
        </nav>

    </div>
</div>

<style lang="scss">
    .artist-detail-page {
        width: 100%;
        padding-top: 4rem;
    }

    .artist-header {
        text-align: center;
        background: var(--bg-gradient, linear-gradient(to right, #000, #000));
        padding: 2rem 1.5rem;
        margin: 0;

        .en-name {
            font-weight: 100;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #000;
            @media(--tablet) {
                letter-spacing: 0.15em;
            }
        }
        .kr-name {
            font-weight: 200;
            letter-spacing: 0.5em;
            color: #000;
            @media(--tablet) {
                letter-spacing: 0.25em;
            }
        }
    }

    .hero-section {
        padding: 0;
        margin-top: 0;

        .artist-hero-image {
            position: relative;
            height: 100vh;
            width: 100%;
            max-height: 1400px;
            aspect-ratio: 3/4;

            .hero-background-gradient {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: var(--bg-gradient, linear-gradient(to right, #000, #000));
                z-index: 1;
            }

            img { 
                position: absolute;
                top: 0; left: 50%;
                transform: translateX(-50%);

                width: 100%; 
                height: 100%; 
                object-fit: cover;
                object-position: top center;
                display: block;
                z-index: 2;
                max-width: 1080px;
                transform-origin: top center;

                mask-image:
                    linear-gradient(to right,  transparent 0%, black 15%, black 85%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
                mask-composite: intersect;
                -webkit-mask-image:
                    linear-gradient(to right,  transparent 0%, black 15%, black 85%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
                -webkit-mask-composite: destination-in;

                @media (--tablet) {
                mask-image:
                    linear-gradient(to right,  transparent 0%, black 8%, black 92%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
                -webkit-mask-image:
                    linear-gradient(to right,  transparent 0%, black 8%, black 92%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
                }
            }

            .hero-image-overlay {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: linear-gradient(
                    to bottom, 
                    rgba(0, 0, 0, 0.0) 20%,
                    rgba(0, 0, 0, 0.3) 60%, 
                    rgba(0, 0, 0, 0.7) 80%,
                    rgba(0, 0, 0, 0.99) 95%
                );
                z-index: 3;
            }
        }

        .headline-bar {
            width: 100%;
            background-color: black;
            text-align: center;
            margin-top: 0;
            padding: 2.5rem 5vw;

            @media(--tablet) {
                padding: 1.75rem 5vw;
            }
            .headline-text {
                font-family: 'MuseumCulturalFoundationClassic', serif;
                color: white;
                font-weight: 300;
                
                font-size: 1.5rem;
                letter-spacing: 1rem;
                
                @media(--tablet) {
                    font-size: 1.25rem;
                    letter-spacing: 0.4rem;
                }
                @media(--mobile) {
                    font-size: 0.8rem;
                    letter-spacing: 0.2rem;
                }
            }
        }
    }

    /* ── 본문 컨테이너 ──────────────────── */
    .content-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 3rem 1.5rem 8rem 0;
        display: grid;
        grid-template-columns: 260px 1fr 120px;
        position: relative;
        gap: 2rem;

        @media (--desktop) {
            grid-template-columns: 220px 1fr;
            gap: 1.5rem;
        }
        @media (--tablet) {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
    }

    /* ── 좌 사이드바 ────────────────────── */
    .left-sidebar {
        display: block;
        width: 260px;
        align-self: stretch;

        background: var(--bg-gradient, linear-gradient(to right, #000, #000));

        .sidebar-image {
            width: 100%;
            aspect-ratio: 3/4;
            overflow: hidden;
            position: sticky;
            top: 130px;
            opacity: 0;
            transform: translateY(16px);
            transition: opacity 0.6s ease, transform 0.6s ease;
            
            &:global(.visible) {
                opacity: 1;
                transform: translateY(0);
            }

            img { 
                width: 100%; 
                height: 100%; 
                object-fit: cover; 
                display: block;             
            }
            .placeholder { width: 100%; height: 100%; }
        }
        
        @media (--desktop) {
            width: 220px;
        }
        @media (--tablet) {
            display: none;
        }
    }

    /* ── 메인 콘텐츠 ────────────────────── */
    .detail-section {
        margin-top: 0;
        margin-bottom: 5rem;
        scroll-margin-top: 120px;

        @media(--tablet) {
            margin-left: 1rem;
            margin-right: 1rem;
        }
    }

    .section-header {
        font-size: 1.1rem;
        font-weight: 300;
        color: #999;
        border-bottom: 1px solid #eee;
        padding-bottom: 0.75rem;
        margin-bottom: 1.5rem;
    }

    /* ── Profile ────────────────────────── */
    .sub-slogan {
        font-size: 1.05rem;
        font-weight: 300;
        color: #444;
        margin-bottom: 2rem;
        line-height: 1.6;
    }

    .career-group {
        margin-bottom: 2rem;

        .label-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;

            .icon-trophy { font-size: 1rem; }
            .label { font-size: 1rem; font-weight: 500; color: #222; }
        }

        .career-list {
            list-style: none;

            .career-item {
                font-size: 0.9rem;
                font-weight: 300;
                line-height: 1.9;
                color: #333;
            }
        }
    }

    .description-text {
        font-size: 0.92rem;
        line-height: 1.9;
        font-weight: 300;
        color: #555;
    }

    /* ── Video ──────────────────────────── */
    .video-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        @media (--tablet) {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
    }

    .video-wrap {
        iframe {
            width: 100%;
            aspect-ratio: 16/9;
            border: none;
            border-radius: 6px;
            display: block;
        }
        .video-desc {
            font-size: 0.82rem;
            color: #888;
            margin-top: 0.4rem;
        }
    }

    /* ── Concert ────────────────────────── */
    .concert-list {
        list-style: none;

        .concert-item a {
            display: flex;
            gap: 1rem;
            align-items: baseline;
            text-decoration: none;
            color: #222;
            padding: 0.65rem 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0.92rem;
            transition: color 0.2s;

            &:hover { color: #2563eb; }

            .concert-date { color: #aaa; font-size: 0.82rem; flex-shrink: 0; }
            .concert-title { font-weight: 300; }
        }
    }

    /* ── Notice ─────────────────────────── */
    .notice-text {
        font-size: 0.92rem;
        line-height: 1.9;
        font-weight: 300;
        color: #444;
        white-space: pre-wrap;
    }

    .empty-msg {
        color: #ccc;
        font-size: 0.88rem;
        font-weight: 300;
        text-align: center;
        padding: 2.5rem 0;
    }

    /* ── 우 내비게이션 (PC) ─────────────── */
    .right-nav {
        display: block;
        width: 120px;
        flex-shrink: 0;
        position: sticky;
        top: 250px;
        text-align: right;

        @media (--desktop) {
            display: none;
        }

        .nav-list {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
                margin-bottom: 1.5rem;

                button {
                    background: none;
                    border: none;
                    font-size: 1rem;
                    font-weight: 300;
                    color: #bbb;
                    cursor: pointer;
                    transition: color 0.2s;
                    text-transform: capitalize;

                    &:hover { color: #222; }
                }

                &.active button {
                    color: #000;
                    font-weight: 500;
                }
            }
        }
    }
</style>

