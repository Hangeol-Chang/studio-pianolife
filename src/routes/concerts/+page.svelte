<script>
    import PageTitle from '@/components/ui/PageTitle.svelte';
    import Spacer from '@/components/ui/Spacer.svelte';
    import { onMount } from 'svelte';

    // Mock data for now, replace with actual data fetching or import
    let concerts = [
        { id: 1, title: "제1회 정기연주회", date: "2024.01.01", poster: "/concerts/resized/poster1.jpg" },
        { id: 2, title: "제2회 정기연주회", date: "2024.06.01", poster: "/concerts/resized/poster2.jpg" }
    ];
</script>

<div class="concerts-container">
    <Spacer height={20} />
    <PageTitle title="Concerts" subTitle="정기 연주회" />
    
    <div class="concert-list">
        {#each concerts as concert}
            <div class="concert-item">
                <div class="poster-placeholder">
                    <!-- <img src={concert.poster} alt={concert.title} /> -->
                    <div class="placeholder-box">{concert.title}</div>
                </div>
                <div class="concert-info">
                    <h3>{concert.title}</h3>
                    <p>{concert.date}</p>
                    <a href="/concerts/detail?id={concert.id}" class="detail-link">자세히 보기</a>
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    .concerts-container {
        padding-bottom: 50px;
    }
    .concert-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 30px;
        padding: 0 5vw;
        margin-top: 30px;
    }
    .concert-item {
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s;
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
    }
    .poster-placeholder {
        width: 100%;
        aspect-ratio: 3/4;
        background-color: #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .placeholder-box {
        color: #888;
    }
    .concert-info {
        padding: 15px;
        h3 {
            margin: 0 0 10px 0;
            font-size: 1.2rem;
        }
        p {
            color: #666;
            margin-bottom: 15px;
        }
    }
    .detail-link {
        display: inline-block;
        padding: 8px 16px;
        background-color: #333;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.9rem;
        &:hover {
            background-color: #555;
        }
    }
</style>
