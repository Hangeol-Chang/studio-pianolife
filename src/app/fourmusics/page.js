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

    const posterImageList = [
        "/fourmusics/fourmusics_poster_1.jpg",
        "/fourmusics/fourmusics_poster_2.jpg",
        "/fourmusics/fourmusics_poster_3.jpg",
    ]
    let posterIndex = 0;
    
    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
    }

    const resizeEvent = () => {
        const docWidth = document.documentElement.clientWidth;
        setPosterWidth(docWidth * 0.8);
    }

    const changeToNextImage = (time) => {
        posterIndex = (posterIndex + 1) % posterImageList.length;
        setPosterSrc(posterImageList[posterIndex]);

        setTimeout(() => {
            changeToNextImage(time);
        }, time);
    }

    useEffect(() => {
        // const mainImage = document.querySelector(`.${styles.main_image}`);
        // mainImage.addEventListener('animationend', () => {
        //     mainImage.style.animation = 'none'; 
        // });
        resizeEvent();


        const iamgeChangetTime = 4000;
        setTimeout(() => {
            changeToNextImage(iamgeChangetTime);
        }, iamgeChangetTime);   // 4초 뒤에 실행

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

            <Image className={styles.main_image}
                src={posterSrc} alt="piano" 
                layout="intrinsic"
                width={0}height={0} sizes="80vw"
                style={{ 
                    width: "80%", height: "auto", 
                    margin: "auto",
                    display: "block",
                }}
            />
        </div>
    )
}