'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './youtubeCarousel2.module.scss'
import getPageSize from '@/app/api/client/getPageSize';
import { YouTubeEmbed } from './youtube';

export default function YoutubeCarousel2({ videoIds, videoWidth, changeInterval }) {
    // check mountecd
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { 
        setIsMounted(true); 
        return () => { setIsMounted(false);  }
    }, []);


    const [videoContainerWidth, setImageContainerWidth] = useState(1000);

    const [videoIndex, setImageIndex] = useState(0);
    const videoRefs = useRef([]);
    const videoContainerRef = useRef(null);

    useEffect(() => {
        const pageSize = getPageSize();
        setImageContainerWidth(
            pageSize.width * 0.4 * videoIds.length 
            + 20 * (videoIds.length - 1)
        );
    }, [videoWidth])

    
    useEffect(() => {
        const pageWidth = getPageSize().width;
        const containerX = 
            0.5*pageWidth - (videoIndex-0.5) * videoWidth

        videoContainerRef.current.style.left = `${containerX}px`;

        videoRefs.current.forEach((element, index) => {
            console.log("element", element, index, videoIndex);
            if (index == videoIndex) {
                console.log("add", index, element);
                element.classList.add(styles.video_main);
            }
            else {
                element.classList.remove(styles.video_main);
            }
        });
        setTimeout(() => changevideoIndex(), changeInterval);
    }, [videoIndex]);

    const changevideoIndex = () => {
        setImageIndex((videoIndex + 1) % videoIds.length);
    }

    // 최초 1회 로딩될 때 수동으로 지정해줘야 함.
    useEffect(() => {
        console.log(videoIds);
        if(isMounted) videoRefs.current[0].classList.add(styles.video_main);
    }, [isMounted]);

    return(
        <div
            className={styles.carousel_container}
            ref={videoContainerRef}
            style={{
                width: `${videoContainerWidth}px`,
                height: `${videoWidth}px`,
            }}
        >
            {
                isMounted ? 
                    videoIds.map((id, index) => (
                        <div key={id}
                            ref={(el) => videoRefs.current[index] = el}
                            className={styles.video}
                        >
                            <YouTubeEmbed videoId={id}  width={videoWidth}/>
                        </div>
                    ))
                : null
            }
        </div>
    )
}