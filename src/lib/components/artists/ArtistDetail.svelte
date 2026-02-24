<script>
    let { artist } = $props();
    let activeTab = $state('profile');
    let gradientStyle = $state('#000');
    let headerTextColor = $state('#fff');

    // hero <img onload> 에서 직접 호출 — 이미지 다운로드가 한 번만 일어남.
    // crossorigin="anonymous"를 img에 붙이면 브라우저가 CORS 헤더 포함하여 요청하고
    // 그 캐시를 canvas에서도 그대로 재사용할 수 있어 딜레이가 없어짐.
    function extractGradientFromImg(img) {
        try {
            const canvas = document.createElement('canvas');
            const W = img.naturalWidth;
            const H = img.naturalHeight;
            canvas.width = W;
            canvas.height = H;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, W, H);

            const left  = avgColor(ctx, Math.floor(W * 0.05), Math.floor(H * 0.92), 8);
            const right = avgColor(ctx, Math.floor(W * 0.95), Math.floor(H * 0.92), 8);
            gradientStyle = `linear-gradient(to right, ${left}, ${right})`;
            const avgLum = (luminance(left) + luminance(right)) / 2;
            headerTextColor = avgLum > 128 ? '#111' : '#fff';
        } catch (e) {
            console.warn('Failed to extract gradient:', e);
        }
    }

    function luminance(rgbStr) {
        const m = rgbStr.match(/rgb\((\d+),(\d+),(\d+)\)/);
        if (!m) return 128;
        return 0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3];
    }

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

    // ── 비디오 캐러셀 ───────────────────────
    let currentVideoIndex = $state(0);
    let dragOffset = $state(0);
    let isDragging = $state(false);
    let dragStartX = 0;
    let viewportEl = $state(null);

    // artist가 바뀌면 인덱스 초기화
    $effect(() => {
        const _ = artist.id ?? artist.name;
        currentVideoIndex = 0;
    });

    function prevVideo() {
        if (currentVideoIndex > 0) currentVideoIndex--;
    }
    function nextVideo() {
        if (currentVideoIndex < videos.length - 1) currentVideoIndex++;
    }
    function handlePointerDown(e) {
        isDragging = true;
        dragStartX = e.clientX;
        dragOffset = 0;
        e.currentTarget.setPointerCapture(e.pointerId);
    }
    function handlePointerMove(e) {
        if (!isDragging) return;
        dragOffset = e.clientX - dragStartX;
    }
    // 슬라이드 1칸 이동 px (슬라이드 너비 + 좌우 margin 합)
    function getSlidePx() {
        if (!viewportEl) return 0;
        const slide = viewportEl.querySelector('.carousel-slide');
        if (!slide) return viewportEl.offsetWidth;
        const style = getComputedStyle(slide);
        return slide.offsetWidth
            + (parseFloat(style.marginLeft) || 0)
            + (parseFloat(style.marginRight) || 0);
    }

    function handlePointerUp() {
        if (!isDragging) return;
        isDragging = false;
        const step = getSlidePx();
        if (step > 0) {
            const threshold = step * 0.25;
            if (dragOffset < -threshold && currentVideoIndex < videos.length - 1) {
                currentVideoIndex++;
            } else if (dragOffset > threshold && currentVideoIndex > 0) {
                currentVideoIndex--;
            }
        }
        dragOffset = 0;
    }

    // 최신순 정렬 후 4개만
    const concerts = $derived(
        (artist.concerts || [])
            .slice()
            .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
            .slice(0, 4)
    );

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
    <header class="artist-header" style="--bg-gradient: {gradientStyle}; --text-color: {headerTextColor}">
        <h1 class="en-name">{artist.name_en ?? ''}</h1>
        <h2 class="kr-name">{artist.name}</h2>
    </header>

    <section class="hero-section">
        <div class="artist-hero-image">
            <div class="hero-background-gradient" style="--bg-gradient: {gradientStyle}"></div>
            <img
                src={artist.image_url}
                alt={artist.name}
                crossorigin="anonymous"
                onload={(e) => extractGradientFromImg(e.currentTarget)}
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
            <section id="video" class="detail-section video-section">
                <h3 class="section-header">Video</h3>
                <div class="video-carousel">
                    <button
                        class="carousel-btn carousel-prev"
                        onclick={prevVideo}
                        disabled={currentVideoIndex === 0}
                        aria-label="이전 영상"
                    >&#8249;</button>

                    <div class="carousel-outer">
                    <div
                        class="carousel-viewport"
                        class:dragging={isDragging}
                        role="region"
                        aria-label="비디오 캐러셀"
                        bind:this={viewportEl}
                        onpointerdown={handlePointerDown}
                        onpointermove={handlePointerMove}
                        onpointerup={handlePointerUp}
                        onpointercancel={handlePointerUp}
                    >
                        <div
                            class="carousel-track"
                            style="transform: translateX(calc({-currentVideoIndex * getSlidePx()}px + {dragOffset}px)); transition: {isDragging ? 'none' : 'transform 0.35s ease'};"
                        >
                            {#each videos as v}
                                <div class="carousel-slide">
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
                                </div>
                            {/each}
                        </div>
                    </div>
                    </div><!-- /carousel-outer -->

                    <button
                        class="carousel-btn carousel-next"
                        onclick={nextVideo}
                        disabled={currentVideoIndex === videos.length - 1}
                        aria-label="다음 영상"
                    >&#8250;</button>
                </div>

                {#if videos.length > 1}
                <div class="carousel-dots">
                    {#each videos as _, i}
                        <button
                            class="dot"
                            class:active={i === currentVideoIndex}
                            onclick={() => currentVideoIndex = i}
                            aria-label="영상 {i + 1}"
                        ></button>
                    {/each}
                </div>
                {/if}
            </section>
            {/if}

            <!-- Concert -->
            {#if concerts.length > 0}
            <section id="concert" class="detail-section">
                <h3 class="section-header">Concert</h3>
                <div class="concert-grid">
                    {#each concerts as c}
                        <a href="/concerts/{c.id}" class="concert-card">
                            <div class="concert-poster">
                                {#if c.poster_url}
                                    <img src={c.poster_url} alt={c.title} />
                                {:else}
                                    <div class="concert-poster-placeholder"></div>
                                {/if}
                            </div>
                            <div class="concert-card-info">
                                {#if c.date}
                                    <span class="concert-date">{c.date}</span>
                                {/if}
                                <span class="concert-title">{c.title}</span>
                            </div>
                        </a>
                    {/each}
                </div>
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
            color: var(--text-color, #fff);
            @media(--tablet) {
                letter-spacing: 0.15em;
            }
        }
        .kr-name {
            font-weight: 200;
            letter-spacing: 0.5em;
            color: var(--text-color, #fff);
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
                max-width: 700px;
                transform-origin: top center;

                mask-image:
                    linear-gradient(to right,  transparent 0%, black 10%, black 90%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
                mask-composite: intersect;
                -webkit-mask-image:
                    linear-gradient(to right,  transparent 0%, black 10%, black 90%, transparent 100%),
                    linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
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
        }
        
        @media (--desktop) {
            width: 220px;
        }
        @media (--tablet) {
            display: none;
        }
    }

    /* ── 메인 콘텐츠 ────────────────────── */
    .main-content {
        /* grid 아이템은 기본 min-width: auto → 콘텐츠만큼 늘어나 overflow-x가 무효화됨.
           min-width: 0 으로 셀이 할당된 너비 안에 갇히게 해서 가로 스크롤을 허용 */
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

    /* ── Profile ────────────────────────── */
    .career-group {
        margin-bottom: 2rem;

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

    /* ── Video Carousel ─────────────────── */
    .video-section {
        padding-bottom: 1.5rem;
    }

    .video-carousel {
        --peek: 48px;
        --slide-gap: 14px;
        display: flex;
        align-items: center;
        gap: 1rem;

        @media (--tablet) {
            --peek: 28px;
            --slide-gap: 10px;
            gap: 0;
        }
    }

    // 오버플로우 클리핑
    .carousel-outer {
        flex: 1;
        overflow: hidden;
        min-width: 0;
    }

    .carousel-viewport {
        overflow: visible;
        touch-action: pan-y;
        cursor: grab;
        user-select: none;

        &:active {
            cursor: grabbing;
        }
    }

    .carousel-track {
        display: flex;
        will-change: transform;
        // 첫 슬라이드가 가운데 오도록 초기 오프셋
        padding-left: calc(var(--peek) - var(--slide-gap) / 2);
    }

    .carousel-slide {
        // 슬라이드 너비: 양쪽 peek 만큼 줄임
        flex: 0 0 calc(100% - 2 * var(--peek));
        margin: 0 calc(var(--slide-gap) / 2);
        box-sizing: border-box;
    }

    .video-wrap {
        iframe {
            width: 100%;
            aspect-ratio: 16/9;
            border: none;
            display: block;
        }
        .video-desc {
            font-size: 0.82rem;
            color: #888;
            margin-top: 0.4rem;
            margin-left: 0;
            text-wrap: none;
        }
    }

    // 드래그 중 iframe이 포인터 이벤트 휘치지 않도록
    .carousel-viewport.dragging .video-wrap iframe {
        pointer-events: none;
    }

    .carousel-btn {
        width: 40px;
        height: 40px;
        border: 1px solid #ddd;
        background: white;
        font-size: 1.75rem;
        cursor: pointer;
        display: flex;
        height: 40px;

        text-align: center;
        justify-content: center;
        transition: background 0.2s, opacity 0.2s;
        color: #444;
        padding: 0;

        &:hover:not(:disabled) {
            background: #f0f0f0;
        }

        &:disabled {
            opacity: 0.25;
            cursor: default;
        }

        @media (--tablet) {
            display: none;
        }
        
        &.carousel-prev {
            border-radius: 0 20px 20px 0;
            border-left: none;
        }
        &.carousel-next {
            border-radius: 20px 0 0 20px;
            border-right: none;
        }
    }

    .video-desc {
        font-size: 0.82rem;
        color: #888;
        margin-top: 0.5rem;
    }

    .carousel-dots {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;

        .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            border: none;
            background: #ccc;
            padding: 0;
            cursor: pointer;
            transition: background 0.2s, transform 0.2s;

            &.active {
                background: #333;
                transform: scale(1.4);
            }
        }
    }

    /* ── Concert ────────────────────────── */
    .concert-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;

        /* 태블릿: 2열 */
        @media (--tablet) {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
        }

        /* 모바일: 2열 유지, 간격 축소 */
        @media (--mobile) {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
        }
    }

    .concert-card {
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transition: opacity 0.2s;

        &:hover { opacity: 0.75; }

        .concert-poster {
            width: 100%;
            aspect-ratio: 2/3;
            overflow: hidden;
            background: #111;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            .concert-poster-placeholder {
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1a1a1a, #333);
            }
        }

        .concert-card-info {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;

            .concert-date {
                font-size: 0.75rem;
                color: #aaa;
                font-weight: 300;
            }

            .concert-title {
                font-size: 0.85rem;
                font-weight: 300;
                color: #222;
                line-height: 1.4;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
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
    /* ── 우 내비게이션 (PC) ─────────────── */
    .right-nav {
        display: block;
        width: 120px;
        flex-shrink: 0;
        position: sticky;
        top: 250px;
        align-self: start;   // stretch(기본값)이면 행 전체 높이로 늘어나 sticky가 동작 안 함
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

