<script>
    /** @type {string} - 히어로 이미지 경로 */
    export let image;

    /** @type {string} - 메인 타이틀 텍스트 */
    export let title = "";

    /** @type {string} - 이미지 alt 텍스트 (선택) */
    export let alt = title;

    /** @type {string} - 최대 높이 (선택, 기본값: 1400px) */
    export let maxHeight = "1400px";

    /** @type {string} - 중앙 이미지 최대 너비 (선택, 기본값: 1200px) */
    export let imageMaxWidth = "1200px";

    /** @type {string} - 그라데이션 오버레이 CSS (선택, 기본값: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.9) 70%)) */
    export let gradientOverlay = "linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.9) 70%)";

    /** @type {string} bg imge anchor*/
    export let bgAnchor = "top center";

    let scrollY = 0;
</script>

<svelte:window bind:scrollY={scrollY} />

<section class="hero-section" 
    style="
        --max-height: {maxHeight}; 
        --image-max-width: {imageMaxWidth}; 
        --gradient-overlay: {gradientOverlay};
        --bg-anchor: {bgAnchor};    
    "
>
    <div class="hero-image-container">
        <img src={image} alt="{alt} Background" class="hero-image-background" />
        <div class="hero-image-background-overlay"></div>
        <img src={image} alt={alt} class="hero-image" style="--scroll-y: {scrollY}"/>
        <div class="hero-image-overlay"></div>
    </div>

    <div class="hero-content">
        {#if title}
            <h1 class="main-title">{title}</h1>
        {/if}
        <slot />
    </div>
</section>

<style lang="scss">
.hero-section {
    position: relative;
    padding: 0;
    margin: 0;
    height: 100vh;
    max-height: var(--max-height, 1400px);
    overflow: hidden;
}

.hero-image-container {
    position: absolute;
    display: flex;
    justify-content: center;

    * {
        min-height: 100vh;
        height: 100vh;
        max-height: var(--max-height, 1400px);
    }

    .hero-image {
        position: absolute;
        width: 100vw;
        max-width: var(--image-max-width, 1200px);
        object-fit: cover;
        z-index: 3;

        object-position: var(--bg-anchor, top center);
        transform: translateY(calc(var(--scroll-y) * 0.7px));
    }

    .hero-image-background {
        height: 100vh;
        object-fit: cover;
        z-index: 1;
        width: 100vw;
        filter: blur(8px);
    }

    .hero-image-background-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2;
    }

    .hero-image-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100vh;
        background: var(--gradient-overlay, linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.9) 70%));
        z-index: 4;
    }
}

.hero-content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    text-align: center;
    z-index: 5;
    width: 100%;

    .main-title {
        color: white;
        font-weight: 100;
        font-size: 5rem;
        margin-top: 10rem;
        letter-spacing: 0.5em;
        padding-left: 0.5em;
        margin-bottom: 1rem;

        @media (--tablet) {
            font-size: 3rem;
            letter-spacing: 0.3em;
            padding-left: 0.3em;
        }
        @media (--mobile) {
            font-size: 2rem;
            letter-spacing: 0.2em;
            padding-left: 0.2em;
        }
    }
}
</style>
