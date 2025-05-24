import { useEffect, useRef } from 'react';

export default function YoutubePlayer({videoId, autoplay = 0, size = 640}) {
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    // YouTube API 로드 상태 관리
    function loadYouTubeAPI(onLoad) {
        if (window.YT && window.YT.Player) {
            onLoad();
            return;
        }
        // 이미 로드 중인지 확인
        if (!window._ytApiLoading) {
            window._ytApiLoading = [];
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
            window.onYouTubeIframeAPIReady = () => {
                window._ytApiLoading.forEach(cb => cb());
                window._ytApiLoading = null;
            };
        }
        if (window._ytApiLoading) {
            window._ytApiLoading.push(onLoad);
        }
    }

    useEffect(() => {
        playerRef.current && playerRef.current.setSize(size, size * 0.5625);
    }, [size]);

    useEffect(() => {
        // Clean up previous player
        if (playerRef.current && playerRef.current.destroyx) {
            playerRef.current.destroy();
            playerRef.current = null;
        }
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }

        loadYouTubeAPI(() => {
            playerRef.current = new window.YT.Player(containerRef.current, {
                width: size,
                videoId: videoId,
                playerVars: {
                    autoplay: autoplay,
                    mute: autoplay,
                },
            });
        });

        // Cleanup on unmount
        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [videoId]);

    return <div ref={containerRef} />;
}