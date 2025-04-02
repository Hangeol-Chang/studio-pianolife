'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './fourmusicsPlayer.module.scss'
import DiskCarousel from '../layout/diskCarousel';
import getPageSize from '@/app/api/client/getPageSize';

export default function FourMusicsPlayer({ mediaInfos, changeInterval }) {
    const [nowIndex, setNowIndex] = useState(0);
    useEffect(() => {

    })

    return (
        <div>
            <DiskCarousel 
                mediaInfos={mediaInfos} 
                imageSize={getPageSize().width * 0.15} 
                nowIndex={nowIndex}
            />
        </div>
    )
}