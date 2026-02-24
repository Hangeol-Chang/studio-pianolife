<script>
    import { flip } from 'svelte/animate';
    import { onMount, onDestroy } from 'svelte';
    import { PIANOLIFE_BACKEND_URL } from '$env/static/public';
    import MoreButton from '@/components/common/moreButton.svelte';

    const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';

    // ── 날짜 파싱 / 기간 판별 ──────────────────────────────
    const todayDateOnly = new Date();
    todayDateOnly.setHours(0, 0, 0, 0);

    function parseConcertDate(dateStr) {
        if (!dateStr) return null;
        const iso = dateStr.match(/(\d{4})-(\d{2})-(\d{2})(?:[\sT](\d{2}:\d{2}))?/);
        if (iso) return { year: +iso[1], month: +iso[2] - 1, day: +iso[3] };
        const kr = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
        if (kr) return { year: +kr[1], month: +kr[2] - 1, day: +kr[3] };
        return null;
    }

    function isConcertPast(dateStr) {
        const d = parseConcertDate(dateStr);
        if (!d) return false;
        return new Date(d.year, d.month, d.day) < todayDateOnly;
    }

    // ── 캐러셀 상태 ──────────────────────────────────────
    let rawConcerts = $state([]);
    let loading = $state(true);

    // 아직 기간이 안 지난 공연만 + 날짜 오름차순
    const upcomingConcerts = $derived(
        rawConcerts
            .filter(c => !isConcertPast(c.date))
            .sort((a, b) => {
                const da = parseConcertDate(a.date);
                const db = parseConcertDate(b.date);
                if (!da || !db) return 0;
                return new Date(da.year, da.month, da.day) - new Date(db.year, db.month, db.day);
            })
    );

    // 캐러셀용: 마지막 아이템을 앞에 배치 (왼쪽 버퍼)
    let concerts = $state([]);
    $effect(() => {
        const list = upcomingConcerts;
        if (list.length === 0) { concerts = []; return; }

        // 5개 미만이면 반복해서 최소 5개 확보 (flip key 충돌 방지를 위해 _key 부여)
        let padded = list.map((c, i) => ({ ...c, _key: `${c.id}_0_${i}` }));
        let cycle = 1;
        while (padded.length < 5) {
            padded = [...padded, ...list.map((c, i) => ({ ...c, _key: `${c.id}_${cycle}_${i}` }))];
            cycle++;
        }

        concerts = [padded[padded.length - 1], ...padded.slice(0, padded.length - 1)];
    });

    let intervalId;
    let progressIntervalId;
    let progress = $state(0);
    const SCROLL_DURATION = 5000;

    function rotateNext() {
        if (!concerts.length) return;
        concerts = [...concerts.slice(1), concerts[0]];
    }
    function rotatePrev() {
        if (!concerts.length) return;
        concerts = [concerts[concerts.length - 1], ...concerts.slice(0, -1)];
    }

    function startAutoRotation() {
        clearInterval(intervalId);
        clearInterval(progressIntervalId);
        let startTime = Date.now();
        progress = 0;
        intervalId = setInterval(() => {
            rotateNext();
            startTime = Date.now();
            progress = 0;
        }, SCROLL_DURATION);
        progressIntervalId = setInterval(() => {
            progress = Math.min(((Date.now() - startTime) / SCROLL_DURATION) * 100, 100);
        }, 20);
    }

    function stopAutoRotation() {
        clearInterval(intervalId);
        clearInterval(progressIntervalId);
        progress = 0;
    }

    onMount(async () => {
        try {
            const res = await fetch(`${API}/api/concerts/?active_only=false`);
            if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
            rawConcerts = await res.json();
        } catch (e) {
            console.error('콘서트 로딩 실패:', e);
        } finally {
            loading = false;
        }
        startAutoRotation();
    });
    onDestroy(() => { stopAutoRotation(); });
</script>

