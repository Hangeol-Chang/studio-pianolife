<script>
    let { artist } = $props();
    console.log(artist);
</script>

{#if artist.role_name === "artist"}
<a href="/artists/{artist.id}" class="artist-card">
    <div class="card-image-wrapper">
        {#if artist.thumb_url || artist.image_url}
            <img src={artist.thumb_url || artist.image_url} alt={artist.name} class="card-image" />
        {:else}
            <div class="card-image-placeholder"></div>
        {/if}
        <div class="card-overlay"></div>
    </div>

    <div class="card-info">
        <h3 class="name-en">{artist.name_en ?? ''}</h3>
        <h4 class="name-kr">{artist.name}</h4>
        <span class="view-detail">view detail +</span>
    </div>
</a>
{:else}
<div class="artist-card no-link">
    <div class="card-image-wrapper">
        {#if artist.thumb_url}
            <img src={artist.thumb_url} alt={artist.name} class="card-image" />
        {:else}
            <div class="card-image-placeholder"></div>
        {/if}
        <div class="card-overlay"></div>
    </div>

    <div class="card-info">
        <h3 class="name-en">{artist.name_en ?? ''}</h3>
        <h4 class="name-kr">{artist.name}</h4>
    </div>
</div>
{/if}

<style lang="scss">
.artist-card {
    display: block;
    position: relative;
    overflow: hidden;
    border-radius: 2px;
    aspect-ratio: 3 / 4;
    cursor: pointer;

    &.no-link {
        cursor: default;
    }

    &:not(.no-link):hover {
        .card-image {
            transform: scale(1.05);
        }
        .card-overlay {
            background: linear-gradient(to bottom, 
                rgba(0, 0, 0, 0.0) 50%,
                rgba(0, 0, 0, 0.5) 70%,
                rgba(0, 0, 0, 0.8) 100%
            );
        }

        .card-info {
            transform: scale(1.05);
        }
    }
}

.card-image-wrapper {
    position: absolute;
    inset: 0;
}

.card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.card-image-placeholder {
    width: 100%;
    height: 100%;
    background: #1a1a1a;
}

.card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, 
        rgba(0, 0, 0, 0.0) 50%,
        rgba(0, 0, 0, 0.5) 70%,
        rgba(0, 0, 0, 0.8) 100%
    );
    transition: background 0.3s ease;
}

.card-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.5rem 1.2rem;
    z-index: 2;
    transform-origin: bottom left;
    transition: transform 0.4s ease;

    .name-en {
        font-size: 1.4rem;
        font-weight: 100;
        letter-spacing: 0.08em;
        margin: 0 0 0.15rem;
        color: white;
    }

    .name-kr {
        font-size: 1.2rem;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.4);
        margin: 0 0 0.5rem;
    }

    .view-detail {
        font-size: 0.85rem;
        font-weight: 300;
        letter-spacing: 0.1em;
        color: rgba(255, 255, 255, 0.6);
        text-transform: lowercase;
    }
}
</style>
