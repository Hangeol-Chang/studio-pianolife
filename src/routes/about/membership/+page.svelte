<script>
    import MembershipHero from "@/components/about/MembershipHero.svelte";
</script>

<div>
    <MembershipHero canClick={false}/>

    <section class="description-section">
        <h1>Membership</h1>
    
        <div class="membership-description">
            <h2>Benefits</h2>
            <ul>
                <li>
                    연간 Fiore 기획 공연 5회 티켓 2매씩 제공
                </li>
                <li>
                    프로그램 북 후원자 명단 기재 (성함 또는 사업자명)
                </li>
                <li>
                    매 기획 공연 시 후원자 티켓 할인 제공
                </li>
            </ul>

            <h2>Price</h2>
            <ul>
                <li>
                    연회비 10만원 이상
                </li>
            </ul>
        </div>
    </section>
</div>

<style lang="scss">
    .description-section {
        display: grid;
        gap: 2rem;
        grid-template-columns: auto 3fr;

        @media (--tablet) {
            grid-template-columns: 1fr;
        }

        .membership-description {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            ul {
                list-style-type: square;
                padding-left: 1.5rem;

                li {
                    font-weight: 300;
                    color: #333;
                    line-height: 1.6;
                }
            }
        }
    }
</style>