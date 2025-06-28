

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
import { use, useEffect, useState } from "react";
import YoutubePlayer from "./youtubeMulti";
import getPageSize from "@/app/api/client/getPageSize";
import { css, keyframes } from '@emotion/react';
import { IndexChangeBt_Left, IndexChangeBt_Right } from "../common/indexChangeButton";

export default function YoutubeCarousel({ videoInfos }) {
    const [youtubeWidth, setYoutubeWidth] = useState(600);
    const [nowIndex, setNowIndex] = useState(0);
    const [mounted, setMounted] = useState(false);
    
    // 터치/스크롤 관련 상태
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentTranslateX, setCurrentTranslateX] = useState(0);
    const [finalTranslateX, setFinalTranslateX] = useState(0);

    const resizeEvent = () => { 
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
        setCurrentTranslateX(0);
        setFinalTranslateX(0);
    }

    const handleStart = (clientX) => {
        setIsDragging(true);
        setStartX(clientX);
        setCurrentTranslateX(finalTranslateX);
    };

    const handleMove = (clientX) => {
        if (!isDragging) return;
        
        const deltaX = clientX - startX;
        // 드래그 저항을 약간 추가해서 더 자연스럽게 만들기
        const dampingFactor = 0.8;
        const newTranslateX = finalTranslateX + (deltaX * dampingFactor);
        setCurrentTranslateX(newTranslateX);
    };

    const handleEnd = (clientX) => {
        if (!isDragging) return;
        
        setIsDragging(false);
        
        // 일정 거리(100px) 이상 움직였을 때 인덱스 변경
        const threshold = getPageSize().width * 0.1; // 화면 너비의 15%
        const deltaX = startX - clientX;
        console.log('handleEnd', startX, clientX, deltaX, threshold);
        
        if (Math.abs(deltaX) > threshold) {
            console.log('change index', deltaX);
            if (deltaX < 0) {
                // 오른쪽으로 드래그 - 이전 슬라이드
                console.log('change index left');
                changeNowIndex({ dir: -1 });
            } else {
                // 왼쪽으로 드래그 - 다음 슬라이드
                console.log('change index right');
                changeNowIndex({ dir: 1 });
            }
        } else {
            // threshold 이하면 원래 위치로 복원
            setCurrentTranslateX(finalTranslateX);
        }
        
        setFinalTranslateX(0);
    };

    // 마우스 이벤트
    const handleMouseDown = (e) => {
        e.preventDefault();
        handleStart(e.clientX);
    };

    const handleMouseMove = (e) => {
        e.preventDefault();
        handleMove(e.clientX);
    };

    const handleMouseUp = (e) => {
        e.preventDefault();
        handleEnd(e.clientX);
    };

    // 터치 이벤트
    const handleTouchStart = (e) => {
        e.preventDefault(); // 스크롤 방지
        handleStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        e.preventDefault(); // 스크롤 방지
        handleMove(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        handleEnd(e.touches[0].clientX);
    };

    useEffect(() => {
        setMounted(true);
    }, []);
    
    useEffect(() => {
        // resizeEvent();
    
        window.addEventListener('resize', resizeEvent);
        
        // 마우스 이벤트 리스너 추가
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        
        return () => {
            window.removeEventListener('resize', resizeEvent);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [mounted, isDragging, startX, finalTranslateX]);

    const carousel_container_style = css`
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        width: 100%;
        height: ${youtubeWidth * 0.5625 + 40}px;
        
        transform: translateX(${currentTranslateX}px);
        transition: ${isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'};
        
        /* 터치 이벤트를 위한 스타일 */
        touch-action: pan-y;
        user-select: none;
        cursor: ${isDragging ? 'grabbing' : 'grab'};
        will-change: transform;
    `;

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <div 
                css={carousel_container_style}
            >
                {videoInfos.map((video_info, index) => (
                    video_info.videoId? 
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
                    : 
                    <div key={video_info} css={getYoutubeWrapperStyle(index)}>
                        <YoutubePlayer 
                            videoId={video_info}
                            size={youtubeWidth}
                        />
                    </div>
                ))} 
            </div>
            <IndexChangeBt_Left 
                onClick={() => changeNowIndex({dir: -1})} 
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            />
            <IndexChangeBt_Right onClick={() => changeNowIndex({dir: 1})} 
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            />
        </div>
    )
}