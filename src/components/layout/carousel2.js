'use client';
/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { css, keyframes } from '@emotion/react';

export default function Carousel2({imageList, imageWidth }) {
    // check mountecd
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { 
        setIsMounted(true); 
        return () => { setIsMounted(false);  }
    }, []);

    const [imageIndex, setImageIndex] = useState(0);

    const image_container_style = css`
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: ${imageWidth * 2.1}px;
        // margin: 10px 0;
    `;

    const scale_up = keyframes`
        0% { transform: scale(1.0); }
        100% { transform: scale(1.4); }
    `;
    const scale_down = keyframes`
        0% { transform: scale(1.4); }
        100% { transform: scale(1.0); }
    `;
    
    const image_style = css`
        display: flex;
        justify-content: center;
        align-items: center;

        object-fit: cover;
        position : absolute;
        transition: all 0.7s ease-in-out;
        border-radius: 4px;

        display: none;
    `;

    const GetImageStyle = (index) => css`
        ${image_style}

        ${index === imageIndex && css`
            display: block;
            left: 30%;
            animation: ${scale_up} 0.7s linear forwards;
            box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
            z-index: 5;
        `}

        ${index === (imageIndex - 1 + imageList.length) % imageList.length && css`
            display: block;
            scale: 1.0;
            left: -15%;
            animation: ${scale_down} 0.7s linear forwards;
            filter: brightness(0.8);
            opacity: 0.6;
            z-index: 1;
        `}

        ${index === (imageIndex + 1) % imageList.length && css`
            display: block;
            scale: 1.0;
            left: 75%;
            filter: brightness(0.8);
            opacity: 0.6;
            z-index: 1;
        `}
    `;

    useEffect(() => {
        setTimeout(() => changeimageIndex(), 5000);
    }, [imageIndex]);

    const changeimageIndex = () => {
        setImageIndex((imageIndex + 1) % imageList.length);
    }

    // 최초 1회 로딩될 때 수동으로 지정해줘야 함.
    return(
        <div css={image_container_style}>
            {isMounted ? 
                imageList.map((src, index) => (
                    <Image 
                        css={GetImageStyle(index)}
                        key={src+index}
                        src={src} alt="piano" 
                        width={imageWidth} height={0} layout="intrinsic"
                    />
                ))
            : null }
        </div>
    )
}