<script>
    import { Calendar, Clock, DollarSign, MapPin, Watch } from "lucide-svelte";
    import HeroSection from "../common/HeroSection.svelte";
    import ArtistCard from "../artists/ArtistCard.svelte";

    let { concert } = $props();
    let activeTab = $state('info');

    const artists = $derived(concert.artists || []);
    const rawProgram = $derived(concert.program || []);

    /**
     * 새 형식:  [{ section, items: [{composer, title:[], player_ids, player_names}] }]
     * 구형 flat: [{ composer, title, player_ids, ... }]
     * → 항상 섹션 배열로 정규화
     */
    const programSections = $derived.by(() => {
        if (!rawProgram.length) return [];
        // 새 형식 판별
        if ('section' in rawProgram[0]) return rawProgram;
        // 구형 마이그레이션
        const sections = [];
        let cur = null;
        for (const p of rawProgram) {
            if (!p.title) continue; // Intermission / 구형 헤더는 섹션으로
            if (p.composer && !p.title) {
                cur = { section: p.composer, items: [] };
                sections.push(cur);
            } else {
                if (!cur) { cur = { section: '', items: [] }; sections.push(cur); }
                cur.items.push({
                    composer: p.composer || '',
                    title: Array.isArray(p.title) ? p.title : [p.title],
                    player_names: p.player_names || [],
                });
            }
        }
        return sections.length ? sections : [{ section: '', items: rawProgram.map(p => ({
            composer: p.composer || '',
            title: Array.isArray(p.title) ? p.title : [p.title || ''],
            player_names: p.player_names || [],
        })) }];
    });

    const showSectionLabels = $derived(
        programSections.length > 1 || (programSections[0]?.section || '') !== ''
    );

    // 네비게이션 탭 목록 (데이터가 있는 섹션만 표시)
    const navTabs = $derived(
        (() => {
            const tabs = ['info'];
            if (artists.length > 0) tabs.push('artists');
            if (program.length > 0) tabs.push('program');
            return tabs;
        })()
    );

    // "2026-03-28 15:00" → { date: "2026년 3월 28일", time: "15:00" }
    const parsedDate = $derived.by(() => {
        if (!concert.date) return null;
        const m = concert.date.match(/(\d{4})-(\d{2})-(\d{2})(?:[\sT](\d{2}:\d{2}))?/);
        if (!m) return { date: concert.date, time: null };
        return {
            date: `${m[1]}년 ${+m[2]}월 ${+m[3]}일`,
            time: m[4] || null,
        };
    });

    function naverMapUrl(c) {
        const mapx = c.location_data?.mapx;
        const mapy = c.location_data?.mapy;
        const title = c.location_data?.title || c.location;
        if (!title) return null;
        if (mapx && mapy) {
            const lng = (Number(mapx) / 10000000).toFixed(7);
            const lat = (Number(mapy) / 10000000).toFixed(7);
            return `https://map.naver.com/v5/search/${encodeURIComponent(title)}?c=${lng},${lat},15,0,0,0,dh`;
        }
        return `https://map.naver.com/v5/search/${encodeURIComponent(title)}`;
    }

    function inView(node, { threshold = 0.5 } = {}) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    node.classList.add('visible');
                    observer.disconnect();
                }
            },
            { threshold }
        );
        observer.observe(node);
        return { destroy() { observer.disconnect(); } };
    }
</script>