<section>
    <h1 class="section-title-center">Concerts</h1>
    <MoreButton href="/concerts" />    

    <!-- Desktop Grid View -->
    <div class="grid-wrapper">
        {#if loading}
            <div class="skeleton-row">
                {#each { length: 3 } as _}
                    <div class="card-skeleton"></div>
                {/each}
            </div>
        {:else if concerts.length === 0}
            <p class="empty-message">예정된 공연이 없습니다.</p>
        {:else}
        <div class="concerts-grid-container" 
            role="region" aria-label="Concert Carousel"
        >
            {#each concerts.slice(0, 5) as concert, i (concert._key)} 
                <div 
                    class="concert-item-grid" 
                    class:main-poster={i === 1}
                    class:buffer-item={i === 0 || i === 4}
                    animate:flip={{duration: 500}}
                >
                    <a href="/concerts/{concert.id}" class="concert-link">
                        <div class="concert-image">
                            {#if concert.poster_url}
                                <img src={concert.poster_url} alt={concert.title} />
                            {:else}
                                <div class="poster-placeholder"></div>
                            {/if}
                            <!-- Overlay for non-active items -->
                            {#if i !== 1}
                            <button
                                class="inactive-overlay"
                                aria-label="다음 공연 보기"
                                onclick={(e) => {
                                    e.preventDefault();
                                    rotateNext();
                                    startAutoRotation();
                                }}
                            ></button>
                            {/if}
                        </div>
                    </a>
                    
                    {#if i === 1}
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: {progress}%;"></div>
                        </div>
                    {/if}

                    <div class="concert-info">
                        <h3>{concert.title}</h3>
                    </div>
                </div>
            {/each}
        </div>
        {/if}
    </div>

</section>

<style lang="scss">
    .grid-wrapper {
        max-width: 1280px;
        margin: 3rem auto 0 auto;
        overflow: hidden;
    }

    .concerts-grid-container {
        display: grid;
        width: calc(100% + 600px + 4rem);
        margin-left: calc(-300px - 2rem);
        
        grid-template-columns: 300px 2fr 1.5fr 1.5fr 300px; 
        align-items: start;
        
        @media (--tablet) {
            grid-template-columns: 300px 2fr 1.5fr 300px 0px;
        }
    }

    .concert-item-grid {
        width: 100%;
        display: flex;
        flex-direction: column;
        transition: all 0.5s ease;
        position: relative;
        padding: 2rem;

        @media (--tablet) {
            padding: 1rem;
        }

        &.buffer-item {
            opacity: 0;
            pointer-events: none;
        }

        .concert-image {
            width: 100%;
            height: auto;
            transition: all 0.5s ease;
            cursor: pointer;
            box-shadow: none; 
            transform-origin: top center;

        }
        
        h3 {
            font-size: 1rem;
            opacity: 0.6;
            transition: all 0.5s ease;
            text-align: center;
        }

        &.main-poster {
            .concert-image {
                opacity: 1;
                cursor: default;
            }
            
            h3 {
                font-size: 1.4rem;
                opacity: 1;
                font-weight: 500;
            }
        }
    }

    .progress-bar-container {
        width: 100%;
        height: 2px;
        background-color: #eee;
        margin-top: 1rem;
        margin-bottom: 1rem;
        border-radius: 1px;
        overflow: hidden;
    }

    .progress-bar {
        height: 100%;
        background-color: #333;
        width: 0%;
        transition: width 0.05s linear;
    }

    .inactive-overlay {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 10;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .poster-placeholder {
        width: 100%;
        aspect-ratio: 2/3;
        background: linear-gradient(135deg, #e0e0e0, #c8c8c8);
    }

    .skeleton-row {
        display: flex;
        gap: 2rem;
        justify-content: center;
        padding: 2rem;
    }

    .card-skeleton {
        flex: 0 0 220px;
        aspect-ratio: 2/3;
        background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
    }

    @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    .empty-message {
        text-align: center;
        color: #aaa;
        font-size: 0.9rem;
        font-weight: 300;
        padding: 4rem 0;
    }

    .concert-link {
        display: block;
        text-decoration: none;
        color: inherit;
    }

    .concert-image {
        width: 100%;
        background-color: #e5e5e5;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        overflow: hidden;
        position: relative;
        
        img {
            width: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
    }

    .concert-info {
        h3 {
            color: #333;
            margin: 0;
            line-height: 1.4;
            text-align: left;
        }
    }
</style>