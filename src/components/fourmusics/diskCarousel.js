'use client';
/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import getPageSize from '@/app/api/client/getPageSize';
import ResponsiveImage from '../layout/responsiveImaage';

export default function DiskCarousel({ mediaInfos, nowIndex, changeIndexEvent }) {
    const [imageSize, setImageSize] = useState(100);
    
    const handleResize = () => {
        setImageSize(getPageSize().width * 0.5);
    }
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const scale_up = keyframes`
        0% { transform: scale(1.0); }
        100% { transform: scale(1.3); }
    `;
    const rotate = keyframes`
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    `;
    const scale_down = keyframes`
        0% { transform: scale(1.3); }
        100% { transform: scale(1.0); }
    `;
    
    const disk_wrapper = css`
        justify-content: center;
        align-items: center;
        width: ${imageSize}px;
        height: ${imageSize}px;

        object-fit: cover;
        position : absolute;
        transition: all 0.7s ease-in-out;

        display: none;
    `;

    const disk = css`
        border-radius: 50%;
        // transition: all 0.7s ease-in-out;

        object-fit: cover;
        position : absolute;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    `;

    const disk_hole = css`
        box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.3);
        width: 20%;
        height: 20%;
        border-radius: 50%;
        background-color: white;
        z-index: 2;
        display: block;
    `;

    const getDiskWrapperStyle = (index) => css`
        ${disk_wrapper}

        ${index === nowIndex && css`
            display: flex;
            top: -30%;
            left: 25%;
            animation: ${scale_up} 0.7s linear forwards;
            z-index: 10;
        `}

        ${index === (nowIndex - 1 + mediaInfos.length) % mediaInfos.length && css`
            display: flex;
            scale: 1.0;
            top: -80%;
            left: -20%;
            animation: ${scale_down} 0.7s linear forwards;
            filter: brightness(0.8);
            opacity: 0.3;
            z-index: 1;
        `}

        ${index === (nowIndex + 1) % mediaInfos.length && css`
            display: flex;
            scale: 1.0;
            top: -80%;
            left: 70%;
            filter: brightness(0.8);
            opacity: 0.3;
            z-index: 1;
        `}
    `;

    const getDiskStyle = (index) => css`
        ${disk}
        ${index === nowIndex && css`
            animation: ${rotate} 40s linear infinite;
        `}
    `;

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        return () => { setIsMounted(false); }
    }, []);

    const [imageList, setImageList] = useState([]);
    useEffect(() => {
        if(isMounted) setImageList(mediaInfos.map((mediaInfo) => mediaInfo.src));
    }, [isMounted, mediaInfos]); 

    const Disk = (({ image, index }) => {
        return (
            <div
                key={image + index}  
                css={getDiskWrapperStyle(index)}
            >
                <ResponsiveImage path={"/fourmusics"} name={image}
                    css={getDiskStyle(index)}
                    alt="disk" width={imageSize} height={imageSize}
                />
                <div css={disk_hole} />
            </div>
        );
    });

    const disk_container = css`
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        
        // overflow: hidden;

        width: 100%;
        height: ${imageSize * 0.9}px;
        z-index: 1;
    `;

    return (
        <div 
            css={disk_container}
            onClick={changeIndexEvent}
        >
            {
                isMounted ? 
                    imageList.map((image, index) => 
                        Disk({ image, index }) 
                    )
                : <></>
            }
        </div>
    )
}