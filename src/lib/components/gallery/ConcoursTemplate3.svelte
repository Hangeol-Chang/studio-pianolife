<!-- Concours Template 3: Info header + masonry thumb grid -->
<script>
    let { item } = $props();
</script>

<section class="template">
    <!-- 상단: 정보 헤더 -->
    <div class="info-header">
        <span class="label">Concours</span>
        <h2 class="name">{item.title}</h2>
        {#if item.date}<span class="date">{item.date}</span>{/if}
    </div>

    <!-- 썸네일 매소너리 그리드 -->
    <div class="thumb-grid">
        {#each item.thumbnails as thumb, i}
            <div class="thumb-item cell-{Math.min(i, 4)}">
                {#if thumb}
                    <img src={thumb} alt="" loading="lazy" />
                {:else}
                    <div class="placeholder"></div>
                {/if}
            </div>
        {/each}
    </div>
</section>

<style lang="scss">
    .template { width: 100%; }

    .info-header {
        display: flex;
        align-items: baseline;
        gap: 1rem;
        padding: 0 0 1rem;
        border-bottom: 1px solid #eee;
        margin-bottom: 1rem;

        .label {
            font-size: 0.68rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #bbb;
            white-space: nowrap;
        }
        .name {
            font-size: clamp(1.2rem, 2vw, 1.8rem);
            font-weight: 300;
            color: #111;
            margin: 0;
        }
        .date {
            font-size: 0.82rem;
            color: #aaa;
            margin-left: auto;
            white-space: nowrap;
        }
    }

    .thumb-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;

        @media (max-width: 640px) {
            grid-template-columns: 1fr 1fr;
        }
    }

    /* 첫 번째 셀은 더 넓게 */
    .cell-0 {
        grid-column: 1 / 3;
        aspect-ratio: 2 / 1;
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
