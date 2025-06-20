'use client'
/** @jsxImportSource @emotion/react */

import getPageSize from '@/app/api/client/getPageSize.js';
import { Note } from '../music/sheet.js';
// import { LongSheet, MediumSheet, ShortSheet } from '../music/sheetPreset.js';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';


const music_sheet_container_single_style = css`
    position: relative;
    padding: 1px 0px;
    width: 100%;
`;
const music_sheet_line_single_style = css`
    height: 1px;
    background-color: #222;
    margin: 1px 0px;
    border: 0px;
`;
const music_sheet_line_single_light_style = css`
    height: 1px;
    background-color: #bbb;
    margin: 1px 0px;
    border: 0px;
`;

const Title1 = ({title, subTitle, idf=1}) => {
    const [iconLeft, setIconLeft] = useState(0);
    const [mounted, setMounted] = useState(false);
    const handleResize = () => {
        setIconLeft(14 - 7*768 / getPageSize().width);
    }
    useEffect(() => {
        setMounted(true);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => { 
            setMounted(false); 
            window.removeEventListener('resize', handleResize);
        }
    }, []);


    return ( mounted &&
        <div>
            <h1>{title}</h1>
            <div >
                <div css={music_sheet_container_single_style}>
                    <hr css={music_sheet_line_single_style}/>
                    {/* <Note index={21} width={20} left={iconLeft} top={-25} /> */}
                    {/* <MediumSheet idf={idf} /> */}
                </div>
            </div>
            <h3>{subTitle}</h3>
        </div>
    )
}

const Title2 = ({title, subTitle, idf=1}) => {
    return (
        <div>
            <h2>
                {title}
                <div css={music_sheet_container_single_style}>
                    <hr css={music_sheet_line_single_light_style}/>
                    {/* <ShortSheet idf={idf} /> */}
                </div>
            </h2>
            <h4>{subTitle}</h4>
        </div>
    )
}
const Title3 = ({title, line = true}) => {
    return (
        <h3>
            {title}
            {line && <hr 
                style={{
                    width: '30%',
                    margin: '1px 0px',
                }}
            />}
        </h3>
    )
}
const Title4 = ({title}) => {
    return (
        <h4>
            {title}
        </h4>
    )
}
const Title5 = () => {
    
}
const Title6 = () => {
    
}

const HrV = ({width = 1, height = 10, color='black', style}) => {
    return (
        <hr 
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: color,
            }}
            css={style}
        />
    )
}

export {
    Title1,
    Title2,
    Title3,
    Title4,
    Title5,
    Title6,
    HrV,
}