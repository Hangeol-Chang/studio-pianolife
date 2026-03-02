<!-- Template 1: Title top center + full-width main + asymmetric thumbnail grid -->
<script>
    let { item } = $props();
</script>

<div class="template">
    <div class="header">
        <span class="label">Artist</span>
        <h2 class="name">{item.title}</h2>
        {#if item.subTitle}
            <span class="sub">{item.subTitle}</span>
        {/if}
    </div>

    <!-- Full-width tall main image -->
    <div class="main-image">
        {#if item.mainImage}
            <img src={item.mainImage} alt={item.title} loading="lazy" />
        {:else}
            <div class="placeholder"></div>
        {/if}
    </div>

    <!-- Asymmetric grid: big left + 2 stacked right + overflow strip -->
    <div class="thumb-grid">
        {#each item.thumbnails.slice(0, 4) as thumb, i}
            <div class="thumb-cell cell-{i}">
                {#if thumb}
                    <img src={thumb} alt="" />
                {:else}
                    <div class="placeholder"></div>
                {/if}
            </div>
        {/each}
    </div>

</div>

<style lang="scss">
    .template { width: 100%; }

    .header {
        text-align: center;
        padding: 0 1rem 2rem;

        .label {
            display: block;
            font-size: 0.75rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #aaa;
            margin-bottom: 0.75rem;
        }

        .name {
            font-family: 'GounBatang', serif;
            font-size: clamp(1.6rem, 3.5vw, 2.8rem);
            font-weight: 300;
            margin: 0 0 0.4rem;
            color: #111;
        }

        .sub {
            font-size: 0.95rem;
            color: #999;
            letter-spacing: 0.1em;
        }
    }

    .main-image {
        width: 100%;
        aspect-ratio: 3 / 4;
        overflow: hidden;
        background: #e0e0e0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .placeholder { width: 100%; height: 100%; background: #ddd; }
    }

    /* Asymmetric 2-col grid */
    .thumb-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 4px;
        margin-top: 4px;

        @media (min-width: 768px) {
            grid-template-columns: 2fr 1fr 1fr;
            grid-template-rows: 220px 220px;
        }
    }

    .thumb-cell {
        overflow: hidden;
        background: #e8e8e8;
        aspect-ratio: 1;

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

    /* Desktop: cell-0 spans 2 rows on the left */
    @media (min-width: 768px) {
        .thumb-cell {
            aspect-ratio: unset;
            height: 100%;
        }
        .cell-0 { grid-row: 1 / 3; }
    }

</style>
