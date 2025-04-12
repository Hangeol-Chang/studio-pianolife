'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './fourmusicsPlayer.module.scss'
import DiskCarousel from '../layout/diskCarousel';
import getPageSize from '@/app/api/client/getPageSize';
import YoutubeCarousel2 from '../media/youtubeCarousel2';

export default function FourMusicsPlayer({ mediaInfos, changeInterval }) {
    const [nowIndex, setNowIndex] = useState(0);
    useEffect(() => {

    })

    return (
        <div
            
        >
            <DiskCarousel 
                mediaInfos={mediaInfos} 
                imageSize={getPageSize().width * 0.15} 
                nowIndex={nowIndex}
            />
            {/* <YoutubeCarousel2 
                videoIds={mediaInfos[0].videos}
                videoWidth={getPageSize().width * 0.3}
                changeInterval={3000}
            /> */}
        </div>
    )
}