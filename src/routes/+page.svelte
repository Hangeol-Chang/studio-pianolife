<script>
    import ActiveLine from "@/components/interactive/activeLine.svelte";
    import Introduction from "@/components/introduction/introduction.svelte";
</script>

<div style="height: 4000px;">
    <div class="main-img-container">
        <img src="/background/play_cut_wide_1.png" class="main-img" alt="img" />
        <div class="overlay-text">
            Studio Pianolife
        </div>
    </div>

    <div class="introduction-title">
        introduction
    </div>
    
    <Introduction />

    <div style="height: 200px;">
        <ActiveLine 
            amplitude={15} 
            frequency={0.02} 
            speed={0.1} 
            points={300} 
            color="black" 
            strokeWidth={3} 
        />
    </div>
</div>

<style>
    .main-img-container {
        position: relative;
        display: flex;
        justify-content: center;
        width: 100%;
        overflow: hidden;
    }

    .overlay-text {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        
        text-align: center;
        color: white;
        z-index: 1;

        font-weight: 100;

        animation: letterFadeIn 1s ease-in;

        @media (--large-desktop) {
            font-size: 3rem;
            letter-spacing: 0.7rem;
        }
        
        @media (--desktop) {
            font-size: 2rem;
            letter-spacing: 0.5rem;
        }
        @media (--tablet) {
            font-size: 1.5rem;
            letter-spacing: 0.3rem;
        }

    }
    @keyframes letterFadeIn {
        0% {
            opacity: 0.5;
            letter-spacing: 0.9rem;
        }
        100% {
            opacity: 1;
        }
    }

    .main-img {
        display: block;
        width: 100%;
        min-width: 700px;
        height: auto;
        flex-shrink: 0;

        animation: floatIn 1s ease-in;
    }
    @keyframes floatIn {
        0% {
            opacity: 0;
            transform: translateY(-40px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .introduction-title {
        margin: 50px;
        text-align: center;
        
        font-weight: 200;

        @media (--large-desktop) {
            font-size: 2rem;
        }
        
        @media (--desktop) {
            font-size: 1.5rem;
        }
        @media (--tablet) {
            font-size: 1rem;
        }
    }

</style>