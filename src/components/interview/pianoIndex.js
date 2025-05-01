'use client';
import getPageSize from '@/app/api/client/getPageSize';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useRef, useState } from 'react';

const WhiteKey = ({left, size}) => {
    const whiteKeyStyle = () => css`
        position: absolute;
        top: 0;
        width: ${size}px;
        left: ${left}px;
        height: ${size*4}px;
        background-color: white;
        display: inline-block;
        border: 1px solid #EEEEEE;
        z-index: 1;
        border-radius: 10%;

        transition: all 0.5s ease-in-out;

        &:hover {
            background: linear-gradient(to bottom, #ffffff, #CCCCCC);
        }
    `;

    return (
        <div css={whiteKeyStyle}
            onPointerUp={e => {
                // click event
            }}
        >
        </div>
    );
}

const BlackKey = ({left, size}) => {
    const blackKeyStyle = () => css`
        position: absolute;
        width: ${size}px;
        height: ${size*3.5}px;
        top: 0;
        left: ${left}px;
        background-color: black;
        border : 1px solid #EEEEEE;
        z-index: 2;
        border-radius: 10%;

        &:hover {
            background: linear-gradient(to bottom, #000000, #555555);
        }
    `;

    return <div css={blackKeyStyle}></div>;     
}

export default function PianoIndex() {
    const containerRef = useRef(null);
    const [keys, setKeys] = useState([]); // 상태로 키 관리
    const [keyWidth, setKeyWidth] = useState(30);

    const piano_index_container = css`
        display: flex;
        padding: 10px;
        height: ${(keyWidth-2)*4.3}px;
        justify-content: center;
        align-items: top;
        background-color: #f0f0f0;  // 색 지울 것.
        position: relative;

        overflow: hidden;
    `;

    // const scrollHijack = (e) => {
    //     e.preventDefault(); // 기본 스크롤 동작 방지
    //     const scrollAmount = e.deltaY; // 스크롤 양
    //     containerRef.current.scrollLeft += scrollAmount; 

    //     console.log('scrollLeft', containerRef.current.scrollLeft); 
    // }

    const handleResize = () => {
        const width = getPageSize().width;
        const newKeyWidth = Math.floor(width / 20); 
        setKeyWidth(newKeyWidth);
    };

    useEffect(() => {
        handleResize(); // 초기 렌더링 시 키 너비 설정
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize); 
        };
    })

    useEffect(() => {
        const width = getPageSize().width;
        const newKeys = [];

        for (let i = 0; i < width / keyWidth + 1; i++) {
            newKeys.push(<WhiteKey key={'whitekey-' +i} left={i * keyWidth} size={keyWidth-2} />);
            if(!((i%7) === 2 || (i%7) === 6)) {
                newKeys.push(<BlackKey key={'blackkey-' +i} left={(i+1) * (keyWidth) - keyWidth*4/6/2} size={keyWidth*4/6} />); // 블랙키는 10px 간격으로 배치
            } 
        }
        setKeys(newKeys); // 상태 업데이트
    }, [keyWidth]);

    return (
        <div css={piano_index_container} ref={containerRef}>
            {keys}
        </div>
    );
}