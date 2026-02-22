<script>
    import membershipWallpaper from '$lib/assets/images/about/membership_wallpaper.jpg'
    import { MoveRight } from 'lucide-svelte';

    export let canClick = true;
</script>

<section style="padding:0;">
    <div role="none" class="membership-hero-section {canClick ? 'clickable' : ''}" 
        on:click={() => canClick && (window.location.href = '/about/membership')}
    >
        <div class="content">
            <p>
                음악을 통해 관객에게 열정과 삼동을 전하고자 하는
                <br />
                Fiore에게 여러분의 후원은 큰 힘이 됩니다.
            </p>

            {#if canClick}
                <h6 class="sponsor-btn">
                    sponsor <MoveRight />
                </h6>
            {/if}
        </div>
        
        <img src={membershipWallpaper} alt="Membership bg" class="hero-image" />
        <div class="overlay"></div>
    </div>
</section>

<style lang="scss">
    .membership-hero-section {
        position: relative;
        width: 100%;
        height: 400px;
        overflow: hidden;

        &.clickable {
            cursor: pointer;
        }

        .hero-image {
            padding: 0;
            margin: 0;

            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            z-index: 1;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, 
                rgba(0, 0, 0, 0.9) 10%, 
                rgba(0, 0, 0, 0.3) 50%);
            z-index: 2;
        }

        .content {
            z-index: 3;
            position: absolute;
            top: 100px;
            p {
                color: white;
            }
        }
        .sponsor-btn {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            color: white;
            padding: 4px 12px;
            border-radius: 2px;
            border: 0.6px solid white;
            cursor: pointer;
        }
    }
</style>