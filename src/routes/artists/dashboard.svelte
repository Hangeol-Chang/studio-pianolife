<script>
    import { PIANOLIFE_BACKEND_URL } from '$env/static/public';
    import MoreButton from '@/components/common/moreButton.svelte';

    const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';

    let artists = $state([]);

    $effect(() => {
        fetch(`${API}/api/artists?active_only=true&role_id=1&limit=10`)
            .then(res => res.json())
            .then(data => { artists = data; })
            .catch(e => console.error('Failed to load artists:', e));
    });
</script>

<section>
    <div class="section-content-wrapper">
        <h1 class="section-title-center">Artists</h1>
        <MoreButton href="/artists" />
        
        <div class="artists-grid">
            {#each artists as artist}
                <a class="artist-card" href="/artists/{artist.id}">
                    <div class="profile-image" class:no-image={!artist.image_url}>
                        {#if artist.image_url}
                            <img src={artist.image_url} alt={artist.name_en ?? artist.name}
                                onerror={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentNode.classList.add('no-image'); }}/>
                        {/if}
                    </div>
                    <div class="artist-info">
                        <div class="name-en">{artist.name_en ?? ''}</div>
                        <div class="name-ko">{artist.name}</div>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
    .artists-grid {
        gap: 1.5rem;
        margin: 3rem 1vw 0 1vw;

        display: flex;
        height: auto;
        max-height: 500px; 
        overflow-y: auto;
        padding: 20px 4px;
        
        flex-wrap: nowrap;
        overflow-x: scroll;
        overflow-y: hidden;
            
        &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }
        
        @media (--tablet) {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));

            max-height: 500px;
            overflow-y: scroll;
            padding-bottom: 1rem;
        }
        @media (--mobile) {
            display: grid;
            max-height: 400px;
            grid-template-columns: repeat(2, minmax(100px, 1fr));
        }
    }

    .artist-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        color: inherit;
        
        @media (min-width: 769px) { 
            align-items: flex-start; 
            flex: 0 0 20%; 
        }

        .profile-image {
            width: 100%;
            margin-bottom: 1rem;
            border-radius: 4px;
            position: relative;
            background-color: #e0e0e0;
            overflow: hidden;
            transition: all 0.3s ease; 
            cursor: pointer;

            img { 
                width: 100%;
                height: 100%;
                aspect-ratio: 3/4;
                object-fit: cover; 
            }
            &:hover { 
                transform: scale(1.05); 
            }
        }

        .artist-info {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;

            .name-en { 
                font-size: 1rem; 
                font-weight: 200; 
                color: #666;
                margin-bottom: 0.1rem; 
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .name-ko { 
                font-size: 1.2rem; 
                font-weight: 400; 
                color: #222;
            }
        }
    }
</style>