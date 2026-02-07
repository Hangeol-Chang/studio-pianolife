<script>
    import { onMount } from 'svelte';
    import fioreum_wallpaper from '$lib/assets/images/fioreum/fioreum_wallpaper.png';
    import FlowerLine from '@/components/fioreum/Flower.svelte';
    import flower_ref_image from '$lib/assets/images/fioreum/flower.jpg';

    let canvas;
    let points = [];

    onMount(() => {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = flower_ref_image;
        img.onload = () => {
             const w = 500;
             const h = (img.height / img.width) * w;
             
             canvas.width = w;
             canvas.height = h;
             
             ctx.drawImage(img, 0, 0, w, h);
        };
    });

    function handleCanvasClick(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        points = [...points, [Math.round(x), Math.round(y)]];
    }

    function clearPoints() {
        points = [];
    }

    function copyPoints() {
        if (points.length === 0) return;
        navigator.clipboard.writeText(JSON.stringify(points));
    }
</script>


<div>
    <div class="hero-container">
        <img src={fioreum_wallpaper} alt="Fioreum Wallpaper" class="hero-image"/>
        <div class="hero-overlay"></div>
    </div>

    <div class="flower-container">
        <div class="flower">
            <FlowerLine width="500px"/>
        </div>
        
    </div>
    
</div>

<style lang="scss">
    .hero-container {
        position: relative;
        width: 100%;
        height: auto;
        overflow: hidden;
    }
    
    .hero-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        max-height: 800px;

    }
    .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(245, 240, 230, 0.8), rgba(200, 180, 160, 0.8));
    }

    .flower-container {
        position: relative;
        width: 100%;
        height: 1000px;
        margin: auto;
    }
    
    .flower {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotateZ(-175deg);
    }
</style>