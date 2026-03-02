<!-- Template 3: Mosaic grid — main big left spanning 2 rows, 2×2 thumbs right -->
<script>
    let { item } = $props();
</script>

<div class="template">
    <div class="label-row">
        <span class="label">Artist</span>
        <h2 class="name">{item.title}</h2>
        {#if item.subTitle}<span class="sub">{item.subTitle}</span>{/if}
    </div>

    <div class="mosaic">
        <!-- Main: spans full height left -->
        <div class="cell main-cell">
            {#if item.mainImage}
                <img src={item.mainImage} alt={item.title} loading="lazy" />
            {:else}
                <div class="placeholder"></div>
            {/if}
        </div>

        <!-- 4 thumbs in 2x2 right -->
        {#each item.thumbnails.slice(0, 4) as thumb, i}
            <div class="cell thumb-cell">
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

    .label-row {
        display: flex;
        align-items: baseline;
        gap: 1rem;
        margin-bottom: 1rem;

        .label {
            font-size: 0.7rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #bbb;
        }

        .name {
            font-family: 'GounBatang', serif;
            font-size: clamp(1.4rem, 2.5vw, 2rem);
            font-weight: 300;
            color: #111;
            margin: 0;
        }

        .sub {
            font-size: 0.85rem;
            color: #aaa;
        }
    }

    .mosaic {
        display: grid;
        grid-template-columns: 1.6fr 1fr 1fr;
        grid-template-rows: 300px 300px;
        gap: 6px;

        @media (max-width: 600px) {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 260px 200px 200px;
        }
    }

    .cell {
        overflow: hidden;
        background: #e0e0e0;

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

    .main-cell {
        grid-row: 1 / 3;

        @media (max-width: 600px) {
            grid-column: 1 / 3;
            grid-row: 1;
        }
    }

</style>
