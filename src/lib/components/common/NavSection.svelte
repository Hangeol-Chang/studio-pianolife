<script>
    import HeroSection from './HeroSection.svelte';

    let {
        title = '',
        filters = [],
        activeFilter = '',
        onFilter = () => {},
        /** @type {string|null} 배경 이미지 경로 (없으면 compact 모드) */
        image = null,
        maxHeight = '680px',
        imageMaxWidth = '1200px',
        aspectRatio = '3/4',
        /** bgAnchor: 이미지를 제목보다 아래 Y 위치에 노출 */
        bgAnchor = 'center bottom',
        // gradientOverlay는 항상 transparent로 고정 — 외부에서 덮어쓸 수 없음
    } = $props();
</script>

{#if image}
    <!-- ── 이미지 모드: HeroSection 래핑, gradient 강제 transparent ── -->
    <div class="nav-hero-wrap">
        <HeroSection
            {image}
            {title}
            {maxHeight}
            {imageMaxWidth}
            {aspectRatio}
            {bgAnchor}
            gradientOverlay="transparent"
        >
            {#if filters.length > 0}
                <nav class="filter-nav">
                    {#each filters as filter}
                        <button
                            class="filter-btn light"
                            class:active={activeFilter === filter}
                            onclick={() => onFilter(filter)}
                        >
                            {filter}
                        </button>
                    {/each}
                </nav>
            {/if}
        </HeroSection>
    </div>
{:else}
    <!-- ── Compact 모드: 이미지 없음 ── -->
    <section class="nav-compact">
        {#if title}
            <h1 class="section-title">{title}</h1>
        {/if}
        {#if filters.length > 0}
            <nav class="filter-nav">
                {#each filters as filter}
                    <button
                        class="filter-btn"
                        class:active={activeFilter === filter}
                        onclick={() => onFilter(filter)}
                    >
                        {filter}
                    </button>
                {/each}
            </nav>
        {/if}
    </section>
{/if}

<style lang="scss">
    /* ── 이미지 모드 래퍼 ── */
    .nav-hero-wrap {
        width: 100%;

        /*
         * HeroSection의 .hero-image 에 top 오프셋을 줘서
         * 이미지가 제목보다 아래(Y) 위치에서 시작되도록 함
         */
        :global(.hero-image) {
            top: 18% !important;
            height: 90% !important;
        }

        /* filter-nav 는 hero-content 슬롯 안에 렌더되므로
           bottom 기준 절대 위치로 고정 */
        :global(.hero-content) {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding-bottom: 3rem;
        }
    }

    /* ── Compact 모드 ── */
    .nav-compact {
        position: relative;
        width: 100%;
        min-height: 280px;
        background: linear-gradient(to bottom, #000, #fff 90%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        padding-bottom: 3rem;
    }

    .section-title {
        font-family: 'GounBatang', serif;
        font-weight: 300;
        text-align: center;
        letter-spacing: 4rem;
        padding-left: 4rem;
        margin: 0 0 3rem;
        color: white;

        @media (max-width: 1024px) { letter-spacing: 2rem; padding-left: 2rem; }
        @media (max-width: 600px)  { letter-spacing: 1rem; padding-left: 1rem; }
    }

    /* ── Filter nav (공통) ── */
    .filter-nav {
        display: flex;
        justify-content: center;
        gap: clamp(1.5rem, 5vw, 5rem);
        padding: 0 5vw;
        width: 100%;
    }

    .filter-btn {
        font-family: 'GounBatang', serif;
        font-size: clamp(0.9rem, 1.5vw, 1.1rem);
        font-weight: 300;
        letter-spacing: 0.08em;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem 0;
        color: #888;
        position: relative;
        transition: color 0.25s;

        &::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0;
            width: 0; height: 1px;
            background: currentColor;
            transition: width 0.25s ease;
        }

        &:hover { color: #222; &::after { width: 100%; } }
        &.active { color: #111; font-weight: 700; &::after { width: 100%; } }

        &.light {
            color: rgba(255,255,255,0.65);
            &:hover { color: #fff; }
            &.active { color: #fff; }
        }
    }
</style>
