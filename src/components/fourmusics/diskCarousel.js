'use client';
/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export default function DiskCarousel({ mediaInfos, imageSize, nowIndex, changeIndexEvent }) {

    const scale_up = keyframes`
        0% { transform: scale(1.0); }
        100% { transform: scale(1.4); }
    `;
    const rotate = keyframes`
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    `;
    const scale_down = keyframes`
        0% { transform: scale(1.4); }
        100% { transform: scale(1.0); }
    `;
    
    const disk_wrapper = css`
        display: flex;
        justify-content: center;
        align-items: center;

        object-fit: cover;
        position : absolute;
        transition: all 0.7s ease-in-out;
    `;

    const disk = css`
        border-radius: 50%;
        // transition: all 0.7s ease-in-out;

        object-fit: cover;
        position : absolute;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    `;

    const disk_hole = css`
        box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.3);
    `;

    const getDiskWrapperStyle = (type) => css`
        ${disk_wrapper}

        ${type === 'main' && css`
            top: 30%;
            left: 30%;
            animation: ${scale_up} 0.7s linear forwards;
            z-index: 10;
        `}

        ${type === 'top' && css`
            scale: 1.0;
            top: 0%;
            left: -15%;
            animation: ${scale_down} 0.7s linear forwards;
            filter: brightness(0.8);
            opacity: 0.6;
            z-index: 1;
        `}

        ${type === 'bot' && css`
            scale: 1.0;
            top: 60%;
            left: -15%;
            filter: brightness(0.8);
            opacity: 0.6;
            z-index: 1;
        `}
    `;

    const getDiskStyle = (type) => css`
        ${disk}
        ${type === 'main' && css`
            animation: ${rotate} 10s linear infinite;
        `}
    `;

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        return () => { setIsMounted(false); }
    }, []);

    const [imageList, setImageList] = useState([]);
    const diskRefs = useRef([]);
    useEffect(() => {
        if(isMounted) setImageList(mediaInfos.map((mediaInfo) => mediaInfo.src));
    }, [isMounted, mediaInfos]); 

    const Disk = (({ image, index, diskRef }) => {
        const diskType = 
            index === nowIndex ? 'main' :
            index === (nowIndex - 1 + imageList.length) % imageList.length ? 'top' :
            (nowIndex + 1) % imageList.length === index ? 'bot' :
            'none'
        ;

        return (
            <div
                key={image + index} ref={diskRef} 
                css={getDiskWrapperStyle(diskType)}
                style={{ width: imageSize, height: imageSize }}
            >
                <img
                    css={getDiskStyle(diskType)} src={image} alt="disc"
                    style={{ width: imageSize, height: imageSize }}
                />
                <div
                    css={disk_hole}
                    style={{
                        width: imageSize * 0.2,
                        height: imageSize * 0.2,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        zIndex: 2,
                    }}
                />
            </div>
        );
    });

    
    
    const disk_container = css`
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30%;
        position: relative;
    `;

    return (
        <div 
            css={disk_container}
            style={{
                width: imageSize * 2,
                height: imageSize * 2.5,
                margin: '20px 0',
            }}
            onClick={changeIndexEvent}
        >
            {
                isMounted ? 
                    imageList.map((image, index) => 
                        Disk({ image, index, diskRef: (el) => diskRefs.current[index] = el })
                    )
                : <></>
            }
        </div>
    )
}