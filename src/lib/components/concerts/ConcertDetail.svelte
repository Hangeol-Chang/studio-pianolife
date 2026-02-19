<script>
    let { concert } = $props();
    let activeTab = $state('info');
    let gradientStyle = $state('#000');

    // poster_url로부터 gradient 추출
    $effect(() => {
        const src = concert.poster_url;
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
            return 'rgba(0,0,0,0.8)';
        }
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
            rSum += data[i]; gSum += data[i + 1]; bSum += data[i + 2]; count++;
        }
        return `rgb(${Math.round(rSum/count)},${Math.round(gSum/count)},${Math.round(bSum/count)})`;
    }

    // 섹션 스크롤
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
            activeTab = id;
        }
    };

    const artists = $derived(concert.artists || []);
    const program = $derived(concert.program || []);

    // 네비게이션 탭 목록 (데이터가 있는 섹션만 표시)
    const navTabs = $derived(
        (() => {
            const tabs = ['info'];
            if (artists.length > 0) tabs.push('artists');
            if (program.length > 0) tabs.push('program');
            return tabs;
        })()
    );

    function inView(node, { threshold = 0.5 } = {}) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    node.classList.add('visible');
                    observer.disconnect();
                }
            },
            { threshold }
        );
        observer.observe(node);
        return { destroy() { observer.disconnect(); } };
    }
</script>