<div class="concert-detail-page">
    <HeroSection 
        image={concert.poster_url}
        maxHeight="700px"
    />
    
    <section class="main-content-section">
        <div class="main-poster">
            {#if concert.poster_url}
                <img class="main-poster-image" src={concert.poster_url} alt={concert.title}
                    use:inView={{ threshold: 1.0 }}
                />
            {:else}
                <div class="poster-placeholder"></div>
            {/if}
        </div>

        <!-- Info -->
        <div id="info" class="information-container">
            <div>
                <h3 class="underbar">Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label-container">
                            <Calendar size={16} />
                            <span class="label">Date</span>
                        </div>
                        <span class="value">{parsedDate.date}</span>
                    </div>
                    <div class="info-item">
                        <div class="label-container">
                            <Clock size={16} />
                            <span class="label">Time</span>
                        </div>
                        <span class="value">{parsedDate.time}</span>
                    </div>
                    <div class="info-item">
                        <div class="label-container">
                            <MapPin size={16} />
                            <span class="label">Location</span>
                        </div>
                        {#if naverMapUrl(concert)}
                            <a class="value value--link" href={naverMapUrl(concert)} target="_blank" rel="noopener noreferrer">{concert.location}</a>
                        {:else}
                            <span class="value">{concert.location}</span>
                        {/if}
                    </div>
                    <div class="info-item">
                        <div class="label-container">
                            <DollarSign size={16} />
                            <span class="label">Cost</span>
                        </div>
                        <span class="value">{concert.cost}</span>
                    </div>
                </div>
                
                <h3 class="subtitle">Overview</h3>
                <p>{concert.brief_description}</p>
            </div>

            <div class="action-area">
                {#if concert.reserve_link}
                    <a class="btn-reserve" href={concert.reserve_link} target="_blank" rel="noopener noreferrer">예매하기</a>
                {:else}
                    <button class="btn-reserve" disabled>예매하기</button>
                {/if}
            </div>
        </div>


        <!-- 본문 레이아웃 -->
        <div class="content-container">
            <div>
                <h3 class="underbar">Artists</h3>
                <div class="artists-grid">
                    {#each artists as artist}
                        <ArtistCard artist={artist} />
                    {/each}
                </div>
            </div>
    
            <!-- Program -->
            <div>
                <h3 class="underbar">Program</h3>
                <div class="program-list">
                    {#each programSections as sec, sIdx}
                        {#if showSectionLabels && sec.section}
                            {#if sIdx > 0}
                                <div class="intermission">— Intermission —</div>
                            {/if}
                            <div class="program-item program-item--section">
                                <span class="section-label">{sec.section}</span>
                            </div>
                        {:else if sIdx > 0 && showSectionLabels}
                            <div class="intermission">— Intermission —</div>
                        {/if}

                        {#each (sec.items || []) as item}
                            <div class="program-item">
                                <p class="piece-row">
                                    {#if item.composer}<span class="piece-composer">{item.composer}</span>{/if}
                                    <span class="piece-title">
                                        {#each (Array.isArray(item.title) ? item.title : [item.title]) as t, ti}
                                            {#if ti > 0}<br />{/if}{t}
                                        {/each}
                                    </span>
                                    {#if item.player_names && item.player_names.length > 0}
                                        <span class="piece-performer">{item.player_names.join(', ')}</span>
                                    {/if}
                                </p>
                            </div>
                        {/each}
                    {/each}
                </div>
            </div>
        </div>

    </section>
</div>

<style lang="scss">
    .concert-detail-page {
        width: 100%;
        padding-top: 4rem;
    }

    .main-content-section {
        display: grid;
        grid-template-columns: 400px 1fr;
        gap: 2rem;

        @media(--desktop) {
            grid-template-columns: 300px 1fr;
        }
        @media(--tablet) {
            grid-template-columns: 240px 1fr;
            gap: 1.5rem;
        }
        @media(--mobile) {
            grid-template-columns: 120px 1fr;
            gap: 1rem;
        }

        .main-poster {
            position: sticky;
            top: 80px;
            align-self: start;

            grid-row: 1 / -1;
            @media(--tablet) {
                position: static;
                grid-row: 1 / 2;
            }

            .main-poster-image {
                width: 100%;
                height: auto;

                opacity: 0;
                transform: translateY(16px);
                transition: opacity 0.6s ease, transform 0.6s ease;

                &:global(.visible) {
                    opacity: 1;
                    transform: translateY(0);
                }

            }
        }
    }

    .information-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

    }
    h3 {
        padding: 0;
        margin-left: 0;
        margin-right: 0;
    }
    .underbar {
        padding-bottom: 0.5rem;
        border-bottom: 0.5px solid #eee;
        margin-bottom: 1rem;
    }


    .label-container {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        color: #999;

        .label {
            font-size: 0.85rem;
            font-weight: 600;
        }
    }

    /* ── 본문 컨테이너 ─────────────── */
    .content-container {
        display: flex;
        flex-direction: column;
        gap: 4rem;
        
        width: 100%;
        min-width: 0;
        max-width: 1400px;
        margin: 0 auto;
        padding: 3rem 0 0 0;

        grid-column: 2 / -1;

        @media(--tablet) {
            grid-column: 1 / -1;
        }
    }

    /* ── Info ──────────────────────── */
    .info-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.8rem;
        margin-bottom: 2rem;

        .info-item {
            display: grid;
            grid-template-columns: 120px 1fr;
            font-size: 1rem;

            .value {
                font-weight: 300;
                color: #333;

                &--link {
                    text-decoration: none;
                    transition: color 0.15s;
                    &:hover { color: #1a73e8; }
                }
            }
        }
    }

    .action-area {
        display: flex;
        justify-content: flex-end;



        .btn-reserve {
            display: inline-block;
            text-decoration: none;
            text-align: center;
            background-color: transparent;
            color: black;
            padding: 0.6rem 2rem;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: opacity 0.2s;
            border: 1px solid #333;

            &:disabled {
                opacity: 0.35;
                cursor: default;
            }

            &:not(:disabled):hover {
                opacity: 0.8;
            }
        }
    }

    /* ── Artists ───────────────────── */
    .artists-grid {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 200px;
        overflow-x: auto;
        min-width: 0;
        gap: 1rem;

        @media (--mobile) {
            grid-auto-columns: 140px;
            gap: 0.75rem;
        }
    }

    /* ── Program ──────────────────── */
    .program-list {
        display: flex;
        flex-direction: column;
        gap: 0;
    }

    .program-item {
        padding: 0.6rem 0 0.6rem 1.5rem;

        &--section {
            padding-left: 0;
            margin-top: 1.5rem;
            .section-label {
                font-size: 1rem;
                font-weight: 600;
                color: #111;
                letter-spacing: 0.02em;
            }
        }

        &--header {
            .section-header {
                font-size: 1rem;
                font-weight: 600;
                color: #111;
                letter-spacing: 0.02em;
            }
            margin-top: 1.5rem;
        }

        .piece-row {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;

            // align-items: center;
            font-size: 1.0rem;
            line-height: 1.5;
            font-weight: 300;
            color: #555;
            margin: 0;

            .piece-composer {
                font-weight: 400;
                color: #333;
                margin-left: 2rem;

                @media(--mobile) {
                    margin-left: 1rem;
                }
            }

            .piece-title {
                line-height: 1.5;
            }

            .piece-performer {
                font-size: 0.82rem;
                color: #999;
                &::before {
                    content: '— ';
                }
            }
        }
    }

    .intermission {
        text-align: center;
        font-size: 0.78rem;
        letter-spacing: 0.2em;
        color: #bbb;
        text-transform: uppercase;
        margin: 1.5rem 0 0.5rem;
    }
</style>