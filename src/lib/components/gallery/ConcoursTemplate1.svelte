<!-- Concours Template 1: Info left + 2-col thumb grid right -->
<script>
    let { item } = $props();
</script>

<section class="template">
    <div class="layout">
        <!-- 왼쪽: 정보 -->
        <div class="info-col">
            <span class="label">Concours</span>
            <h2 class="name">{item.title}</h2>
            {#if item.date}<span class="date">{item.date}</span>{/if}
        </div>

        <!-- 오른쪽: 2열 썸네일 그리드 -->
        <div class="thumb-col">
            {#each item.thumbnails as thumb}
                <div class="thumb-item">
                    {#if thumb}
                        <img src={thumb} alt="" loading="lazy" />
                    {:else}
                        <div class="placeholder"></div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
    .template { width: 100%; }

    .layout {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 12px;
        align-items: start;

        @media (max-width: 640px) {
            grid-template-columns: 1fr;
        }
    }

    .info-col {
        position: sticky;
        top: 1rem;
        padding: 1.5rem;
        background: #fafafa;

        .label {
            display: block;
            font-size: 0.68rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #bbb;
            margin-bottom: 0.6rem;
        }
        .name {
            font-size: clamp(1.2rem, 2vw, 1.8rem);
            font-weight: 300;
            color: #111;
            margin: 0 0 0.5rem;
            line-height: 1.3;
        }
        .date {
            font-size: 0.82rem;
            color: #aaa;
            letter-spacing: 0.05em;
        }

        @media (max-width: 640px) {
            position: static;
            padding: 1rem;
        }
    }

    .thumb-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
    }

    .thumb-item {
        aspect-ratio: 3 / 2;
        overflow: hidden;
        background: #e8e8e8;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.4s ease;
            &:hover { transform: scale(1.04); }
        }
        .placeholder { width: 100%; height: 100%; background: #ddd; }
    }
</style>