<div class="concert-detail-page">
    <!-- 타이틀 헤더 -->
    <header class="concert-header" style="--bg-gradient: {gradientStyle}">
        <h1 class="concert-title">{concert.title}</h1>
        {#if concert.date}
            <p class="concert-date">{concert.date}</p>
        {/if}
    </header>

    <!-- 히어로: 포스터 이미지 -->
    <section class="hero-section">
        <div class="concert-hero-image">
            <div class="hero-background-gradient" style="--bg-gradient: {gradientStyle}"></div>
            {#if concert.poster_url}
                <img src={concert.poster_url} alt={concert.title} />
            {:else}
                <div class="hero-placeholder"></div>
            {/if}
            <div class="hero-image-overlay"></div>
        </div>
    </section>

    <!-- 본문 레이아웃 -->
    <div class="content-container">
        <!-- 좌: 포스터 (PC 고정) -->
        <aside class="left-sidebar" style="--bg-gradient: {gradientStyle}">
            <div class="sidebar-poster" use:inView={{ threshold: 1.0 }}>
                {#if concert.poster_url}
                    <img src={concert.poster_url} alt={concert.title} />
                {:else}
                    <div class="poster-placeholder">
                        <span>POSTER</span>
                    </div>
                {/if}
            </div>
        </aside>

        <main class="main-content">
            <!-- Info -->
            <section id="info" class="detail-section">
                <h3 class="section-header">Information</h3>
                <div class="info-grid">
                    {#if concert.date}
                        <div class="info-item">
                            <span class="label">Date</span>
                            <span class="value">{concert.date}</span>
                        </div>
                    {/if}
                    {#if concert.location}
                        <div class="info-item">
                            <span class="label">Location</span>
                            <span class="value">{concert.location}</span>
                        </div>
                    {/if}
                </div>

                {#if concert.brief_description}
                    <div class="description-text">
                        <p>{concert.brief_description}</p>
                    </div>
                {/if}

                <div class="action-area">
                    <button class="btn-reserve">예매하기</button>
                </div>
            </section>

            <!-- Artists -->
            {#if artists.length > 0}
            <section id="artists" class="detail-section">
                <h3 class="section-header">Artists</h3>
                <div class="artists-grid">
                    {#each artists as artist}
                        <a href="/artists/{artist.id}" class="artist-card">
                            <div class="artist-image">
                                {#if artist.image_url}
                                    <img src={artist.image_url} alt={artist.name} />
                                {:else}
                                    <div class="img-placeholder"></div>
                                {/if}
                            </div>
                            <div class="artist-name">
                                <span>{artist.name}</span>
                            </div>
                        </a>
                    {/each}
                </div>
            </section>
            {/if}

            <!-- Program -->
            {#if program.length > 0}
            <section id="program" class="detail-section">
                <h3 class="section-header">Program</h3>
                <div class="program-list">
                    {#each program as item, i}
                        <div class="program-item">
                            <div class="program-content">
                                <p class="piece-row">
                                    <span class="piece-composer">{item.composer ?? ''}</span>
                                    <span class="piece-title">{item.title}</span>
                                </p>
                                {#if item.player_names && item.player_names.length > 0}
                                    <p class="piece-performer">{item.player_names.join(', ')}</p>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
            {/if}
        </main>

        <!-- 우: 섹션 내비게이션 (PC) -->
        <nav class="right-nav">
            <ul class="nav-list">
                {#each navTabs as tab}
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
    .concert-detail-page {
        width: 100%;
        padding-top: 4rem;
    }

    .concert-header {
        text-align: center;
        background: var(--bg-gradient, linear-gradient(to right, #000, #000));
        padding: 2rem 1.5rem;
        margin: 0;

        .concert-title {
            font-weight: 200;
            letter-spacing: 0.3em;
            color: #000;
            font-size: 2rem;
            @media(--tablet) {
                font-size: 1.5rem;
                letter-spacing: 0.15em;
            }
        }
        .concert-date {
            font-weight: 300;
            letter-spacing: 0.2em;
            color: rgba(0, 0, 0, 0.6);
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
    }

    .hero-section {
        padding: 0;
        margin-top: 0;

        .concert-hero-image {
            position: relative;
            height: 100vh;
            width: 100%;
            max-height: 1400px;

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
                max-width: 800px;

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

            .hero-placeholder {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background: linear-gradient(135deg, #1a1a1a, #333);
                z-index: 2;
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
    }

    /* ── 본문 컨테이너 ─────────────── */
    .content-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 3rem 1.5rem 0 0;
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

    /* ── 좌 사이드바 ──────────────── */
    .left-sidebar {
        display: block;
        width: 260px;
        align-self: stretch;
        background: var(--bg-gradient, linear-gradient(to right, #000, #000));

        .sidebar-poster {
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

            .poster-placeholder {
                width: 100%;
                height: 100%;
                background: #1a1a1a;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #555;
                font-weight: 300;
                letter-spacing: 0.2rem;
            }
        }

        @media (--desktop) {
            width: 220px;
        }
        @media (--tablet) {
            display: none;
        }
    }

    /* ── 메인 콘텐츠 ──────────────── */
    .main-content {
        min-width: 0;
    }

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

    /* ── Info ──────────────────────── */
    .info-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.8rem;
        margin-bottom: 2rem;

        .info-item {
            display: flex;
            font-size: 1rem;

            .label {
                width: 90px;
                font-weight: 600;
                color: #999;
                font-size: 0.85rem;
                align-self: center;
                flex-shrink: 0;
            }

            .value {
                font-weight: 300;
                color: #333;
            }
        }
    }

    .description-text {
        font-size: 0.92rem;
        line-height: 1.9;
        font-weight: 300;
        color: #555;
        white-space: pre-wrap;
        margin-bottom: 2rem;
    }

    .action-area {
        .btn-reserve {
            background-color: black;
            color: white;
            padding: 1rem 3rem;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: opacity 0.2s;
            width: 100%;

            @media (min-width: 769px) {
                width: auto;
            }

            &:hover {
                opacity: 0.8;
            }
        }
    }

    /* ── Artists ───────────────────── */
    .artists-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;

        @media (--tablet) {
            grid-template-columns: repeat(2, 1fr);
        }
        @media (--mobile) {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
        }
    }

    .artist-card {
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transition: opacity 0.2s;

        &:hover { opacity: 0.75; }

        .artist-image {
            width: 100%;
            aspect-ratio: 3/4;
            overflow: hidden;
            background: #111;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            .img-placeholder {
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1a1a1a, #333);
            }
        }

        .artist-name {
            font-size: 0.9rem;
            font-weight: 300;
            color: #333;
        }
    }

    /* ── Program ──────────────────── */
    .program-list {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .program-item {
        padding: 1rem 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
            border-bottom: none;
        }

        .program-content {
            .piece-row {
                font-size: 0.95rem;
                line-height: 1.6;
                font-weight: 300;
                color: #333;

                .piece-composer {
                    font-weight: 400;
                    margin-right: 0.3rem;
                }
                .piece-title {
                    color: #555;
                }
            }

            .piece-performer {
                font-size: 0.82rem;
                color: #999;
                margin-top: 0.3rem;
            }
        }
    }

    /* ── 우 내비게이션 (PC) ────────── */
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
