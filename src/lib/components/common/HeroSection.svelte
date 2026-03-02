<script>
    /** @type {string} - 히어로 이미지 경로 */
    export let image;

    /** @type {string} - 메인 타이틀 텍스트 */
    export let title = "";

    /** @type {string} - 서브 타이틀 텍스트 (선택) */
    export let subtitle = "";

    /** @type {string} - 이미지 alt 텍스트 (선택) */
    export let alt = title;

    /** @type {string} - 최대 높이 (선택, 기본값: 1400px) */
    export let maxHeight = "1400px";

    /** @type {string} - 중앙 이미지 최대 너비 (선택, 기본값: 1200px) */
    export let imageMaxWidth = "1200px";

    /** @type {string} - 예: "16/9" 또는 "4/3" */
    export let aspectRatio = "3/4";

    // aspectRatio와 maxHeight로 계산한 maxWidth(px)
    $: maxWidthByAspect = (() => {
        // aspectRatio: "16/9" → 16/9
        const [w, h] = aspectRatio.split('/').map(Number);
        if (!w || !h) return imageMaxWidth;
        // maxHeight: "800px" → 800
        const mh = typeof maxHeight === 'string' ? parseFloat(maxHeight) : maxHeight;
        if (!mh) return imageMaxWidth;
        return (mh * w / h) + 'px';
    })();

    /** @type {string} - 그라데이션 오버레이 CSS (선택, 기본값: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.9) 70%)) */
    export let gradientOverlay = "linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.9) 70%)";

    /** @type {string} bg imge anchor*/
    export let bgAnchor = "top center";

    /** @type {boolean} 스크롤 시 배경 이미지 위치 조정 여부 */
    export let scrollAction = true;

    /** @type {boolean} */
    export let blurImageOutline = false;

    let scrollY = 0;
</script>

<svelte:window bind:scrollY={scrollY} />

<section class="hero-section" 
    style="
        --max-height: {maxHeight}; 
        --image-max-width: {imageMaxWidth}; 
        --aspect-ratio: {aspectRatio};
        --gradient-overlay: {gradientOverlay};
        --bg-anchor: {bgAnchor};    
    "
>
    <div class="hero-image-container">
        <img src={image} alt="{alt} Background" class="hero-image-background"
            style="transform: translateY(calc({scrollAction ? scrollY : 0} * 0.7px));
                {blurImageOutline
                    ? `mask-image:
                            linear-gradient(to bottom, transparent 5%, black 10%, black 100%);
                       -webkit-mask-image: 
                            linear-gradient(to bottom, transparent 5%, black 10%, black 100%);
                       mask-composite: intersect;
                       -webkit-mask-composite: source-in;`
                    : ''}
            "
        />
        <!-- <div class="hero-image-background-overlay"></div> -->
        <img src={image} alt={alt} class="hero-image"
            style="
                --scroll-y: {scrollAction ? scrollY : 0};
                {blurImageOutline
                    ? `mask-image:
                            linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), 
                            linear-gradient(to bottom, transparent 10%, black 20%, black 100%);
                       -webkit-mask-image: 
                            linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), 
                            linear-gradient(to bottom, transparent 10%, black 20%, black 100%);
                       mask-composite: intersect;
                       -webkit-mask-composite: source-in;`
                    : ''}
            "
        />
        <!-- <div class="hero-image-overlay"></div> -->
    </div>

    <div class="hero-content">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
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
    background-color: black;

    * {
        height: 100vh;
        max-height: var(--max-height, 1400px);
    }

    .hero-image {
        position: absolute;
        
        width: 100vw;
        height: 100%;
        max-height: var(--max-height, 1400px);
        max-width: var(--image-max-width, 1400px);
        object-fit: cover;
        z-index: 3;
        aspect-ratio: var(--aspect-ratio, "3/4");

        object-position: var(--bg-anchor, top center);
        transform: translateY(calc(var(--scroll-y) * 0.7px));
    }

    .hero-image-background {
        height: 100vh;
        object-fit: cover;
        z-index: 1;
        width: 100vw;
        filter: blur(24px);
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
    top: 50%;
    left: 0;
    transform: translateY(-20%);
    height: 100%;
    text-align: center;
    z-index: 5;
    width: 100%;

    h1 {
        color: white;
        font-weight: 100;
        margin-top: 10rem;
        letter-spacing: 0.3em;
        padding-left: 0.5em;
        margin-bottom: 1rem;

        @media (--tablet) {
            letter-spacing: 0.3em;
            padding-left: 0.3em;
        }
        @media (--mobile) {
            letter-spacing: 0.2em;
            padding-left: 0.2em;
        }
    }
    h2 {
        color: white;
        font-weight: 100;
        letter-spacing: 0.1em;
    }
}
</style>
