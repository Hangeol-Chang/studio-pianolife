'use client';
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { mediaInfos } from '../media.json';

import { useEffect, useState } from 'react';
import DiskCarousel from '@/components/fourmusics/diskCarousel';
import getPageSize from '@/app/api/client/getPageSize'; 
import PlayDescription from '@/components/fourmusics/playDescription';

export default function FourMusicsMedia() {
    const fourmusics_player = css`
        display: flex;
        flex-direction: column;
        
        justify-content: space-between;
        box-shadow: 2px 2px 2px 4px rgba(100, 100, 100, 0.1);
    `;
    const PlayerContainer = styled.div`
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 10px;
    `;

    const [nowIndex, setNowIndex] = useState(0);
    const changeNowIndex = ({dir = 1}) => {
        setNowIndex((prev) => (prev + dir + mediaInfos.length) % mediaInfos.length);
    }

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => { setMounted(false);  }
    }, []);

    const index_change_button_style = css`
        position: absolute;
        width: 40%;
        height: ${mounted ? getPageSize().width * 0.7 + 'px' : 0};
        z-index: 11;
        top: 0%;
        cursor: pointer;
    `;
    const index_change_button_style_left = css`
        ${index_change_button_style};
        left: 0%;
    `;
    const index_change_button_style_right = css`
        ${index_change_button_style};
        right: 0%;
    `;

    return (
        mounted ?
            <div>
                <div css={fourmusics_player}>
                    <div style={{position: 'relative', width: '100%', height: '100%'}}>
                        <DiskCarousel 
                            mediaInfos={mediaInfos} 
                            nowIndex={nowIndex}
                            changeIndexEvent={changeNowIndex}
                        /> 
                        <div css={index_change_button_style_left}  onClick={() => changeNowIndex({dir: -1})}></div>
                        <div css={index_change_button_style_right} onClick={() => changeNowIndex({dir: 1})}></div>
                    </div>
                    <PlayerContainer>
                        <hr style={{margin: '0px'}} />
                        <h1 style={{margin: '0px' }}>
                            {mediaInfos[nowIndex].title}
                        </h1> 
                        <h4 style={{margin: '0px' }}>
                            {mediaInfos[nowIndex].date}
                        </h4>
                        <hr style={{margin: '0px'}} />
                        {/* <YoutubeList videoIds={mediaInfos[nowIndex].videos} 
                            imageWidth={getPageSize().width * 0.4}
                        /> */}
                    </PlayerContainer>

                    <PlayDescription videoIds={mediaInfos[nowIndex].videos} />
                </div>
            </div>
        : <></>
    )
}