'use client';
/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import styles from './fourmusicsPlayer.module.scss'
import DiskCarousel from '../layout/diskCarousel';
import getPageSize from '@/app/api/client/getPageSize';
import YoutubeCarousel2 from '../media/youtubeCarousel2';

import { css } from '@emotion/react';

export default function FourMusicsPlayer({ mediaInfos, changeInterval }) {
    const fourmusics_player = css`
        display: flex;
        justify-content: space-between;
    `;
    
    const [nowIndex, setNowIndex] = useState(0);

    useEffect(() => {
        // wait 1s
        setTimeout(() => {
            setNowIndex((nowIndex + 1) % mediaInfos.length);
        }, changeInterval);
        console.log(nowIndex);

    }, [nowIndex]);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => { setIsMounted(false);  }
    }, []);

    return (
        mounted ?
            <div css={fourmusics_player}>
                <DiskCarousel 
                    mediaInfos={mediaInfos} 
                    imageSize={getPageSize().width * 0.15} 
                    nowIndex={nowIndex}
                />
                <YoutubeCarousel2 
                    videoIds={mediaInfos[0].videos}
                    videoWidth={getPageSize().width * 0.3}
                    changeInterval={3000}
                />
            </div>
        : <></>
    )
}