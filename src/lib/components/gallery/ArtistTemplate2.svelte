<!-- Template 2: Text + thumbnail column left, large main image right -->
<script>
    let { item, reversed = false } = $props();
</script>

<div class="template" class:reversed>
    <div class="body">
        <!-- Left: title + stacked thumbs -->
        <div class="left-col">
            <div class="text-block">
                <span class="label">Artist</span>
                <h2 class="name">{item.title}</h2>
                {#if item.subTitle}
                    <span class="sub">{item.subTitle}</span>
                {/if}
            </div>

            <div class="thumb-stack">
                {#each item.thumbnails.slice(0, 3) as thumb}
                    <div class="thumb-item">
                        {#if thumb}
                            <img src={thumb} alt="" />
                        {:else}
                            <div class="placeholder"></div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

        <!-- Right: large main image -->
        <div class="main-image">
            {#if item.mainImage}
                <img src={item.mainImage} alt={item.title} loading="lazy" />
            {:else}
                <div class="placeholder"></div>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    .template {
        width: 100%;

        &.reversed .body {
            flex-direction: row-reverse;
        }
    }

    .body {
        display: flex;
        gap: 12px;
        align-items: stretch;
        min-height: 560px;

        @media (max-width: 600px) {
            flex-direction: column-reverse;
            min-height: unset;
        }
    }

    .left-col {
        flex: 0 0 38%;
        display: flex;
        flex-direction: column;
        gap: 8px;

        @media (max-width: 600px) {
            flex: unset;
        }
    }

    .text-block {
        padding: 1.5rem;
        background: #f5f5f5;
        flex: 0 0 auto;

        .label {
            display: block;
            font-size: 0.7rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #bbb;
            margin-bottom: 0.6rem;
        }

        .name {
            font-family: 'GounBatang', serif;
            font-size: clamp(1.4rem, 2.5vw, 2rem);
            font-weight: 300;
            color: #111;
            margin: 0 0 0.4rem;
            line-height: 1.3;
        }

        .sub {
            display: block;
            font-size: 0.9rem;
            color: #999;
            margin-bottom: 1.5rem;
        }

    }

    .thumb-stack {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        overflow: hidden;

        @media (max-width: 600px) {
            flex-direction: row;
        }
    }

    .thumb-item {
        flex: 1;
        min-height: 0;
        overflow: hidden;
        background: #e0e0e0;

        @media (max-width: 600px) {
            flex: 0 0 calc(33.33% - 6px);
            aspect-ratio: 1;
        }

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

    .main-image {
        flex: 1;
        overflow: hidden;
        background: #e0e0e0;
        aspect-ratio: 2 / 3;

        @media (max-width: 600px) {
            aspect-ratio: 2 / 3;
            flex: unset;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .placeholder { width: 100%; height: 100%; background: #ddd; }
    }
</style>
