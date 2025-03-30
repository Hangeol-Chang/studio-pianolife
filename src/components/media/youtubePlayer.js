// test code for now

'use client'

import { useRef, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

const YouTubeAudioPlayer = (videoId) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const togglePlay = () => {
        if (!isPlaying) {
            // 처음 재생 시 iframe 추가
            if (iframeRef.current) {
                iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
            }
        } else {
            // 일시정지 - iframe을 제거해서 소리를 끔
            if (iframeRef.current) {
                iframeRef.current.src = "";
            }
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="audio-player">
            <button onClick={togglePlay} className="play-button">
                {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <iframe
                ref={iframeRef}
                width="0"
                height="0"
                style={{ display: "none" }}
                title="YouTube Audio"
                frameBorder="0"
                allow="autoplay"
            />
        </div>
    );
};


async function fetchVideoDetails(VIDEO_ID) {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${VIDEO_ID}&key=${API_KEY}&part=snippet,contentDetails`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("YouTube Data:", data);
    } catch (error) {
        console.error("Error fetching video details:", error);
    }
}


export default function YoutubeCarousel({ videoId }) {
    
    return(
        <></>
    )
}


