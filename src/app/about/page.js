'use client';

import Image from "next/image";
import { useEffect, useRef } from "react";
import getScrollProgress from "../api/client/getScrollProgress";
import styles from './about.module.scss';

export default function About() {
    const coverImageRef = useRef(null);

    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
    }

    const mainImageControl = (scrollData) => {
        const mainImage = document.querySelector(`.${styles.main_image}`);
        mainImage.style.right = `${-scrollData.scrollPosition * 40 / 1000 - 20}%`;
    }

    useEffect(() => {
        const mainImage = document.querySelector(`.${styles.main_image}`);
        console.log(mainImage);
        mainImage.addEventListener('animationend', () => {
            mainImage.style.animation = 'none'; 
        });

        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);
        return () => {
            window.removeEventListener('scroll', updateScrollBar);
            window.removeEventListener('resize', updateScrollBar);
        }

    }, []);

    /*
    // 배경색 
    f1dddf
    f2dfe1

    */

    return (
        <div>
            <div className={styles.cover_container}>
                <Image ref={coverImageRef} className={styles.main_image}
                    src="/profile/jungwoo_profile.jpg" alt="piano" 
                    width={1000} height={0} layout="intrinsic"
                />

                <div>
                    <h1 className={styles.cover_name_text}>
                        Go Jung Woo
                    </h1>
                </div>
            </div>
        </div>
    );
}