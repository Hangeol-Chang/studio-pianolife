<script>
    import { Calendar, ExternalLink } from 'lucide-svelte';
    let { audition } = $props();

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
</script>

<div class="audition-card">
    <div class="card-poster">
        {#if audition.poster_mid_url || audition.poster_url}
            <img src={audition.poster_mid_url || audition.poster_url} alt={audition.title} />
        {:else}
            <div class="poster-placeholder"></div>
        {/if}
    </div>
    <div class="card-body">
        <h3 class="card-title">{audition.title}</h3>
        {#if periodLabel}
            <span class="meta-item">
                <Calendar size={13} />
                {periodLabel}
            </span>
        {/if}
        {#if audition.content}
            <p class="card-desc">{audition.content}</p>
        {/if}
        {#if audition.apply_link}
            <a href={audition.apply_link} target="_blank" rel="noopener noreferrer" class="apply-btn">
                지원하기
                <ExternalLink size={13} />
            </a>
        {/if}
    </div>
</div>

<style lang="scss">
.audition-card {
    display: flex;
    flex-direction: row;
    border: 0.5px solid rgba(0, 0, 0, 0.15);
    background: #fff;
    transition: box-shadow 0.2s;
    height: 250px;

    &:last-child {
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.15);
    }

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

.card-badge {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: #666;
    border: 0.5px solid #ccc;
    padding: 0.15rem 0.55rem;
    width: fit-content;
    margin-bottom: 0.2rem;
}

.card-title {
    font-size: 1.45rem;
    font-weight: 300;
    color: #111;
    margin: 0;
    line-height: 1.3;

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

.card-desc {
    font-size: 0.85rem;
    font-weight: 300;
    line-height: 1.7;
    color: #888;
    margin: 0;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
}

.apply-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: auto;
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

    &:hover {
        background: #333;
    }
}
</style>
