<script>
    import { fly } from 'svelte/transition';
    import { PIANOLIFE_BACKEND_URL } from '$env/static/public';
    import NavSection from '@/components/common/NavSection.svelte';

    // Artist Templates
    import ArtistTemplate0 from '@/components/gallery/ArtistTemplate0.svelte';
    import ArtistTemplate2 from '@/components/gallery/ArtistTemplate2.svelte';

    // Concert Templates
    import ConcertTemplate0 from '@/components/gallery/ConcertTemplate0.svelte';

    // Concours Templates
    import ConcoursTemplate0 from '@/components/gallery/ConcoursTemplate0.svelte';
    import ConcoursTemplate1 from '@/components/gallery/ConcoursTemplate1.svelte';
    import ConcoursTemplate2 from '@/components/gallery/ConcoursTemplate2.svelte';
    import ConcoursTemplate3 from '@/components/gallery/ConcoursTemplate3.svelte';

    const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';

    // ── API 데이터 → 갤러리 아이템 변환 ─────────────────────
    function toArtistItem(a) {
        return {
            id:         a.id,
            category:   'artist',
            title:      a.name,
            subTitle:   a.name_en ?? '',
            mainImage:  a.image_url || '',
            thumbnails: (a.image_list ?? []).map(img => img.url).filter(Boolean),
        };
    }

    function toConcertItem(c) {
        return {
            id:         c.id,
            category:   'concert',
            title:      c.title,
            date:       c.date ?? '',
            mainImage:  c.poster_url || '',
            thumbnails: (c.image_list ?? []).map(img => img.url).filter(Boolean),
        };
    }

    function toConcoursItem(c) {
        return {
            id:         c.id,
            category:   'concours',
            title:      c.title,
            date:       c.date ?? '',
            mainImage:  c.poster_url || '',
            thumbnails: (c.image_list ?? []).map(img => img.url).filter(Boolean),
        };
    }

    // ── 상태 ─────────────────────────────────────────────────
    let galleryItems = $state([]);
    let loading = $state(true);
    let error = $state(null);

    const ARTIST_TEMPLATES  = [
        { component: ArtistTemplate0, reversed: false },
        { component: ArtistTemplate0, reversed: true  },
        { component: ArtistTemplate2, reversed: false },
        { component: ArtistTemplate2, reversed: true  },
    ];
    const CONCERT_TEMPLATES = [
        { component: ConcertTemplate0, reversed: false },
        { component: ConcertTemplate0, reversed: true  },
        { component: ConcertTemplate0, reversed: false },
        { component: ConcertTemplate0, reversed: true  },
    ];
    const CONCOURS_TEMPLATES= [ConcoursTemplate0,ConcoursTemplate1,ConcoursTemplate2,ConcoursTemplate3];

    function getTemplate(item) {
        const idx = item.id % 4;
        if (item.category === 'artist')   return ARTIST_TEMPLATES[idx];
        if (item.category === 'concert')  return CONCERT_TEMPLATES[idx];
        if (item.category === 'concours') return { component: CONCOURS_TEMPLATES[idx], reversed: false };
        return { component: ArtistTemplate0, reversed: false };
    }

    const filters = ['Artists', 'Concerts', 'Concours'];
    let activeFilter = $state('Artists');

    const categoryMap = { 'Artists': 'artist', 'Concerts': 'concert', 'Concours': 'concours' };

    const filteredItems = $derived(
        galleryItems.filter(item => item.category === categoryMap[activeFilter])
    );

    // ── 점진 렌더링 ───────────────────────────────────────────
    const BATCH = 4;
    let visibleCount = $state(BATCH);

    // 필터 변경 시 visibleCount 리셋
    $effect(() => {
        activeFilter;           // 의존성 등록
        visibleCount = BATCH;
    });

    const visibleItems = $derived(filteredItems.slice(0, visibleCount));
    const hasMore = $derived(visibleCount < filteredItems.length);

    /** 목록 끝 sentinel: 화면에 들어오면 BATCH 개씩 추가 렌더 */
    function sentinel(node) {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) visibleCount += BATCH; },
            { rootMargin: '200px' }
        );
        obs.observe(node);
        return { destroy() { obs.disconnect(); } };
    }

    // ── 데이터 fetch ──────────────────────────────────────────
    $effect(() => {
        Promise.all([
            fetch(`${API}/api/artists/?active_only=true`).then(r => r.json()),
            fetch(`${API}/api/concerts/?active_only=true`).then(r => r.json()),
            fetch(`${API}/api/concours/?active_only=true`).then(r => r.json()),
        ])
            .then(([artists, concerts, concoursList]) => {
                const hasImages = item => !!(item.mainImage || item.thumbnails.length > 0);
                const hadSubImages = item => item.thumbnails.length > 0;
                galleryItems = [
                    ...artists.map(toArtistItem).filter(hasImages),
                    ...concerts.map(toConcertItem).filter(hadSubImages),
                    ...concoursList.map(toConcoursItem).filter(hadSubImages),
                ];
            })
            .catch(err => { error = err.message; })
            .finally(() => { loading = false; });
    });
</script>

<svelte:head>
    <title>Gallery - Fiore</title>
</svelte:head>

<div>
    <!-- Filter Navigation -->
    <NavSection
        title="Gallery"
        {filters}
        {activeFilter}
        onFilter={(f) => { activeFilter = f; }}
    />

    <!-- Gallery List -->
    <div class="gallery-list">
        {#if loading}
            <div class="status-msg">불러오는 중…</div>
        {:else if error}
            <div class="status-msg error">{error}</div>
        {:else if filteredItems.length === 0}
            <div class="status-msg">등록된 항목이 없습니다.</div>
        {:else}
            {#each visibleItems as item (item.category + item.id)}
                {@const tpl = getTemplate(item)}
                {@const Tpl = tpl.component}
                <section class="gallery-group" in:fly={{ y: 30, duration: 600, delay: 80 }}>
                    <div class="container">
                        <Tpl {item} reversed={tpl.reversed} />
                    </div>
                </section>
            {/each}

            <!-- 스크롤 sentinel: 화면에 들어오면 다음 배치 렌더 -->
            {#if hasMore}
                <div class="sentinel" use:sentinel></div>
            {:else if filteredItems.length > BATCH}
                <p class="all-loaded">— 전체 {filteredItems.length}개 —</p>
            {/if}
        {/if}
    </div>
</div>

<style lang="scss">
    .gallery-group {
        margin-bottom: 6rem;
    }


    .gallery-list {
        padding-bottom: 6rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .status-msg {
        padding: 6rem 2rem;
        text-align: center;
        color: #999;
        font-size: 1rem;

        &.error { color: #c0392b; }
    }
</style>