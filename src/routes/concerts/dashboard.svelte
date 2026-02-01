<script>
    import concertShuman from '$lib/assets/images/concerts/250224_shuman.jpg';
    import concertShopinRavel from '$lib/assets/images/concerts/250215_shopinRavel.jpg';
    import concertAmatuer from '$lib/assets/images/concerts/250829_amatuer.png';

    const concerts = [
        { title: '슈만 | 시인은, 말한다', image: concertShuman },
        { title: '쇼팽과 라벨', image: concertShopinRavel },
        { title: '아마추어를 만나다', image: concertAmatuer }
    ];
</script>

<section class="section concerts-section">
    <div class="section-header center">
        <h2 class="section-title">Concerts</h2>
        <p class="section-desc">다양한 장르와 스타일의 클래식 공연을 선보입니다</p>
    </div>

    <div class="concerts-list">
        {#each concerts as concert}
            <div class="concert-item">
                <div class="concert-image">
                    <img src={concert.image} alt={concert.title} />
                </div>
                <div class="concert-info">
                    <h3>{concert.title}</h3>
                    <a href="/concerts" class="btn-detail">+ show detail</a>
                </div>
            </div>
            <!-- Mobile Divider -->
            <div class="divider"></div>
        {/each}
    </div>

    <div class="more-link text-right">
        <a href="/concerts">+ more</a>
    </div>
</section>

<style lang="scss">

    .section-desc {
        font-size: 0.9rem;
        font-weight: 300;
        text-align: center;
        color: #666;
        margin-bottom: 3rem;
    }

    .more-link {
        margin-top: 2rem;
        text-align: right;
        
        a {
            font-size: 0.85rem;
            font-weight: 300;
            color: #333;
            text-decoration: none;
            transition: opacity 0.2s;
            &:hover { opacity: 0.7; }
        }
    }

    /* Concerts Section */
    .concerts-section {
        background-color: #f9f9f9;
        padding: 4rem 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
        
        @media (min-width: 768px) {
            padding: 6rem 3rem;
        }
    }

    .concerts-list {
        display: flex;
        flex-direction: column;
        gap: 4rem;
        margin-top: 2rem;
    }

    .concert-item {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        
        @media (min-width: 768px) {
            flex-direction: row;
            align-items: stretch;
            gap: 3rem;
        }

        .concert-image {
            width: 100%;
            height: 250px;
            background-color: #e5e5e5;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            overflow: hidden;
            
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            @media (min-width: 768px) {
                width: 280px;
                height: 380px;
                flex-shrink: 0;
            }
        }

        .concert-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            
            h3 {
                font-size: 1.5rem;
                font-weight: 300;
                margin-bottom: 2rem;
                line-height: 1.4;
            }
            
            .btn-detail {
                align-self: flex-start;
                display: inline-block;
                padding: 0.6rem 0;
                font-size: 0.85rem;
                font-weight: 300;
                color: #555;
                text-decoration: none;
                border-bottom: 1px solid transparent;
                transition: all 0.2s;
                
                &:hover {
                    color: #000;
                    border-bottom-color: #000;
                }
            }
        }
    }
    
    .divider {
        height: 1px;
        background-color: #e0e0e0;
        width: 100%;
        margin-top: -2rem;
        margin-bottom: 2rem;
        display: block; 
        @media (min-width: 768px) { display: none; }
    }
</style>