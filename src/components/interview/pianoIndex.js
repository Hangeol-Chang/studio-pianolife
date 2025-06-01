'use client';
import getPageSize from '@/app/api/client/getPageSize';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { use, useEffect, useRef, useState } from 'react';

const WhiteKey = ({left, size, index, nowIndex, setNowIndex}) => {
    const whiteKeyStyle = () => css`
        position: absolute;
        top: 0;
        width: ${size}px;
        left: ${left}px;
        height: ${size*4}px;
        background: linear-gradient(
            to bottom,
            #FFFFFF 0%,
            #FFFFFF 50%,
            #CEEFF2 100%);
        background-position: top;
        background-size: 100% 200%;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);

        // border: 1px solid #EEEEEE;
        z-index: 3;
        border-radius: ${size/8}px;

        transition: all 0.3s ease-in-out;

        &:hover {
            background-position: bottom;
        }
        &:active {
            background: linear-gradient(
            to bottom,
            #FFFFFF 0%,
            #FFFFFF 50%,
            #91C4D9 100%);
        }
    `;

    const key_underblock_style = css`
        position: absolute;
        background: linear-gradient(
            to bottom,
            #FFFFFF 0%,
            #5897A6 75%,
            #FFFFFF 100%);

        width: ${size}px;
        height: ${size*4 + 20}px;
        left: ${left}px;
        top: 0px;
    `;

    const getWhiteKeyStyle = (now) => css`
        ${whiteKeyStyle()}

        ${now && css`
            // top: ${size/2}px;
            background-position: bottom;
            // background: linear-gradient(
            //     to bottom,
            //     #EEEEFF 0%,
            //     #EEEEFF 50%,
            //     #CCCCEE 100%);
        `}
    `;

    return (
        <>
            <div css={getWhiteKeyStyle(nowIndex == index)}
                onPointerUp={e => { setNowIndex(index); }}
            >
            </div>
            {nowIndex == index &&
                <div css={key_underblock_style}>
                </div>
            }
        </>
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
        background: linear-gradient(
            to bottom,
            #000000 0%,
            #000000 50%,
            #555555 100%);
        background-position: top;
        background-size: 100% 200%;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);

        // border : 1px solid #EEEEEE;
        z-index: 4;
        border-radius: ${size/8}px;

        transition: all 0.3s ease-in-out;
        &:hover {
            background-position: bottom;
        }
    `;

    return <div css={blackKeyStyle}></div>;
}

export default function PianoIndex({ nowIndex, setNowIndex }) {
    const containerRef = useRef(null);
    const [keyWidth, setKeyWidth] = useState(30);
    const [mounted, setMounted] = useState(false);

    const piano_index_container = css`
        display: flex;
        padding: 10px;
        height: ${(keyWidth-2)*4.5 + 3}px;
        justify-content: center;
        align-items: top;
        position: relative;

        overflow: hidden;
    `;

    const handleResize = () => {
        const width = getPageSize().width;
        const newKeyWidth = Math.floor(width / 20); 
        setKeyWidth(newKeyWidth);
    };

    useEffect(() => {
        setMounted(true);

        handleResize(); // 초기 렌더링 시 키 너비 설정
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize); 
            setMounted(false);
        };
    }, []);

    const renderKeys = () => {
        if (!mounted) return null;

        const width = getPageSize().width;
        const newKeys = [];
    
        for (let i = 0; i < width / keyWidth + 1; i++) {
          newKeys.push(
            <WhiteKey
              key={"whitekey-" + i}
              index={i}
              nowIndex={nowIndex} setNowIndex={setNowIndex}
              left={i * keyWidth}
              size={keyWidth - 2}
            />
          );
          if (!((i % 7) === 2 || (i % 7) === 6)) {
            newKeys.push(
              <BlackKey
                key={"blackkey-" + i}
                left={(i + 1) * keyWidth - (keyWidth * 4) / 6 / 2}
                size={(keyWidth * 4) / 6}
              />
            );
          }
        }
    
        return newKeys;
    };

    return (
        <div css={piano_index_container} ref={containerRef}>
            {renderKeys()}
        </div>
    );
}