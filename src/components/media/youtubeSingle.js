import { useEffect, useRef } from 'react';

export default function YoutubePlayer({videoId, autoplay = 0, size = 640, callback = null, isPlaying = true}) {
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const intervalRef = useRef(null); // interval ID 저장

    useEffect(() => {
        // Clean up previous player
        if (playerRef.current && playerRef.current.destroy) {
            playerRef.current.destroy();
            playerRef.current = null;
        }
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }
        // Clean up previous interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Load YouTube API if not loaded
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
        }

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player(containerRef.current, {
                width: size,
                videoId: videoId,
                playerVars: {
                    autoplay: autoplay,
                    mute: autoplay,
                },
                events: {
                    onReady: (event) => {
                        event.target.playVideo();
                        if (callback) {
                            intervalRef.current = setInterval(() => {
                                callback(event.target);
                            }, 100);
                        }
                    },
                },
            });
        };

        // If API is already loaded
        if (window.YT && window.YT.Player) {
            window.onYouTubeIframeAPIReady();
        }

        // Cleanup on unmount
        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [videoId]);

    useEffect(() => {
        if (playerRef.current && playerRef.current.playVideo && playerRef.current.pauseVideo) {
            if (isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }
        }
    }, [isPlaying])

    return <div ref={containerRef} />;
}