<!-- Concert Template 0: sticky info col + sticky-stacked image col -->
<script>
    let { item, reversed = false } = $props();
</script>

<section class="template" class:reversed>
    <div class="layout">
        <!-- 정보 블록 (sticky) -->
        <div class="info-col">
            <span class="label">Concert</span>
            <h2 class="name">{item.title}</h2>
            {#if item.date}<span class="date">{item.date}</span>{/if}
        </div>

        <!-- 썸네일 스택 — 각 이미지가 sticky로 이전 이미지 위에 쌓임 -->
        <div class="thumb-col">
            {#each item.thumbnails as thumb, i}
                <div class="thumb-item" style:z-index={i + 1}>
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

    /* ── 레이아웃 ───────────────────────────────────────────── */
    .layout {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 12px;
        align-items: start;

        @media (max-width: 640px) {
            grid-template-columns: 1fr;
        }
    }

    /* reversed: 이미지 왼쪽, 텍스트 오른쪽 */
    .template.reversed .layout {
        grid-template-columns: 2fr 1fr;

        .info-col { order: 2; }
        .thumb-col { order: 1; }

        @media (max-width: 640px) {
            grid-template-columns: 1fr;
            .info-col { order: 1; }
            .thumb-col { order: 2; }
        }
    }

    /* ── 정보 컬럼 ──────────────────────────────────────────── */
    .info-col {
        position: sticky;
        top: 5rem;
        margin-top: 2rem;
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

    /* ── 이미지 스택 컬럼 ───────────────────────────────────── */
    .thumb-col {
        display: flex;
        flex-direction: column;
        /* gap 없음 — sticky 겹침으로 스택 연출 */
    }

    /*
     * 각 이미지가 position:sticky + top:0 로 뷰포트 상단에 붙음.
     * z-index 가 증가하므로 뒤에 오는 이미지가 앞 이미지를 덮어
     * "쌓이는" 효과가 만들어짐.
     */
    .thumb-item {
        position: sticky;
        top: 5rem;
        margin-top: 2rem;
        width: 100%;
        aspect-ratio: 3 / 2;
        overflow: hidden;
        background: #e8e8e8;
        box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.12);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.4s ease;
            &:hover { transform: scale(1.04); }
        }
        .placeholder { width: 100%; height: 100%; background: #ddd; }

        @media (max-width: 640px) {
            position: static;
            box-shadow: none;
            margin-bottom: 4px;
        }
    }
</style>
