'use client'
/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { YouTubeEmbed } from '../media/youtubeMulti';


export default function YoutubeList({videoIds, imageWidth}) {
        
    const video_container_style = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 10px 0px;

        perspective: 1000px;
    `;

    const video_wrapper_style = css`
        position: relative;
        display: flex;
        // height: 80%;
        width: 10%;
        z-index: 1;
        transition: all 0.7s ease-in-out;
        // overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        margin: 6px;

        justify-content: center;
    `;

    const video_wrapper_style_main = css`
        overflow: visible;
        z-index: ${videoIds.length};
        width: 100%;
        // height: 100%;
    `;

    // index를 변수로 받아서 z-index를 조정하는 스타일을 반환하는 함수
    const video_wrapper_style_left = (index) => css`
        transform: rotateY(70deg) scale(0.8); 
        transform-origin: 100% 100% 100%;
        z-index: ${index};
        filter: brightness(50%);
    `;
    const video_wrapper_style_right = (index) => css`
        transform: rotateY(-70deg) scale(0.8); 
        transform-origin: 100% 100% 100%;
        z-index: ${index};
        filter: brightness(50%);
    `;

    const video_style = css`
        overflow: visible;
        border-radius: 8px;
    `;

    const [nowIndex, setNowIndex] = useState(0);

    useEffect(() => {
        // wait 1s
        setTimeout(() => {
            setNowIndex((nowIndex + 1) % videoIds.length);
        }, 5000);

    }, [nowIndex]);

    const getVideoWrapperStyle = (index) => {
        const style = [video_wrapper_style]
        if (index === nowIndex) {
            style.push(video_wrapper_style_main);
        }
        else if (index < nowIndex) {
            style.push(video_wrapper_style_left(index));
        }
        else if (index > nowIndex) {
            style.push(video_wrapper_style_right(videoIds.length - index));
        }
        return css(style);
    }

    return (
        <div css={video_container_style}>
            {videoIds.map((videoId, index) => {
                return (
                    <div css={getVideoWrapperStyle(index)} key={index}>
                        <YouTubeEmbed style={video_style} videoId={videoId} width={imageWidth} />
                    </div>
                )
            })}
        </div>
    )
}