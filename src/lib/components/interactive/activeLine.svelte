<script>
    import { onMount, onDestroy } from 'svelte';

    let time = 0;
    let frameId;
    let pathD = '';
    
    // 파동 설정
    export let amplitude = 20; // 파동의 높이 (진폭)
    export let frequency = 0.01; // 파동의 빈도
    export let speed = 0.05; // 움직이는 속도
    export let points = 200; // 곡선의 부드러움 (점의 개수)
    export let color = "black";
    export let strokeWidth = 2;

    const width = 1000; // 내부 좌표계 너비
    const height = 200; // 내부 좌표계 높이
    const centerY = height / 2;

    function animate() {
        time += speed;
        
        // 시작점 이동
        let d = `M 0 ${centerY + Math.sin(0 * frequency + time) * amplitude}`;
        
        for (let i = 1; i <= points; i++) {
            const x = (i / points) * width;
            // sin(x * frequency + time) 공식으로 y값 계산
            const y = centerY + Math.sin(x * frequency + time) * amplitude;
            d += ` L ${x} ${y}`;
        }
        
        pathD = d;
        frameId = requestAnimationFrame(animate);
    }

    onMount(() => {
        frameId = requestAnimationFrame(animate);
    });

    onDestroy(() => {
        if (frameId) cancelAnimationFrame(frameId);
    });
</script>

<div class="wave-container">
    <svg viewBox="0 0 {width} {height}" preserveAspectRatio="none">
        <path d={pathD} stroke={color} stroke-width={strokeWidth} fill="none" vector-effect="non-scaling-stroke" />
    </svg>
</div>

<style>
    .wave-container {
        width: 100%;
        height: 100px; /* 컴포넌트 높이 */
        overflow: hidden;
    }
    svg {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
