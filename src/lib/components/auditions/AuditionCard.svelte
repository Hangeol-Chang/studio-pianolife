<script>
    import { Calendar, ExternalLink, X } from 'lucide-svelte';
    let { audition } = $props();

    let showModal = $state(false);

    function parseDateStr(dateStr) {
        if (!dateStr) return null;
        const iso = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (iso) return { year: +iso[1], month: +iso[2], day: +iso[3] };
        const kr = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
        if (kr) return { year: +kr[1], month: +kr[2], day: +kr[3] };
        return null;
    }

    function formatDate(dateStr) {
        const d = parseDateStr(dateStr);
        if (!d) return dateStr ?? '';
        return `${d.year}년 ${d.month}월 ${d.day}일`;
    }

    const periodLabel = $derived.by(() => {
        const s = formatDate(audition.start_date);
        const e = formatDate(audition.end_date);
        if (s && e) return `${s} ~ ${e}`;
        if (s) return `${s} ~`;
        if (e) return `~ ${e}`;
        return '';
    });

    const contentLines = $derived(audition.content ? audition.content.split('\n') : []);
</script>

<div class="audition-card">
    <div class="card-poster">
        {#if audition.poster_mid_url || audition.poster_url}
            <img 
                role="none"
                src={audition.poster_mid_url || audition.poster_url} 
                alt={audition.title} 
                onclick={() => showModal = true}
            />
        {:else}
            <div class="poster-placeholder"></div>
        {/if}
    </div>
    <div class="card-body">
        <div class="card-top-row">
            <h3 role="none" class="card-title" onclick={() => showModal = true}>
                {audition.title}
            </h3>
            {#if audition.apply_link}
                <a href={audition.apply_link} target="_blank" rel="noopener noreferrer" class="apply-btn">
                    지원하기
                    <ExternalLink size={13} />
                </a>
            {/if}
        </div>
        {#if periodLabel}
            <span class="meta-item">
                <Calendar size={13} />
                {periodLabel}
            </span>
        {/if}
        {#if audition.brief_description}
            <p class="card-brief">{audition.brief_description}</p>
        {/if}
        {#if audition.content}
            <button class="more-btn" onclick={() => showModal = true}>view detail</button>
        {/if}
    </div>
</div>

<!-- 상세 모달 -->
{#if showModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={() => showModal = false}>
        <div class="modal" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => e.stopPropagation()}>
            <button class="modal-close" onclick={() => showModal = false} aria-label="닫기">
                <X size={18} />
            </button>

            <div class="modal-header">
                {#if audition.poster_mid_url || audition.poster_url}
                    <img class="modal-poster" src={audition.poster_mid_url || audition.poster_url} alt={audition.title} />
                {/if}
                <div class="modal-header-info">
                    <div style="display:flex; align-items:center; justify-content: space-between;">
                        <h2 class="modal-title">{audition.title}</h2>
                        {#if audition.apply_link}
                            <a href={audition.apply_link} target="_blank" rel="noopener noreferrer" class="apply-btn apply-btn--modal">
                                지원하기
                                <ExternalLink size={13} />
                            </a>
                        {/if}
                    </div>
                    {#if periodLabel}
                        <span class="meta-item">
                            <Calendar size={13} />
                            {periodLabel}
                        </span>
                    {/if}
                    {#if audition.brief_description}
                        <p class="modal-brief">{audition.brief_description}</p>
                    {/if}

                </div>
            </div>

            {#if contentLines.length > 0}
                <div class="modal-content">
                    <p class="modal-text">
                        {#each contentLines as line, i}
                            {line}{#if i < contentLines.length - 1}<br />{/if}
                        {/each}
                    </p>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
.audition-card {
    display: flex;
    flex-direction: row;
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    background: #fff;
    transition: box-shadow 0.2s;
    min-height: 160px;

    &:hover {
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
        z-index: 1;
        position: relative;
    }
}

.card-poster {
    flex: 0 0 160px;
    overflow: hidden;
    background: #f0f0f0;
    align-self: stretch;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.3s;

        &:hover {
            transform: scale(1.05);
        }
    }

    .poster-placeholder {
        width: 100%;
        height: 100%;
        min-height: 160px;
        background: linear-gradient(135deg, #e8e4f0, #d8d0e8);
    }
}

.card-body {
    flex: 1;
    padding: 1.5rem 1.75rem;
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 0.4rem;

    @media(--mobile) { padding: 1rem 1.1rem; }
}

.card-top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.1rem;
}

.card-title {
    font-size: 1.45rem;
    font-weight: 300;
    color: #111;
    margin: 0;
    line-height: 1.3;
    cursor: pointer;

    @media(--tablet) { font-size: 1.2rem; }
    @media(--mobile) { font-size: 1rem; }
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.85rem;
    font-weight: 300;
    color: #666;
    line-height: 1;
}

.card-brief {
    font-size: 0.85rem;
    font-weight: 300;
    line-height: 1.6;
    color: #888;
    margin: 0.2rem 0 0;
    white-space: pre-line;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.more-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: 1px solid #aaa;
    padding: 0.3rem 0.75rem;
    margin-top: 0.2rem;
    font-size: 0.78rem;
    font-weight: 400;
    color: #aaa;
    cursor: pointer;
    width: fit-content;
    transition: color 0.15s;

    &:hover { 
        color: #555; 
        border-color: #555;
    }
}

.apply-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
    padding: 0.45rem 1rem;
    font-size: 0.82rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    color: #fff;
    background: #111;
    border: none;
    text-decoration: none;
    cursor: pointer;
    width: fit-content;
    transition: background 0.15s;

    &:hover { background: #333; }

    &--modal {
        margin-top: 0.75rem;
    }
}

/* ── 모달 ──────────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    z-index: 500;
    overflow-y: auto;
}

.modal {
    background: #fff;
    width: 100%;
    max-width: 680px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    animation: modal-in 0.2s ease;

    @media(--mobile) {
        max-height: 95vh;
        margin: auto 0 0;
    }
}

@keyframes modal-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
    z-index: 1;
    transition: color 0.15s;

    &:hover { color: #111; }
}

.modal-header {
    display: flex;
    gap: 1.5rem;
    padding: 2rem;
    border-bottom: 1px solid #eee;

    @media(--tablet) {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
}

.modal-poster {
    flex: 0 0 200px;
    width: 200px;
    height: 280px;
    object-fit: cover;

    @media(--mobile) {
        width: 100%;
        height: 240px;
        flex: none;
    }
}

.modal-header-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 300;
    color: #111;
    margin: 0;
    line-height: 1.3;
    padding-right: 1.5rem;
}

.modal-brief {
    font-size: 0.88rem;
    font-weight: 300;
    color: #888;
    margin: 1rem 0 0 0;
    line-height: 1.6;
    white-space: pre-line;
}

.modal-content {
    padding: 1.75rem 2rem;
}

.modal-text {
    font-size: 0.88rem;
    font-weight: 300;
    line-height: 1.85;
    color: #555;
    margin: 0;
    white-space: pre-line;
}
</style>
