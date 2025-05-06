'use client';
/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import DiskCarousel from './diskCarousel';
import getPageSize from '@/app/api/client/getPageSize';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import YoutubeList from './youtubeLists';

export default function FourMusicsPlayer({ mediaInfos, changeInterval }) {
    const fourmusics_player = css`
        display: flex;
        flex-direction: column;
        
        justify-content: space-between;
        box-shadow: 2px 2px 2px 4px rgba(100, 100, 100, 0.1);
        margin: 20px 0px;
    `;
    const PlayerContainer = styled.div`
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 10px;
        width: 70%;
    `;
    
    const [nowIndex, setNowIndex] = useState(0);
    useEffect(() => {
        // setTimeout(() => changeNowIndex(), 5000);
    }, [nowIndex]);
    const changeNowIndex = () => {
        setNowIndex((prev) => (prev + 1) % mediaInfos.length);
    }

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => { setMounted(false);  }
    }, []);

    return (
        mounted ?
            <>
                <div css={fourmusics_player}>
                    <DiskCarousel 
                        mediaInfos={mediaInfos} 
                        imageSize={getPageSize().width * 0.15} 
                        nowIndex={nowIndex}
                        changeIndexEvent={changeNowIndex}
                    />
                    <PlayerContainer>
                        <hr style={{margin: '0px'}} />
                        <h3 style={{margin: '0px' }}>
                            {mediaInfos[nowIndex].title}
                        </h3> 
                        <div>
                            {mediaInfos[nowIndex].date}
                        </div>
                        <hr style={{margin: '0px'}} />
                        {/* <YoutubeList videoIds={mediaInfos[nowIndex].videos} 
                            imageWidth={getPageSize().width * 0.4}
                        /> */}
                    </PlayerContainer>
                </div>
            </>
        : <></>
    )
}