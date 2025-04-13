'use client';
/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react';
import styles from './youtubeCarousel2.module.scss'
import getPageSize from '@/app/api/client/getPageSize';
import { YouTubeEmbed } from './youtube';
import { css } from '@emotion/react';

export default function YoutubeCarousel2({ videoIds, videoWidth, changeInterval }) {

    const carousel_container_style = css`
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        
        padding: 0;
        transition: all 0.7s ease-in-out;
        scroll-padding: 0;
    `;
    
    const video_style = css`
        position: relative;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        animation: all 0.7s ease-in-out;
        transition: all 0.7s ease-in-out;    
        filter: brightness(0.8);
        opacity: 0.4;
        z-index: 2;

        :hover {
            transform: scale(1.1);
        }
    `;

    const video_main_style = css`
        right: 0%;
        border-radius: 4px;
        z-index: 10;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transform: scale(1.4);
        filter: brightness(1);
        opacity: 1;

        .:hover {
            transform: scale(1.5);
        }
    `;

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
            if (index == videoIndex) {
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
                        <div 
                            ref={(el) => videoRefs.current[index] = el}
                            className={styles.video}
                            key={id + index}
                        >
                            <YouTubeEmbed videoId={id}  width={videoWidth}/>
                        </div>
                    ))
                : null
            }
        </div>
    )
}