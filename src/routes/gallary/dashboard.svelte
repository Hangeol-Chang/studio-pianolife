<script>
</script>

<section class="section gallery-section">
    <div class="section-header center">
        <h2 class="section-title">Gallery</h2>
        <p class="section-desc">우리들이 음악으로 채운 순간들</p>
    </div>

    <div class="gallery-grid">
        <div class="gallery-item large"></div>
        <div class="gallery-item"></div>
        <div class="gallery-item"></div>
    </div>

    <div class="more-link text-right">
        <a href="/gallary">+ more</a>
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

    /* Gallery Section */
    .gallery-section {
        padding: 4rem 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
        
        @media (min-width: 768px) {
            padding: 6rem 3rem;
        }
    }

    .gallery-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        
        @media (min-width: 768px) {
            grid-template-columns: 2fr 1fr;
            grid-template-rows: repeat(2, 220px);
            gap: 1.5rem;
        }

        .gallery-item {
            background-color: #eee;
            min-height: 250px;
            transition: opacity 0.3s;
            cursor: pointer;
            
            &:hover { opacity: 0.9; }

            &.large {
                @media (min-width: 768px) {
                    grid-row: span 2;
                    min-height: auto;
                }
            }
        }
    }
</style>