'use client';

import { Spacer } from "@/components/common/spacer";
import { Title1, Title2 } from "@/components/common/title";
import Image from "next/image";
import styles from "./fourmusics.module.scss";
import { useEffect, useRef, useState } from "react";
import getScrollProgress from "../api/client/getScrollProgress";

export default function FourMusics() {
    const [posterWidth, setPosterWidth] = useState(300);
    const [posterSrc, setPosterSrc] = useState("/fourmusics/fourmusics_poster_1.jpg");

    const [posterIndex, setPosterIndex] = useState(0);
    const posterRefs = useRef([]);
    const posterContainerRef = useRef(null);
    const posterImageList = [
        "/fourmusics/fourmusics_poster_1.jpg",
        "/fourmusics/fourmusics_poster_2.jpg",
        "/fourmusics/fourmusics_poster_3.jpg",
    ]
    
    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
    }

    const resizeEvent = () => {
        const docWidth = document.documentElement.clientWidth;
        setPosterWidth(docWidth * 0.8);
    }

    useEffect(() => {
        const leftPosterIndex = posterIndex - 1 < 0 ? posterImageList.length - 1 : posterIndex - 1;
        const rightPosterIndex = posterIndex + 1 >= posterImageList.length ? 0 : posterIndex + 1;
        
        const containerX = (posterIndex-1) * -250;
        console.log("containerX", containerX, posterWidth, posterIndex);
        posterContainerRef.current.style.left = `${containerX}px`;
        posterRefs.current.forEach((element, index) => {
            if (index == posterIndex) {
                element.classList.add(styles.poster_image_main);
            }
            else {
                element.classList.remove(styles.poster_image_main);
            }
        });
        setTimeout(() => changePosterIndex(), 2000);
    }, [posterIndex]);

    const changePosterIndex = () => {
        console.log("change poster index", posterIndex, (posterIndex + 1) % posterImageList.length);
        setPosterIndex((posterIndex + 1) % posterImageList.length);
    }

    useEffect(() => {
        setTimeout(() => changePosterIndex(), 0);   // 초기화 후 5초마다 실행.

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
            >
                {
                    posterImageList.map((src, index) => (
                        <Image className={styles.poster_image}
                            key={src+index}
                            ref={(el) => posterRefs.current[index] = el} // 각 iframe에 ref 할당
                            src={src} alt="piano" 
                            width={0} height={0} sizes="80vw" layout="intrinsic"
                        />
                    ))
                }
            </div>

            {/* <Image className={styles.main_image}
                src={posterSrc} alt="piano" 
                layout="intrinsic"
                width={0}height={0} sizes="80vw"
                style={{ 
                    width: "80%", height: "auto", 
                    margin: "auto",
                    display: "block",
                }}
            /> */}
        </div>
    )
}