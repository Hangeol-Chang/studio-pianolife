'use client';
/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import getPageSize from '@/app/api/client/getPageSize';

import testData from './testData.json';
import { Title3, Title4 } from '../common/title';
import { YouTubeEmbed } from '../media/youtube';
import { FaBackward, FaForward, FaPlay } from 'react-icons/fa';


export default function PlayDescription({ videoId }) {
    const [videoData, setVideoData] = useState(null);

    async function getVideoData(vid) {
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // 환경 변수로 관리
        // const res = await fetch(
        //     `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${vid}&key=${API_KEY}`,
        //     { cache: 'no-store' } // App Router SSR을 사용하는 경우
        // );
        // if (!res.ok) {
        //     throw new Error('Failed to fetch video data');
        // }
        // const data = await res.json();
    
        const data = testData; // 테스트 데이터 사용
        // console.log(data);
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
    
    const icon_style = css`
        // box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
        color: grey;
    `;

    const play_controller_style = css`
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 20px 5%;
    `;

    return (
        <div>
            <Title3 title={videoData.snippet.title}></Title3>

            <div css={play_controller_style}>
                <FaBackward size={24} css={icon_style}/>
                <FaPlay size={24} css={icon_style}/>
                <FaForward size={24} css={icon_style}/>
            </div>

            <div css={css`display: flex; justify-content: center; align-items: center;`}>
                <YouTubeEmbed  videoId={videoData.id} width={'300px'} />
            </div>

            <p>길이: {parseDuration(videoData.contentDetails.duration)}</p>
            <p>좋아요: {videoData.statistics.likeCount}</p>

            <Title4 title="Description" />
            <p>
                {videoData.snippet.description.split('\n').map((line, i) => (
                    <span key={i}>
                        {line}
                        <br />
                    </span>
                ))}
            </p>
        </div>
    );
}