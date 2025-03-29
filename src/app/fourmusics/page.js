'use client';

import { Spacer } from "@/components/common/spacer";
import { Title1, Title2 } from "@/components/common/title";
import Image from "next/image";
import styles from "./fourmusics.module.scss";
import { useEffect, useRef, useState } from "react";
import getScrollProgress from "../api/client/getScrollProgress";
import getPageSize from "../api/client/getPageSize";

export default function FourMusics() {
    const [posterWidth, setPosterWidth] = useState(300);
    const [posterContainerWidth, setPosterContainerWidth] = useState(1000);

    const [posterIndex, setPosterIndex] = useState(0);
    const posterRefs = useRef([]);
    const posterContainerRef = useRef(null);
    const posterImageList = [
        "/fourmusics/fourmusics_poster_1.jpg",
        "/fourmusics/fourmusics_poster_2.jpg",
        "/fourmusics/fourmusics_poster_3.jpg"
    ]
    
    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
    }
    const resizeEvent = () => {
        const pageSize = getPageSize();
        setPosterWidth(pageSize.width * 0.4);
    }

    useEffect(() => {
        const pageSize = getPageSize();
        setPosterContainerWidth(pageSize.width * 0.4 * posterImageList.length + 20 * (posterImageList.length - 1));
    }, [posterWidth])

    useEffect(() => {        
        const docWidth = document.documentElement.clientWidth;
        const containerX = 0.5*getPageSize().width -(posterIndex+0.5) *posterWidth - (posterImageList.length-1) * 10;
        console.log(containerX)
        posterContainerRef.current.style.left = `${containerX}px`;
        posterRefs.current.forEach((element, index) => {
            if (index == posterIndex) {
                element.classList.add(styles.poster_image_main);
            }
            else {
                element.classList.remove(styles.poster_image_main);
            }
        });
        setTimeout(() => changePosterIndex(), 5000);
    }, [posterIndex]);

    const changePosterIndex = () => {
        setPosterIndex((posterIndex + 1) % posterImageList.length);
    }

    useEffect(() => {
        // setTimeout(() => changePosterIndex(), 0);   // 초기화 후 5초마다 실행.

        resizeEvent();

        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);
        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('scroll', updateScrollBar);
            window.removeEventListener('resize', updateScrollBar);
            window.removeEventListener('resize', resizeEvent);
        }
    }, []);

    return (
        <div>
            <Spacer height={20} />
            <Title1 title="포뮤직스" subTitle="Four Musics" />

            <Spacer height={20} />
            <Title2 title="Concerts" />

            <div 
                className={styles.poster_container}
                ref={posterContainerRef}
                style={{
                    width: `${posterContainerWidth}px`,
                    height: `${posterWidth*2.2}px`,
                }}
            >
                {
                    posterImageList.map((src, index) => (
                        <Image className={styles.poster_image}
                            key={src+index}
                            ref={(el) => posterRefs.current[index] = el} // 각 iframe에 ref 할당
                            src={src} alt="piano" 
                            width={posterWidth} height={0} layout="intrinsic"
                        />
                    ))
                }
            </div>
        </div>
    )
}