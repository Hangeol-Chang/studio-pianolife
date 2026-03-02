<script>
    import HeroSection from './HeroSection.svelte';

    let {
        title = '',
        subtitle='',

        filters = [],
        activeFilter = '',
        onFilter = () => {},
        /** @type {string|null} 배경 이미지 경로 (없으면 compact 모드) */
        image = null,
        maxHeight = '700px',
        imageMaxWidth = '1400px',
        aspectRatio = '16/9',
        /** bgAnchor: 이미지를 제목보다 아래 Y 위치에 노출 */
        bgAnchor = 'center bottom',

        gradientOverlay = 'linear-gradient(to bottom, #000 10%, #fff 90%)',

        scrollAction = true, // 스크롤 시 배경 이미지 위치 조정 여부

        heroTitle = "",
        heroSubtitle = "",

    } = $props();
</script>

<section class="nav-section" class:has-image={image}>
    <div class="gradient-overlay" style="--gradient-overlay: {gradientOverlay};"></div>
    
    <h1>{title}</h1>
    <h3>{subtitle}</h3>

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
    {#if image}
        <HeroSection
            {image}
            {maxHeight}
            {imageMaxWidth}
            {aspectRatio}
            {bgAnchor}
            title={heroTitle}
            subtitle={heroSubtitle}
            gradientOverlay='transparent'
            blurImageOutline={true}
            {scrollAction}
        >
        </HeroSection>
    {/if}
</section>

<style lang="scss">
    .gradient-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: var(--gradient-overlay, linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.9) 70%));
    }

    .nav-section {
        * {
            z-index: 11;
        }
        position: relative;
        width: 100%;
        min-height: 500px;
        background-color: black;

        display: flex;
        flex-direction: column;
        padding: 4rem 0 0;
        
        h1 {
            font-family: 'GounBatang', serif;
            font-weight: 300;
            color: white;
            z-index: 12;
            margin: 2rem 0 1.5rem;
            text-align: center;

            letter-spacing: 4rem;
            padding-left: 4rem;
            @media (max-width: 1024px) { letter-spacing: 2rem; padding-left: 2rem; }
            @media (max-width: 600px)  { letter-spacing: 1rem; padding-left: 1rem; }
        }
        h3 {
            font-family: 'GounBatang', serif;
            font-weight: 300;
            color: white;
            z-index: 12;
            margin: 0 0 2rem;
            text-align: center;

            letter-spacing: 0.5em;
        }
    }

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

        &:hover {
            color: #222;
            &::after { width: 100%; }
        }
        &.active {
            color: #111;
            font-weight: 700;
            &::after { width: 100%; }
        }
    }

    /* 이미지 있을 때: 기본 회색(반투명 흰색) → 클릭 시 흰색 */
    .has-image .filter-btn {
        color: rgba(255, 255, 255, 0.55);

        &:hover {
            color: rgba(255, 255, 255, 0.85);
        }
        &.active {
            color: #fff;
            font-weight: 500;
        }
    }
</style>
