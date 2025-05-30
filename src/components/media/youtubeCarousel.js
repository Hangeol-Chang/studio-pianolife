

/*
    videoInfos = [
        {
            videoId: 'videoId'
            title: 'title',
        }
    ]
*/

'use client';
/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import YoutubePlayer from "./youtubeMulti";
import getPageSize from "@/app/api/client/getPageSize";
import { css, keyframes } from '@emotion/react';

export default function YoutubeCarousel({ videoInfos }) {
    const [youtubeWidth, setYoutubeWidth] = useState(600);
    const [nowIndex, setNowIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    const resizeEvent = () => { 
        console.log('resizeEvent');
        setYoutubeWidth(getPageSize().width * 0.8); 
    }

    const youtube_wrapper_style= css`
        display: none;
        position: absolute;

        flex-direction: column;
        justify-content: center;
        align-items: center;

        transition: all 0.5s ease-in-out;
        animation: all 0.5s ease-in-out;
        
        width: ${youtubeWidth}px;
        height: ${youtubeWidth * 0.5625 + 40}px;
        padding: 4px;
        box-shadow: 0px 2px 3px rgba(100, 100, 100, 0.1);
        opacity: 0;
    `;

    const getYoutubeWrapperStyle = (index) => css`
        ${youtube_wrapper_style}

        ${index === nowIndex && css`
            display: flex;
            left: 10%;
            opacity: 1;
        `}

        ${index === (nowIndex - 1 + videoInfos.length) % videoInfos.length && css`
            display: flex;
            left: -75%;
            opacity: 0.5;
        `}

        ${index === (nowIndex + 1) % videoInfos.length && css`
            display: flex;
            left: 95%;
            opacity: 0.5;
        `}
    `;

    const changeNowIndex = ({ dir = 1 }) => {
        setNowIndex((prev) => (prev + dir + videoInfos.length) % videoInfos.length);
    }

    useEffect(() => {
        setMounted(true);
    }, []);
    
    useEffect(() => {
        resizeEvent();
    
        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('resize', resizeEvent);
        };
    }, [mounted]);

    const carousel_container_style = css`
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        width: 100%;
        height: ${youtubeWidth * 0.5625 + 40}px;
    `;

    const index_change_button_style = css`
        position: absolute;
        width: 40%;
        height: ${mounted ? getPageSize().width * 0.7 + 'px' : 0};
        z-index: 11;
        top: 0%;
        cursor: pointer;
    `;
    const index_change_button_style_left = css`
        ${index_change_button_style};
        left: 0%;
    `;
    const index_change_button_style_right = css`
        ${index_change_button_style};
        right: 0%;
    `;

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div css={carousel_container_style}>
                {videoInfos.map((video_info, index) => (
                    <div key={video_info.videoId} css={getYoutubeWrapperStyle(index)}>
                        <div css={css` 
                                display: flex;
                                width: 100%;
                                justify-content: left;
                            `}
                        >
                            <h3 css={css`
                                margin: 2px 4px;
                                padding: 0;
                            `}>{video_info.title}</h3>
                        </div>
                        <YoutubePlayer 
                            videoId={video_info.videoId}
                            size={youtubeWidth}
                        />
                    </div>
                ))} 
            </div>
            <div css={index_change_button_style_left}  onClick={() => changeNowIndex({dir: -1})}></div>
            <div css={index_change_button_style_right} onClick={() => changeNowIndex({dir: 1})}></div>
        </div>
    )
}