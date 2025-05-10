'use client';
/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import getPageSize from '@/app/api/client/getPageSize';

export default function PlayDescription({ videoId }) {
    const [videoData, setVideoData] = useState(null);

    async function getVideoData(vid) {
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // 환경 변수로 관리
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${vid}&key=${API_KEY}`,
            { cache: 'no-store' } // App Router SSR을 사용하는 경우
        );
    
        if (!res.ok) {
            throw new Error('Failed to fetch video data');
        }
    
        const data = await res.json();
        console.log(data);
        return data.items[0];
    }

    // ISO 8601 포맷 영상 길이 → hh:mm:ss로 변환
    const parseDuration = (isoDuration) => {
        const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = match?.[1] ? match[1].replace('H', '') : '0';
        const minutes = match?.[2] ? match[2].replace('M', '') : '0';
        const seconds = match?.[3] ? match[3].replace('S', '') : '0';
    
        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');
    
        return `${h}:${m}:${s}`;
    }

    // const title = video.snippet.title;
    // const description = video.snippet.description;
    // const likeCount = video.statistics.likeCount;
    // const duration = parseDuration(video.contentDetails.duration);

    useEffect(() => {
        if(videoId) {
            async function fetchVideoData() {
                const data = await getVideoData(videoId);
                setVideoData(data);
            }
            fetchVideoData();
        }
    }, [videoId]);
    
    if (!videoData) return <div>Loading...</div>;
    
    return (
        <div>
            <h1>{videoData.snippet.title}</h1>
            <p>길이: {parseDuration(videoData.contentDetails.duration)}</p>
            <p>좋아요: {videoData.statistics.likeCount}</p>
            <h3>설명:</h3>
            <pre>{videoData.snippet.description}</pre>
        </div>
    );
}