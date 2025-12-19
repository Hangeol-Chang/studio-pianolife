<script>
    import { onMount } from 'svelte';
    import { getSizedImage } from '@/utils/getSizedImage';
    import { PUBLIC_BACKEND_URL } from '$env/static/public';

    export let path;
    export let name;
    export let alt = '';
    export let className = '';
    export let style = '';

    let src = '';
    
    // Initial src for SSR/hydration
    const baseName = name.substring(0, name.lastIndexOf('.'));
    const ext = "webp";
    // src = `${path}/resized/${baseName}_320.${ext}`;
    // Update initial src to use backend URL
    const backendUrl = PUBLIC_BACKEND_URL || '';
    const staticPath = '/static';
    src = `${backendUrl}${staticPath}${path}/resized/${baseName}_320.${ext}`;

    onMount(() => {
        const updateSrc = () => {
            src = getSizedImage(path, name);
        };
        updateSrc();
        window.addEventListener('resize', updateSrc);
        return () => {
            window.removeEventListener('resize', updateSrc);
        };
    });
</script>

<img {src} {alt} class={className} {style} {...$$restProps} />
