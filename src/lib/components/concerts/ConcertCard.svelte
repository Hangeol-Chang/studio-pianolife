<script>
    import { Clock, MapPin, Calendar } from 'lucide-svelte';
    let { concert } = $props();

    function parseConcertDate(dateStr) {
        if (!dateStr) return null;
        const iso = dateStr.match(/(\d{4})-(\d{2})-(\d{2})(?:[\sT](\d{2}:\d{2}))?/);
        if (iso) return { year: +iso[1], month: +iso[2] - 1, day: +iso[3], timeStr: iso[4] ?? '' };
        const kr = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일(?:\s*(\d{1,2}:\d{2}))?/);
        if (kr) return { year: +kr[1], month: +kr[2] - 1, day: +kr[3], timeStr: kr[4] ?? '' };
        return null;
    }

    function formatDate(dateStr) {
        const d = parseConcertDate(dateStr);
        if (!d) return dateStr ?? '';
        return `${d.year}년 ${d.month + 1}월 ${d.day}일`;
    }

    function naverMapUrl(concert) {
        const query = concert.location_data?.title || concert.location;
        if (!query) return null;
        return `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;
    }
</script>

<div class="concert-card">
    <div class="card-poster">
        {#if concert.poster_url}
            <a href="/concerts/{concert.id}">
                <img src={concert.poster_url} alt={concert.title} />
            </a>
        {:else}
            <div class="poster-placeholder"></div>
        {/if}
    </div>
    <div class="card-body">
        <div class="card-top-row">
            <span class="meta-item">
                <Calendar size={13} />
                {formatDate(concert.date)}
            </span>
            <a href="/concerts/{concert.id}" class="more-link">+ more</a>
        </div>
        <a href="/concerts/{concert.id}">
            <h3 class="card-title">{concert.title}</h3>
        </a>
        <div class="card-meta">
            {#if parseConcertDate(concert.date)?.timeStr}
                <span class="meta-item">
                    <Clock size={13} />
                    {parseConcertDate(concert.date).timeStr}
                </span>
            {/if}
            {#if concert.location}
                {#if naverMapUrl(concert)}
                    <a href={naverMapUrl(concert)} target="_blank" rel="noopener noreferrer" class="meta-item meta-item--link">
                        <MapPin size={13} />
                        {concert.location}
                    </a>
                {:else}
                    <span class="meta-item">
                        <MapPin size={13} />
                        {concert.location}
                    </span>
                {/if}
            {/if}
        </div>
        {#if concert.brief_description}
            <p class="card-desc">{concert.brief_description}</p>
        {/if}
    </div>
</div>

<style lang="scss">
.concert-card {
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

a {
    color: inherit;
    text-decoration: none;
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
        cursor: pointer;

        &:hover {
            transform: scale(1.05);
        }
    }

    .poster-placeholder {
        width: 100%;
        height: 100%;
        min-height: 160px;
        background: linear-gradient(135deg, #e8e8e8, #d0d0d0);
    }
}

.card-body {
    flex: 1;
    padding: 1.5rem 1.75rem;
    display: flex;
    flex-direction: column;
    min-width: 0;

    @media(--mobile) { padding: 1rem 1.1rem; }
}

.card-top-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.5rem;

    .more-link {
        font-size: 0.78rem;
        color: #888;
        text-decoration: none;
        flex-shrink: 0;
        margin-left: 1rem;
        transition: color 0.15s;

        &:hover { color: #000; }
    }
}

.card-title {
    font-size: 1.45rem;
    font-weight: 300;
    color: #111;
    margin: 0 0 0.85rem;
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
    text-decoration: none;
    line-height: 1;

    &--link {
        cursor: pointer;
        transition: color 0.15s;
        &:hover { color: #1a73e8; }
    }
}

.card-meta {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-bottom: 0.85rem;


}

.card-desc {
    margin-left: 0;

    font-size: 0.85rem;
    font-weight: 300;
    line-height: 1.7;
    color: #888;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
