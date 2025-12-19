<script>
    import PageTitle from '@/components/ui/PageTitle.svelte';
    import Spacer from '@/components/ui/Spacer.svelte';
    import ResponsiveImage from '@/components/ui/ResponsiveImage.svelte';
    import { onMount } from 'svelte';

    let mounted = false;

    onMount(() => {
        mounted = true;
    });
</script>

{#if mounted}
    <div class="about-container">
        <div class="cover-container">
            <ResponsiveImage 
                path="/profile" 
                name="jungwoo_profile.png" 
                alt="piano" 
                className="main-image"
            />
            <h1 class="cover-name-text">Studio PianoLife</h1>
        </div>

        <Spacer height={30} />
        
        <PageTitle title="About" subTitle="스튜디오 피아노라이프" />
        
        <div class="content-wrapper">
            <p>
                피아노를 사랑하는 사람들의 공간, 스튜디오 피아노라이프입니다.<br/>
                연주 영상 촬영, 녹음, 그리고 소규모 연주회까지.<br/>
                당신의 피아노 라이프를 기록해드립니다.
            </p>
        </div>

        <Spacer height={50} />
    </div>
{/if}

<style lang="scss">
    .about-container {
        width: 100%;
    }

    .cover-container {
        position: relative;
        width: 100%;
        overflow: hidden;
        background: linear-gradient(30deg, #e6bec2 10%, #f1dddf 30%, #f2dfe1 90%);
        background-color: black;

        // Responsive Height
        height: 900px;
        
        @include tablet {
            height: 700px;
        }

        @include mobile {
            height: 120vw;
        }
    }

    :global(.main-image) {
        position: absolute;
        left: 50%;
        bottom: 0%;
        transform: translate(-50%, 0);
        animation: image-init-slide 1s ease-in-out forwards;
        z-index: 0;
        height: auto;
        mask-image:
            linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
            linear-gradient(to top, black 0%, black 95%, transparent 100%);
        mask-composite: intersect;

        // Responsive Width
        width: 50%;

        @include tablet {
            width: 70%;
        }

        @include mobile {
            width: 90%;
        }
    }

    .cover-name-text {
        width: 100%;
        text-align: center;
        font-weight: normal;
        color: white;
        margin: auto;
        left: 50%;
        bottom: 10%;
        position: absolute;
        z-index: 10;
        transform: translate(-50%, 0);
        animation: cover-name-init-slide 1s ease-in-out forwards;
        text-shadow: 4px 4px 2px rgba(50, 20, 21, 0.6);

        // Responsive Font
        font-size: 50px;
        letter-spacing: 8px;

        @include tablet {
            font-size: 40px;
            letter-spacing: 6px;
        }

        @include mobile {
            font-size: 24px;
            letter-spacing: 3px;
            bottom: 15%;
        }
    }

    @keyframes image-init-slide {
        from {
            bottom: -40%;
            opacity: 0;
        }
        to {
            bottom: 0%;
            opacity: 1;
        }
    }

    @keyframes cover-name-init-slide {
        from {
            bottom: 20%;
            opacity: 0;
        }
        to {
            bottom: 10%;
            opacity: 1;
        }
    }

    .content-wrapper {
        padding: 0 5vw;
        line-height: 1.6;
    }
</style>
