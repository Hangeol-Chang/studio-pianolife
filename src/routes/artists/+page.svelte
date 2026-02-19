<script>
    import { PIANOLIFE_BACKEND_URL } from "$env/static/public";
    import HeroSection from "@/components/common/HeroSection.svelte";
    import ArtistCard from "@/components/artists/ArtistCard.svelte";
    import artistImage from "@/assets/images/artists/artists_wallpaper.png";

    const API = PIANOLIFE_BACKEND_URL || "http://localhost:8000";

    let artists = $state([]);
    let loading = $state(true);
    let error = $state(null);

    $effect(() => {
        fetch(`${API}/api/artists?active_only=true&role_id=1`)
            .then(res => {
                if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
                return res.json();
            })
            .then(data => { artists = data; })
            .catch(err => { error = err.message; })
            .finally(() => { loading = false; });
    });
</script>

<div>
    <HeroSection image={artistImage} title="ARTISTS" alt="Artists" 
        gradientOverlay="linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 40%, rgba(0, 0, 0, 0.9) 80%, rgba(0, 0, 0, 1.0) 95%)"
    />

    <section class="artists-section">
        <div class="description-wrapper">
            <h2 class="section-title-left">오늘의 신예, 내일의 거장</h2>
            <p>
                순수한 열정으로 빚어낸 깊이 있는 해석과 과감한 도전.
                <br />
                우리가 주목해야 할 새로운 재능을 가장 먼저 확인하세요.
            </p>
            <p>
                Experience profound interpretations and bold challenges crafted with pure passion. 
                <br />
                Be the first to discover the new talents that deserve your attention.
            </p>
        </div>

        <div class="artists-card-wrapper">
            {#if loading}
                {#each { length: 6 } as _, i}
                    <div class="card-skeleton"></div>
                {/each}
            {:else if error}
                <p class="error-message">{error}</p>
            {:else if artists.length === 0}
                <p class="empty-message">등록된 아티스트가 없습니다.</p>
            {:else}
                {#each artists as artist (artist.id)}
                    <ArtistCard {artist} />
                {/each}
            {/if}
        </div>
    </section>
</div>

<style lang="scss">
    .artists-section {
        display: grid;
        grid-template-columns: minmax(200px, 1fr) 3fr;
        gap: 3rem;
        padding: 4rem 2rem 4rem 0;

        @media(--desktop) {
            gap: 2rem;
        }
        @media(--tablet) {
            grid-template-columns: 1fr;
            padding: 4rem 2rem;
            gap: 1.5rem;
        }
        @media(--mobile) {
            gap: 1rem;
        }
    }

    .description-wrapper {
        h2 {
            font-size: 1.8rem;
            font-weight: 300;
            letter-spacing: 0.05em;
            margin-bottom: 1.5rem;
        }

        p {
            font-size: 0.9rem;
            line-height: 1.8;
            margin-bottom: 1rem;
        }
    }

    .artists-card-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1.2rem;
    }

    .card-skeleton {
        aspect-ratio: 3 / 4;
        background: linear-gradient(to bottom, 
            rgba(0, 0, 0, 0.0) 50%,
            rgba(0, 0, 0, 0.3) 70%,
            rgba(0, 0, 0, 0.8) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
    }

    @keyframes shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }

    .error-message,
    .empty-message {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
        grid-column: 1 / -1;
    }
</style>