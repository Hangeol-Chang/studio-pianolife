'use client';
import getPageSize from '@/app/api/client/getPageSize';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useReducer, useRef, useState } from 'react';


const WhiteKey = ({left}) => {
    const whiteKeyStyle = () => css`
        position: absolute;
        top: 0;
        width: 18px;    
        left: ${left}px;
        height: 80px;
        background-color: white;
        display: inline-block;
        border: 1px solid #EEEEEE;
        z-index: 1;
        border-radius: 10%;

        transition: all 0.5s ease-in-out;

        &:hover {
            transform: scale(1.4);
        }
    `;

    return (
        <div css={whiteKeyStyle}
            onPointerUp={e => {
                // click event
            }}
        >
        </div>
    )
    ;
}

const BlackKey = ({left}) => {
    const blackKeyStyle = () => css`
        position: absolute;
        width: 18px;
        height: 50px;
        top: 0;
        left: ${left}px;
        background-color: black;
        border : 1px solid #EEEEEE;
        z-index: 2;
        border-radius: 10%;
    `;

    return <div css={blackKeyStyle}></div>;
}

export default function PianoIndex() {
    const containerRef = useRef(null);
    const [keys, setKeys] = useState([]); // 상태로 키 관리

    const piano_index_container = css`
        display: flex;
        padding: 10px;
        height: 100px;
        justify-content: center;
        align-items: top;
        margin-top: 20px;
        background-color: #f0f0f0;
        position: relative;

        overflow: hidden;
    `;

    useEffect(() => {
        const width = getPageSize().width;
        const newKeys = [];
        for (let i = 0; i < width / 20 + 1; i++) {
            newKeys.push(<WhiteKey key={'whitekey-' +i} left={i * 20} />);
            /*
                0 -> 10
                1 -> 30
                2 -> x
                3 -> 70
                4 -> 90
                5 -> 110
                6 -> x
                7 -> 처음으로(160 + 10)
            */
            if(!((i%7) === 2 || (i%7) === 6)) {
                newKeys.push(<BlackKey key={'blackkey-' +i} left={i * 20 + 10} />); // 블랙키는 10px 간격으로 배치
            } 
        }
        setKeys(newKeys); // 상태 업데이트
    }, []);

    return (
        <div css={piano_index_container} ref={containerRef}>
            {keys} {/* 상태 기반으로 키 렌더링 */}
        </div>
    );
}