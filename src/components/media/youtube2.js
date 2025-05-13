'use client';

import { useEffect, useRef } from 'react';

export default function YoutubePlayer({videoId, autoplay = 0, size = 640, callback = null}) {
    const playerRef = useRef(null);

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('yt-player', {
                width: size,
                videoId: videoId, // 원하는 영상 ID로 변경하세요
                playerVars: {
                    autoplay: autoplay,
                    mute: autoplay,
                },
                events: {
                    onReady: (event) => {
                        event.target.playVideo();

                        setInterval(() => {
                            callback && callback(event.target);
                        }, 100);
                    },
                },
            });
        };
    }, []);

    return <div id="yt-player" />;
}