<script>
    /** @type {{ year: number, left: { label: string, items: string[] } | null, right: { label: string, items: string[] } | null }[]} */
    const historyItems = [
        {
            year: 2026,
            left: null,
            right: {
                label: 'COMPANY',
                items: ['Fiore Art & Ent 신규 설립', 'Hall Fioreum 준공 및 개관']
            }
        },
        {
            year: 2025,
            left: {
                label: 'COMPANY',
                items: ['스튜디오 피아노라이프로 사명 변경']
            },
            right: null
        },
        {
            year: 2024,
            left: null,
            right: {
                label: 'PERFORMANCE',
                items: ["'슈만, 시인은 말한다'", '첫 단독 공연 기획']
            }
        },
        {
            year: 2023,
            left: {
                label: 'PERFORMANCE',
                items: ['포뮤직스 : Four Colors for Chopin']
            },
            right: null
        },
        {
            year: 2019,
            left: null,
            right: {
                label: 'COMPANY',
                items: ['사업자 설립']
            }
        }
    ];
</script>

<section class="history-section">
    <div class="header">
        <h1 class="section-title-center">History</h1>
        <h3 class="section-subtitle-center">연혁</h3>
        <p class="section-subtitle-center">2019년 설립 이래 Fiore의 발자취를 소개합니다.</p>
    </div>

    <div class="timeline">
        {#each historyItems as item}
            <div class="timeline-item">
                <div class="side left">
                    {#if item.left}
                        <span class="label">{item.left.label}</span>
                        {#each item.left.items as text}
                            <p class="desc-item">{text}</p>
                        {/each}
                    {/if}
                </div>

                <div class="year-col">
                    <span class="year">{item.year}</span>
                </div>

                <div class="side right">
                    {#if item.right}
                        <span class="label">{item.right.label}</span>
                        {#each item.right.items as text}
                            <p class="desc-item">{text}</p>
                        {/each}
                    {/if}
                </div>
            </div>
        {/each}

        <div class="to-be-continued">
            <p>To be continued...</p>
        </div>
    </div>
</section>

<style lang="scss">
    @use '../../styles/variables.scss' as *;

    .history-section {
        padding: 6rem 1.5rem;
    }

    .header {
        margin-bottom: 5rem;
    }

    /* ── Timeline container ── */
    .timeline {
        position: relative;
        max-width: 860px;
        margin: 0 auto;

        &::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 1px;
            background: $gray1;
            transform: translateX(-50%);
            z-index: 0;
        }
    }

    /* ── Each row ── */
    .timeline-item {
        display: grid;
        grid-template-columns: 1fr 160px 1fr;
        align-items: center;
        margin-bottom: 10rem;
        position: relative;
        z-index: 1;
    }

    /* ── Year number ── */
    .year-col {
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        padding: 0.25rem 0;
    }

    .year {
        font-size: 3.8rem;
        font-weight: 700;
        color: #CCC;
        line-height: 1;
        letter-spacing: -0.02em;
    }

    /* ── Side content ── */
    .side {
        padding: 0 1.5rem;

        &.left {
            text-align: right;
        }

        &.right {
            text-align: left;
        }
    }

    .label {
        display: block;
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.18em;
        color: $black1;
        margin-bottom: 0.5rem;
    }

    .desc-item {
        font-size: 0.88rem;
        color: $gray3;
        line-height: 1.75;
        margin: 0;
    }

    /* ── To be continued ── */
    .to-be-continued {
        position: relative;
        z-index: 1;
        text-align: center;
        padding: 1rem 0 2rem;
        background: white;
        width: fit-content;
        margin: 0 auto;
        padding: 0 1.5rem;

        p {
            font-size: 0.9rem;
            color: $gray2;
            letter-spacing: 0.08em;
            font-style: italic;
        }
    }

    /* ── Mobile: left-aligned vertical timeline ── */
    @include max(tablet) {
        .timeline {
            padding-left: 56px;

            // 라인을 왼쪽 고정 위치로 이동
            &::before {
                left: 20px;
                transform: none;
            }
        }

        .timeline-item {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            margin-bottom: 3rem;
            text-align: left;

            // 각 연도마다 라인 위에 원형 마커
            &::before {
                content: '';
                position: absolute;
                left: -40px; // 56px padding - 44px = 12px + 8px(반지름) = 20px(라인 위치) ✓
                top: 0.8rem;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: white;
                border: 1.5px solid $gray1;
                z-index: 2;
            }
        }

        .year-col {
            order: -1;
            margin-bottom: 0.4rem;
            justify-content: flex-start;
            background: transparent;
        }

        .year {
            font-size: 2.6rem;
        }

        .side {
            padding: 0;
            text-align: left !important;

            &:empty {
                display: none;
            }
        }

        .to-be-continued {
            padding-left: 0;
            margin-left: 0;
        }
    }
</style>