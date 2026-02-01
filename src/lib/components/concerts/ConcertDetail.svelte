<script>
    export let concert; // Concert Data Object
</script>

<div class="concert-detail-page">
    <div class="container layout-grid">
        <!-- Left Pane: Poster -->
        <aside class="poster-section">
            <div class="poster-wrapper">
                {#if concert.image}
                    <img src={concert.image} alt={concert.title} />
                {:else}
                    <div class="poster-placeholder">
                        <span class="placeholder-text">POSTER</span>
                    </div>
                {/if}
            </div>
        </aside>

        <!-- Right Pane: Content -->
        <main class="content-section">
            <header class="concert-header">
                <h1 class="main-title">{concert.title}</h1>
                {#if concert.subtitle}<p class="sub-title">{concert.subtitle}</p>{/if}
            </header>

            <section class="info-grid">
                <div class="info-item">
                    <span class="label">Date</span>
                    <span class="value">{concert.date}</span>
                </div>
                <div class="info-item">
                    <span class="label">Time</span>
                    <span class="value">{concert.time}</span>
                </div>
                <div class="info-item">
                    <span class="label">Location</span>
                    <span class="value">{concert.location}</span>
                </div>
                <div class="info-item">
                    <span class="label">Price</span>
                    <span class="value">{concert.price}</span>
                </div>
            </section>

            <div class="action-area">
                <button class="btn-reserve">예매하기</button>
            </div>

            <div class="divider"></div>

            {#if concert.description}
                <section class="description-section">
                    <p>{concert.description}</p>
                </section>
                 <div class="divider"></div>
            {/if}


            {#if concert.artists && concert.artists.length > 0}
            <section class="artists-section">
                <h3 class="section-label">참여 연주자</h3> <!-- Or "Starring" -->
                <div class="artists-grid">
                    {#each concert.artists as artist}
                        <div class="artist-card">
                            <div class="artist-image">
                                {#if artist.image}
                                    <img src={artist.image} alt={artist.name} />
                                {:else}
                                    <div class="img-placeholder"></div>
                                {/if}
                            </div>
                            <div class="artist-name">
                                <span class="ko">{artist.name}</span>
                                <span class="en">{artist.en}</span>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
            <div class="divider"></div>
            {/if}

            {#if concert.program && concert.program.length > 0}
            <section class="program-section">
                <h3 class="section-label">Program</h3>
                <div class="program-list">
                    {#each concert.program as item}
                        <div class="program-item">
                            {#if item.part}
                                <h4 class="part-title">{item.part}</h4>
                            {/if}
                            <div class="program-content">
                                {#each item.pieces as piece}
                                    <p class="piece-row">
                                        <span class="piece-title">{piece.title}</span>
                                        {#if piece.performer}
                                            <span class="piece-performer"> | {piece.performer}</span>
                                        {/if}
                                    </p>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
            {/if}
        </main>
    </div>
</div>

<style lang="scss">
    @use '../../styles/common.scss' as *;

    .concert-detail-page {
        padding-top: 4rem;
        padding-bottom: 8rem;
        background-color: $color-white;
    }

    .container {
        @include container;
    }

    /* Layout */
    .layout-grid {
        display: flex;
        flex-direction: column;
        gap: 3rem;

        @include min-width(1024px) {
            flex-direction: row;
            gap: 5rem;
            align-items: flex-start;
        }
    }

    /* Poster Section */
    .poster-section {
        width: 100%;
        
        @include min-width(1024px) {
            flex: 0 0 400px;
            position: sticky;
            top: 100px;
        }

        .poster-wrapper {
            width: 100%;
            aspect-ratio: 3/4;
            background-color: #f0f0f0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .poster-placeholder {
                color: #ccc;
                font-weight: 300;
                letter-spacing: 0.2rem;
            }
        }
    }

    /* Content Section */
    .content-section {
        flex: 1;
        width: 100%;
    }

    .concert-header {
        margin-bottom: 2.5rem;
        
        .main-title {
            font-size: 2rem;
            font-weight: 300;
            margin-bottom: 0.5rem;
            line-height: 1.3;
        }

        .sub-title {
            font-size: 1.1rem;
            color: $color-text-secondary;
            font-weight: 300;
        }
    }

    .info-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.8rem;
        margin-bottom: 2.5rem;

        .info-item {
            display: flex;
            font-size: 1rem;
            
            .label {
                width: 80px;
                font-weight: 600;
                color: #999;
                font-size: 0.85rem;
                align-self: center;
            }

            .value {
                font-weight: 300;
                color: $color-text-primary;
            }
        }
    }

    .action-area {
        margin-bottom: 3rem;
        
        .btn-reserve {
            background-color: black;
            color: white;
            padding: 1rem 3rem;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: opacity 0.2s;
            width: 100%;

            @include min-width(768px) {
                width: auto;
            }

            &:hover {
                opacity: 0.8;
            }
        }
    }

    .divider {
        width: 100%;
        height: 1px;
        background-color: #eee;
        margin: 3rem 0;
    }

    .description-section {
        font-size: 1rem;
        font-weight: 300;
        line-height: 1.8;
        color: $color-text-secondary;
        white-space: pre-wrap;
    }

    .section-label {
        font-size: 1rem;
        font-weight: 400;
        color: #000;
        margin-bottom: 1.5rem;
        letter-spacing: 0.05rem;
    }

    /* Artists Grid */
    .artists-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;

        @include min-width(768px) {
            grid-template-columns: repeat(4, 1fr);
        }

        .artist-card {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;

            .artist-image {
                width: 100%;
                aspect-ratio: 3/4;
                background-color: #f5f5f5;
                overflow: hidden;

                .img-placeholder {
                    width: 100%; 
                    height: 100%;
                }
            }
            
            .artist-name {
                display: flex;
                flex-direction: column;
                
                .ko {
                    font-size: 0.95rem;
                    font-weight: 400;
                    margin-bottom: 0.2rem;
                }
                .en {
                    font-size: 0.7rem;
                    color: #999;
                    text-transform: uppercase;
                    letter-spacing: 0.05rem;
                }
            }
        }
    }

    /* Program List */
    .program-list {
        display: flex;
        flex-direction: column;
        gap: 2rem;

        .program-item {
            .part-title {
                font-size: 1.1rem;
                font-weight: 500;
                margin-bottom: 1rem;
                color: #333;
            }

            .program-content {
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
                padding-left: 0.5rem;
                border-left: 2px solid #f5f5f5;
            }

            .piece-row {
                font-size: 0.95rem;
                line-height: 1.6;
                font-weight: 300;
                
                .piece-title {
                    color: $color-text-primary;
                }
                .piece-performer {
                    color: $color-text-secondary;
                    font-size: 0.9rem;
                }
            }
        }
    }
</style>
