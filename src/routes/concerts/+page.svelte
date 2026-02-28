<script>
    import { PIANOLIFE_BACKEND_URL } from "$env/static/public";
    import HeroSection from "@/components/common/HeroSection.svelte";
    import concertHeroFallback from "@/assets/images/white.png";
    import ConcertCard from "@/components/concerts/ConcertCard.svelte";

    const API = PIANOLIFE_BACKEND_URL || "http://localhost:8000";

    let concerts = $state([]);
    let loading = $state(true);
    let error = $state(null);

    $effect(() => {
        fetch(`${API}/api/concerts/?active_only=false`)
            .then(res => {
                if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
                return res.json();
            })
            .then(data => { concerts = data; })
            .catch(err => { error = err.message; })
            .finally(() => { loading = false; });
    });

    // ── 달력 상태 ─────────────────────────────────────────
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let viewYear = $state(today.getFullYear());
    let viewMonth = $state(today.getMonth()); // 0-indexed

    const MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    /** "2025-03-15 19:30" 또는 "2025년 3월 15일" → { year, month(0-indexed), day, timeStr } */
    function parseConcertDate(dateStr) {
        if (!dateStr) return null;
        const iso = dateStr.match(/(\d{4})-(\d{2})-(\d{2})(?:[\sT](\d{2}:\d{2}))?/);
        if (iso) return { year: +iso[1], month: +iso[2] - 1, day: +iso[3], timeStr: iso[4] ?? '' };
        const kr = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일(?:\s*(\d{1,2}:\d{2}))?/);
        if (kr) return { year: +kr[1], month: +kr[2] - 1, day: +kr[3], timeStr: kr[4] ?? '' };
        return null;
    }

    /** 예정 공연 중 가장 가까운 것의 배너 or 포스터 이미지 */
    const heroImage = $derived.by(() => {
        const todayStr = new Date().toISOString().slice(0, 10);
        const upcoming = concerts
            .filter(c => c.date && c.date >= todayStr)
            .sort((a, b) => a.date.localeCompare(b.date));
        const c = upcoming[0];
        return c ? (c.banner_image_url || c.poster_url || concertHeroFallback) : concertHeroFallback;
    });

    /** 날짜가 오늘 이전이면 true */
    function isConcertPast(dateStr) {
        const d = parseConcertDate(dateStr);
        if (!d) return false;
        const concertDate = new Date(d.year, d.month, d.day);
        return concertDate < todayDateOnly;
    }

    function concertTimestamp(dateStr) {
        const d = parseConcertDate(dateStr);
        if (!d) return 0;
        return new Date(d.year, d.month, d.day).getTime();
    }

    // 예정 / 지난 공연 분리 + 정렬
    const upcomingConcerts = $derived(
        concerts.filter(c => !isConcertPast(c.date))
                .sort((a, b) => concertTimestamp(a.date) - concertTimestamp(b.date))
    );
    const prevConcerts = $derived(
        concerts.filter(c => isConcertPast(c.date))
                .sort((a, b) => concertTimestamp(b.date) - concertTimestamp(a.date))
    );

    /** 현재 뷰 월에 공연이 있는 day(숫자) Set - 예정 공연만 */
    const concertDaysInView = $derived.by(() => {
        const set = new Set();
        for (const c of upcomingConcerts) {
            const d = parseConcertDate(c.date);
            if (d && d.year === viewYear && d.month === viewMonth) set.add(d.day);
        }
        return set;
    });

    /** 달력 셀 배열 (null = 앞 빈 칸, 숫자 = 날짜) */
    const calendarCells = $derived.by(() => {
        const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const cells = Array(firstDayOfWeek).fill(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        return cells;
    });

    function prevMonth() {
        if (viewMonth === 0) { viewMonth = 11; viewYear--; }
        else viewMonth--;
    }
    function nextMonth() {
        if (viewMonth === 11) { viewMonth = 0; viewYear++; }
        else viewMonth++;
    }
</script>

<svelte:head>
    <title>Concerts - Fiore</title>
</svelte:head>

<div>
    <HeroSection image={heroImage} title="CONCERTS"
        maxHeight="800px"
        imageMaxWidth="100%"
        gradientOverlay="linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.9) 80%, rgba(0, 0, 0, 1.0) 95%)"
        bgAnchor="center center"
        aspectRatio="16/9"
    />

    <section class="description-section">
        <h2 class="section-title-left">
            아티스트를 위한 무대,
            <br>
            당신을 위한 클래식
        </h2>
        <div class="description-content">
            <p>
                피오레 아트앤엔터는 뛰어난 연주력을 갖춘 젊은 신예 아티스트들이 세상 밖으로 힘차게 발돋움할 수 있도록 <bold>기회의 무대</bold>를 엽니다.
                다채로운 <bold>독주회</bold>와 <bold>감각적인 테마 기획 연주회</bold>를 통해, 아티스트는 자신의 성장을 증명하고 관객은 그 벅찬 열정을 가장 가까이에서 호흡합니다.
                <br />
                내일의 거장이 탄생하는 그 빛나는 순간.
                연주자의 깊은 <bold>몰입</bold>과 관객의 높은 <bold>만족</bold>이 공존하는 최상의 무대를 선사합니다.
            </p>
            <br />
            <p>
                Fiore Art &amp; Ent. opens a <bold>stage of opportunity</bold> for talented young artists ready to make their mark on the world.
                Through diverse <bold>solo recitals</bold> and thoughtfully curated <bold>themed concerts</bold>, we invite audiences to witness the growth of these rising stars and share in the emotion of their journey.
                <br />
                Experience the shining moment where future maestros are born.
                We promise a performance that <bold>resonates deeply</bold>, delivering <bold>perfection for the artist and satisfaction</bold> for the audience.
            </p>
        </div>
    </section>

    <!-- ── 예정 공연 (달력 + 카드) ─────────────────── -->
    <section class="section-heading">
        <h2 class="heading-title">Upcoming</h2>
        <p class="heading-sub">다양한 장르와 스타일의 클래식 공연을 선보입니다</p>
    </section>

    <!-- 이 section 안에서만 calendar가 sticky; section이 끝나면 자동으로 사라짐 -->
    <section class="concerts-section">
        <div class="calendar-view">
            <div class="calendar-header">
                <button class="nav-btn" onclick={prevMonth}>&#8592;</button>
                <span class="month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
                <button class="nav-btn" onclick={nextMonth}>&#8594;</button>
            </div>
            <div class="calendar-grid">
                {#each DAY_LABELS as label}
                    <div class="day-label">{label}</div>
                {/each}
                {#each calendarCells as cell}
                    {#if cell === null}
                        <div class="day-cell empty"></div>
                    {:else}
                        <div class="day-cell"
                            class:has-concert={concertDaysInView.has(cell)}
                            class:is-today={cell === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()}
                        >
                            {cell}
                        </div>
                    {/if}
                {/each}
            </div>
        </div>

        <div class="concerts-card-wrapper">
            {#if loading}
                {#each { length: 3 } as _}
                    <div class="card-skeleton"></div>
                {/each}
            {:else if upcomingConcerts.length === 0}
                <p class="empty-message">예정된 공연이 없습니다.</p>
            {:else}
                {#each upcomingConcerts as concert (concert.id)}
                    <ConcertCard {concert} />
                {/each}
            {/if}
        </div>
    </section>

    <!-- ── 지난 공연 (달력 없음, full width) ──────────── -->
    {#if !loading && prevConcerts.length > 0}
        <section class="section-heading section-heading--prev">
            <h2 class="heading-title">Prev.</h2>
        </section>

        <section class="prev-concerts-section">
            {#each prevConcerts as concert (concert.id)}
                <ConcertCard {concert} />
            {/each}
        </section>
    {/if}
</div>

<style lang="scss">
    section {
        max-width: 1400px;
        margin: 0 auto;
    }

    .description-section {
        display: grid;
        grid-template-columns: 450px 1fr;
        padding: 4rem 2rem;
        gap: 2rem;

        @media(--desktop) {
            grid-template-columns: 1fr;
        }   
        @media(--tablet) {
            gap: 1.5rem;
        }
    }

    /* ── 섹션 헤딩 ──────────────────────── */
    .section-heading {
        padding: 0 2rem 1.5rem;
        border-bottom: 1px solid #eee;

        &--prev {
            margin-top: 5rem;
        }

        .heading-title {
            font-size: 1.8rem;
            font-weight: 200;
            letter-spacing: 0.08em;
            margin: 0 0 0.3rem;
        }

        .heading-sub {
            font-size: 0.85rem;
            font-weight: 300;
            color: #999;
            margin: 0;
        }
    }

    /* ── 예정 공연 섹션 (2-col: 달력 | 카드) ─── */
    .concerts-section {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 3rem;
        padding: 2rem;
        align-items: start;
        margin-top: 1rem;

        @media(--desktop) {
            grid-template-columns: 240px 1fr;
            gap: 2rem;
        }
        @media(--tablet) {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
    }

    /* ── 지난 공연 섹션 (full width) ────── */
    .prev-concerts-section {
        display: flex;
        flex-direction: column;
        padding: 2rem;
        padding-bottom: 6rem;
        margin-top: 1rem;
        gap: 1.5rem;

        max-height: 1000px;
        overflow-y: auto;
    }

    /* ── 캘린더 ─────────────────────────── */
    .calendar-view {
        position: sticky;
        top: 100px;
        border: 1px solid #e8e8e8;
        padding: 1.25rem;
        margin: 0 auto;
        min-width: 280px;

        @media(--desktop) {
            min-width: 240px;
        }

        @media(--tablet) {
            position: static;
            min-width: 300px;
        }
    }

    .calendar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;

        .month-label {
            font-size: 0.9rem;
            font-weight: 400;
            letter-spacing: 0.04em;
        }

        .nav-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            color: #555;
            padding: 0.25rem 0.5rem;
            line-height: 1;
            transition: color 0.15s;

            &:hover { color: #000; }
        }
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
    }

    .day-label {
        text-align: center;
        font-size: 0.6rem;
        font-weight: 500;
        color: #bbb;
        letter-spacing: 0.02em;
        padding-bottom: 0.4rem;
    }

    .day-cell {
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.72rem;
        font-weight: 300;
        color: #444;
        border-radius: 2px;

        &.has-concert {
            background: #111;
            color: #fff;
            font-weight: 400;
        }

        &.is-today:not(.has-concert) {
            background: #f0f0f0;
            font-weight: 500;
            color: #000;
        }
    }

    /* ── 공통 카드 래퍼 ─────────────────── */
    .concerts-card-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        max-height: 800px;
        overflow-y: auto;
    }

    /* ── 스켈레톤 ───────────────────────── */
    .card-skeleton {
        height: 150px;
        border: 0.5px solid #eee;
        margin-bottom: -0.5px;
        background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
    }

    @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    .empty-message {
        color: #aaa;
        font-size: 0.9rem;
        font-weight: 300;
        padding: 3rem 0;
        text-align: center;
    }
</style>
