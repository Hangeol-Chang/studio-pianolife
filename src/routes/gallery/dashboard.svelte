<script>
    import { onMount, onDestroy } from 'svelte';
    import { PIANOLIFE_BACKEND_URL } from '$env/static/public';

    const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';
    const PAGE_SIZE = 3;   // 한 페이지에 보여줄 이미지 수
    const SLIDE_INTERVAL = 3500;

    let images = $state([]);
    let loading = $state(true);
    let currentPage = $state(0);

    /** gallery_images → 없으면 media 최신 6개로 fallback */
    async function fetchImages() {
        // 1차: gallery_images 테이블
        const res = await fetch(`${API}/api/gallery/?limit=6&sort=recent`);
        if (res.ok) {
            const data = await res.json();
            if (data.length > 0) return data;
        }

        // 2차 fallback: media 라이브러리 최신 순 (media API는 항상 created_at DESC)
        const mRes = await fetch(`${API}/api/media/?limit=6`);
        if (!mRes.ok) return [];
        const mData = await mRes.json();
        // media 응답은 { items, total } 구조 → GalleryImageResponse 형태로 변환
        return (mData.items || []).map(m => ({
            id: m.id,
            image_url: m.url,
            title: m.alt_text || m.original_filename || null,
            category: m.category,
        }));
    }

    // 6개를 PAGE_SIZE씩 나눈 페이지 배열
    const pages = $derived(
        Array.from(
            { length: Math.ceil(images.length / PAGE_SIZE) },
            (_, i) => images.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE)
        )
    );

    function nextPage() {
        if (!pages.length) return;
        currentPage = (currentPage + 1) % pages.length;
    }

    function prevPage() {
        if (!pages.length) return;
        currentPage = (currentPage - 1 + pages.length) % pages.length;
    }

    let intervalId;

    function startAuto() {
        clearInterval(intervalId);
        intervalId = setInterval(nextPage, SLIDE_INTERVAL);
    }

    function stopAuto() {
        clearInterval(intervalId);
    }

    onMount(async () => {
        try {
            images = await fetchImages();
        } catch (e) {
            console.error('Gallery fetch error:', e);
        } finally {
            loading = false;
        }
        startAuto();
    });

    onDestroy(() => stopAuto());
</script>

<section>
    <div class="section-title-center">
        <h2 class="section-title">Gallery</h2>
        <p class="section-desc">우리들이 음악으로 채운 순간들</p>
    </div>

    <!-- 슬라이더 래퍼 -->
    <div
        class="slider-wrapper"
        role="region"
        aria-label="갤러리 슬라이더"
        onmouseenter={stopAuto}
        onmouseleave={startAuto}
    >
        <div class="slider-track" style="transform: translateX(-{currentPage * 100}%)">
            {#each pages as page, pi}
                <div class="slider-page">
                    <div class="gallery-grid">
                        {#if loading || page.length === 0}
                            <!-- 로딩 스켈레톤 -->
                            <div class="gallery-item large skeleton"></div>
                            <div class="gallery-item skeleton"></div>
                            <div class="gallery-item skeleton"></div>
                        {:else}
                            {#each page as img, idx}
                                <a
                                    href="/gallery"
                                    class="gallery-item {idx === 0 ? 'large' : ''}"
                                    aria-label={img.title || '갤러리 이미지'}
                                >
                                    <img src={img.image_url} alt={img.title || ''} loading="lazy" />
                                    {#if img.title}
                                        <span class="img-title">{img.title}</span>
                                    {/if}
                                </a>
                            {/each}
                        {/if}
                    </div>
                </div>
            {/each}

            <!-- 이미지가 아직 없을 때 스켈레톤 -->
            {#if loading && pages.length === 0}
                <div class="slider-page">
                    <div class="gallery-grid">
                        <div class="gallery-item large skeleton"></div>
                        <div class="gallery-item skeleton"></div>
                        <div class="gallery-item skeleton"></div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- 좌우 버튼 -->
        {#if pages.length > 1}
            <button class="nav-btn prev" onclick={prevPage} aria-label="이전">&#8249;</button>
            <button class="nav-btn next" onclick={nextPage} aria-label="다음">&#8250;</button>

            <!-- 페이지 인디케이터 -->
            <div class="indicators">
                {#each pages as _, i}
                    <button
                        class="dot {currentPage === i ? 'active' : ''}"
                        onclick={() => { currentPage = i; startAuto(); }}
                        aria-label="페이지 {i + 1}"
                    ></button>
                {/each}
            </div>
        {/if}
    </div>

    <div class="more-link">
        <a href="/gallery">+ more</a>
    </div>
</section>

<style lang="scss">
    section {
        max-width: 1400px;
        margin: 0 auto;
    }

    .section-desc {
        font-size: 0.9rem;
        font-weight: 300;
        text-align: center;
        color: #666;
        margin-bottom: 3rem;
    }

    /* ── 슬라이더 ── */
    .slider-wrapper {
        position: relative;
        overflow: hidden;
    }

    .slider-track {
        display: flex;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        will-change: transform;
    }

    .slider-page {
        min-width: 100%;
    }

    /* ── 그리드 ── */
    .gallery-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;

        @media (min-width: 768px) {
            grid-template-columns: 2fr 1fr;
            grid-template-rows: repeat(2, 220px);
            gap: 1.5rem;
        }
    }

    .gallery-item {
        display: block;
        position: relative;
        overflow: hidden;
        background-color: #e8e8e8;
        min-height: 200px;
        text-decoration: none;
        cursor: pointer;

        &:hover img { transform: scale(1.04); }
        &:hover .img-title { opacity: 1; }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
            display: block;
        }

        .img-title {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 0.6rem 0.8rem;
            background: linear-gradient(to top, rgba(0,0,0,0.65), transparent);
            color: #fff;
            font-size: 0.8rem;
            font-weight: 300;
            opacity: 0;
            transition: opacity 0.3s;
        }

        &.large {
            min-height: 250px;

            @media (min-width: 768px) {
                grid-row: span 2;
                min-height: auto;
            }
        }

        &.skeleton {
            background: linear-gradient(90deg, #e8e8e8 25%, #f0f0f0 50%, #e8e8e8 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s infinite;
            cursor: default;
        }
    }

    @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    /* ── 네비게이션 ── */
    .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255,255,255,0.75);
        border: none;
        font-size: 2rem;
        line-height: 1;
        padding: 0.3rem 0.7rem;
        cursor: pointer;
        color: #333;
        transition: background 0.2s;
        z-index: 4;

        &:hover { background: rgba(255,255,255,0.95); }
        &.prev { left: 0; border-radius: 0 4px 4px 0; }
        &.next { right: 0; border-radius: 4px 0 0 4px; }
    }

    .indicators {
        position: absolute;
        bottom: 0.6rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 0.4rem;
        z-index: 5;

        .dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: rgba(0,0,0,0.25);
            border: none;
            padding: 0;
            cursor: pointer;
            transition: background 0.3s, transform 0.2s;

            &.active {
                background: #333;
                transform: scale(1.25);
            }
        }
    }

    /* ── 더 보기 ── */
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
</style>