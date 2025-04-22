'use client';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'


const WhiteKey = ({left}) => {
    const whiteKeyStyle = () => css`
        position: absolute;
        top: 0;
        width: 20px;    
        margin: 1px;
        left: ${left}px;
        height: 80px;
        background-color: white;
        display: inline-block;
        z-index: 1;
    `;

    return <div css={whiteKeyStyle}></div>;
}

const BlackKey = ({left}) => {
    const blackKeyStyle = () => css`
        position: absolute;
        width: 20px;
        height: 50px;
        top: 0;
        left: ${left}px;
        background-color: black;
        z-index: 2;
    `;

    return <div css={blackKeyStyle}></div>;
}

export default function PianoIndex() {

    const piano_index_container = css`
        display: flex;
        padding: 10px;
        height: 100px;
        justify-content: center;
        align-items: top;
        margin-top: 20px;
        background-color: #f0f0f0;
        position: relative;
    `;

    return (
        <div css={piano_index_container}>
            <WhiteKey left={0}/>
            <BlackKey left={0}/>
        </div>
    )
}