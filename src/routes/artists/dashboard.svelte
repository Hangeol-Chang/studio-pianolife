<script>
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    import profile1 from '$lib/assets/images/artists/artist_1.png';
    import profile2 from '$lib/assets/images/artists/profile_2.png';
    import profile3 from '$lib/assets/images/artists/profile_3.png';
    import MoreButton from '@/components/common/moreButton.svelte';

    const artists = [
        { nameKo: '고정우 (공피라)', nameEn: 'Ko Jeong Woo', image: profile1 },
        { nameKo: '포뮤직스', nameEn: 'Four Musics', image: profile2 },
        { nameKo: '김준한', nameEn: 'JunHan', image: profile3 },
        { nameKo: '밤하늘', nameEn: 'Night Sky', image: profile1 }
    ];

</script>

<section class="section artists-section">
    <h1 class="title-center">Artists</h1>
    <MoreButton href="/artists" />
    
    <div class="artists-grid">
        {#each artists as artist}
            <div class="artist-card">
                <div class="profile-image">
                    <!-- 이미지 로드 실패 시 회색 박스 표시 -->
                    <img src={artist.image} alt={artist.nameEn} onerror={(e) => { e.currentTarget.style.display='none'; e.currentTarget.parentNode.classList.add('no-image'); }}/>
                </div>
                <div class="artist-info">
                    <div class="name-en">{artist.nameEn}</div>
                    <div class="name-ko">{artist.nameKo}</div>
                </div>
            </div>
        {/each}
    </div>
    

</section>

<style lang="scss">
    .section-title {
        font-size: 2rem;
        font-weight: 300;
        text-align: center;
        margin-bottom: 0.5rem;
        letter-spacing: 0.1em;
    }

    .artists-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, 200px);
        gap: 1.5rem;
        margin: 3rem auto 0 auto;
        justify-content: center;
    }

    .artist-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        @media (min-width: 768px) { align-items: flex-start; }

        .profile-image {
            width: 100%;
            margin-bottom: 0.2rem;
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
            gap: 0px;
            width: 100%;

            .name-en { 
                font-size: 0.8rem; 
                font-weight: 200; 
                color: #666;
                margin-bottom: 0.1rem; 
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .name-ko { 
                font-size: 1rem; 
                font-weight: 400; 
                color: #222;
            }
        }
    }
</style>