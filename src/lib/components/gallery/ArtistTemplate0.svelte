<!-- Template 0: Portrait left + vertical title right + horizontal thumbnail strip -->
<script>
    let { item, reversed = false } = $props();
</script>

<div class="template" class:reversed>
    <div class="top-row">
        <!-- Main portrait left -->
        <div class="main-image">
            {#if item.mainImage}
                <img src={item.mainImage} alt={item.title} loading="lazy" />
            {:else}
                <div class="placeholder"></div>
            {/if}
        </div>

        <!-- Title right, vertically centered -->
        <div class="title-block">
            <span class="label">Artist</span>
            <h2 class="name">{item.title}</h2>
            {#if item.subTitle}
                <span class="sub">{item.subTitle}</span>
            {/if}
        </div>
    </div>

    <!-- Horizontal scroll thumbnail strip -->
    <div class="thumb-strip">
        {#each item.thumbnails as thumb}
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

<style lang="scss">
    .template {
        width: 100%;

        &.reversed .top-row {
            flex-direction: row-reverse;
        }
    }

    .top-row {
        display: flex;
        align-items: stretch;
        gap: 0;
    }

    .main-image {
        flex: 0 0 52%;
        aspect-ratio: 2 / 3;
        overflow: hidden;
        background: #e8e8e8;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .placeholder { width: 100%; height: 100%; background: #ddd; }
    }

    .title-block {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2rem 2.5rem;
        background: #fafafa;

        @media (max-width: 600px) {
            padding: 1.25rem;
        }

        .label {
            font-size: 0.7rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: #bbb;
            margin-bottom: 0.8rem;
        }

        .name {
            font-family: 'GounBatang', serif;
            font-size: clamp(1.6rem, 3vw, 2.8rem);
            font-weight: 300;
            line-height: 1.2;
            color: #111;
            margin: 0 0 0.6rem;
        }

        .sub {
            font-size: 0.95rem;
            color: #999;
            font-weight: 300;
            letter-spacing: 0.08em;
        }
    }
    /* Horizontal thumbnail strip */
    .thumb-strip {
        display: flex;
        gap: 4px;
        margin-top: 4px;
        overflow-x: auto;
        scrollbar-width: none;
        &::-webkit-scrollbar { display: none; }
    }

    .thumb-item {
        flex: 0 0 calc(33.33% - 3px);
        aspect-ratio: 4 / 3;
        overflow: hidden;
        background: #e8e8e8;

        @media (max-width: 768px) {
            flex: 0 0 55vw;
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
</style>
