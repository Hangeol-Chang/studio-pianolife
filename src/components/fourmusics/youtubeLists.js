'use client'
/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';


export default function YoutubeList({videoIds, imageWidth}) {
        
    const video_container_style = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 10px 0px;
    `;

    const video_wrapper_style = css`
        position: relative;
        display: flex;
        height: 80%;
        width: 20%;
        z-index: 1;
        transition: all 0.7s ease-in-out;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        margin: 6px;
    `;

    const video_wrapper_style_main = css`
        overflow: visible;
        z-index: 2;
        width: 100%;
        height: 100%;
        // transform: scale(1.2);
    `;

    const video_style = css`
        overflow: visible;
    `;

    const [nowIndex, setNowIndex] = useState(0);

    useEffect(() => {
        // wait 1s
        setTimeout(() => {
            setNowIndex((nowIndex + 1) % videoIds.length);
        }, 5000);
        // console.log(nowIndex);

    }, [nowIndex]);

    const getVideoWrapperStyle = (index) => {
        const style = [video_wrapper_style]
        if (index === nowIndex) {
            style.push(video_wrapper_style_main);
        }
        return css(style);
    }

    return (
        <div css={video_container_style}>
            {videoIds.map((videoId, index) => {
                return (
                    <div css={getVideoWrapperStyle(index)} key={index}>
                        <iframe
                            css={video_style}
                            width={imageWidth}
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen

                        ></iframe>
                    </div>
                )
            })}
        </div>
    )
}