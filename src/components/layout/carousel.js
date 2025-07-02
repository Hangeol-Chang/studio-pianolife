'use client';
/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Image from 'next/image';
import { css, keyframes } from '@emotion/react';
import { IndexChangeBt_Left, IndexChangeBt_Right } from '../common/indexChangeButton';
import ResponsiveImage from './responsiveImaage';
import App from 'next/app';

// autoscroll ? -> scroll speed로 사용
export default function Carousel({imageList, imageWidth = 300, imageGap = 30,  autoscroll = 0 }) {
    // check mountecd
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { 
        setIsMounted(true); 
        return () => { setIsMounted(false);  }
    }, []);

    // autoscroll 애니메이션
    const auto_scroll_left = keyframes`
        0% { transform: translateX(0%); }
        100% { transform: translateX(-400%); }
    `;

    const [nowIndex, setNowIndex] = useState(0);
    const [scrollConst, setScrollConst] = useState(3000);
    const imageContainerRef = useRef(null);
    const rootsRef = useRef(new Map()); // React 루트들을 관리

    const image_container_style = css`
        display: flex;
        justify-content: center;
        align-items: top;
        position: relative;
        // overflow: hidden;
        width: 100%;
        height: ${imageWidth * 0.5625}px;
        margin: 10px 0;
        padding: 0 ${imageGap / 2}px;
    `;

    const scale_up = keyframes`
        0% { transform: scale(1.0); }
        100% { transform: scale(1.4); }
    `;
    const scale_down = keyframes`
        0% { }
        100% { transform: scale(1.0); }
    `;

    const fade_out = keyframes`
        0% { opacity: 1.0; }
        100% { opacity: 0; }
    `;
    const fade_in = keyframes`
        0% { opacity: 0; }
        100% { opacity: 1.0; }
    `;
    
    const image_style = css`
        display: flex;
        justify-content: center;
        align-items: center;

        // object-fit: cover;
        position : absolute;
        border-radius: 4px;

        display: none;
        
        ${autoscroll > 0 && css`
            animation: ${auto_scroll_left} ${autoscroll * scrollConst / 275}s linear infinite;
        `}
    `;

    const GetImageStyle = (index) => {
        return css`
            ${image_style}

            ${index === nowIndex && css`
                display: block;
                left: ${imageGap / 2}px;
                box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
                z-index: 5;
            `}

            ${index === (nowIndex - 2 + imageList.length) % imageList.length && css`
                display: block;
                left: -${2 * imageWidth + imageGap * 5 / 2}px;
                z-index: 1;
            `}

            ${index === (nowIndex - 1 + imageList.length) % imageList.length && css`
                display: block;
                scale: 1.0;
                left: -${imageWidth + imageGap * 3 / 2}px;
                z-index: 3;
            `}

            ${index === (nowIndex + 1) % imageList.length && css`
                display: block;
                scale: 1.0;
                left: ${imageWidth + imageGap * 3 / 2}px;
                z-index: 3;
            `}

            ${index === (nowIndex + 2) % imageList.length && css`
                display: block;
                left: ${2 * imageWidth + imageGap * 5 / 2}px;
                z-index: 1;
            `}
        `;
    };

    

    const AppendImage = (index) => {
        if (!imageContainerRef.current || !imageList.length) {
            return;
        }
        
        if (!imageList[index]) {
            return;
        }
        
        // 컨테이너 div 생성
        const container = document.createElement('div');
        container.className = `image-container-${index}`;
        
        // 공통 스타일 적용
        Object.assign(container.style, {
            // position: 'absolute',
            transition: 'all 0.3s ease',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            width: `${imageWidth}px`,
            height: 'auto',
        });
        
        // React 루트 생성                  
        const root = createRoot(container);
        rootsRef.current.set(index, root);
        
        // React Element 렌더링
        try {
            if(imageList[index].startsWith('http')) {
                root.render(
                    <Image
                        key={imageList[index]}
                        src={imageList[index]} 
                        alt="poster" 
                        css={GetImageStyle(index)}
                        width={imageWidth}
                        height={0}
                        style={{ width: `${imageWidth}px`, height: 'auto' }}
                    />
                );
            } else {
                root.render(
                    <ResponsiveImage
                        key={imageList[index]}
                        path={"/fourmusics"} 
                        name={imageList[index]} 
                        css={GetImageStyle(index)}
                        alt="poster"
                        width={imageWidth}
                        height={0}
                        style={{ width: `${imageWidth}px`, height: 'auto' }}
                    />
                );
            }
            
            // DOM에 컨테이너 추가
            imageContainerRef.current.appendChild(container);
            
        } catch (error) {
            console.error(`Error rendering image at index ${index}:`, error);
        }
    }

    // nowIndex 변경 시 이미지 업데이트
    useEffect(() => {
        // nowIndex+2를 dom에 추가하고, 마지막 child는 지우기
        if (!imageContainerRef.current || !imageList.length) return;
        const container = imageContainerRef.current;
        const removeClass = `image-container-${(nowIndex - 2 + imageList.length) % imageList.length}`;
        const elementToRemove = container.querySelectorAll(`.${removeClass}`);
        if (elementToRemove) {
            elementToRemove.forEach((el) => container.removeChild(el));
        }

        AppendImage((nowIndex + 2) % imageList.length);

    }, [nowIndex]);

    // 초기 로딩 - 한 번만 실행
    useEffect(() => {
        // 마운트되고 이미지 리스트가 있을 때만 실행
        if (!isMounted || !imageContainerRef.current || !imageList.length) {
            return;
        }
        
        for(let i = -1; i <= 2; i++) {
            const index = (nowIndex + i + imageList.length) % imageList.length;      
            try {
                AppendImage(index);
            } catch (error) {
                console.error(`Error appending image at index ${index}:`, error);
            }
        }        
    }, [isMounted]); // isMounted가 true가 될 때 한 번만 실행

    // autoscroll 설정
    useEffect(() => {
        if (autoscroll > 0) {
            const interval = setInterval(() => {
                changeimageIndex(1);
            }, scrollConst * autoscroll);

            return () => clearInterval(interval);
        }
    }, [autoscroll, scrollConst]); // autoscroll 관련 값들만 의존성으로

    const changeimageIndex = (dir) => {
        setNowIndex((prevIndex => (prevIndex + dir + imageList.length) % imageList.length));
    }

    // 최초 1회 로딩될 때 수동으로 지정해줘야 함.
    return(
        <div css={image_container_style} ref={imageContainerRef}>
            {/* <IndexChangeBt_Left onClick={() => changeimageIndex(-1)} />
            <IndexChangeBt_Right onClick={() => changeimageIndex(1)} /> */}
        </div>
    )
}