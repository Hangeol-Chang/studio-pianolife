'use client';

import Image from "next/image";
import { useEffect, useRef } from "react";
import getScrollProgress from "../api/client/getScrollProgress";
import styles from './about.module.scss';
import { Spacer } from "@/components/common/spacer";
import { Title1, Title2, Title3 } from "@/components/common/title";

export default function About() {
    const coverImageRef = useRef(null);

    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
    }

    const mainImageControl = (scrollData) => {
        // const mainImage = document.querySelector(`.${styles.main_image}`);
        // mainImage.style.right = `${-scrollData.scrollPosition * 40 / 1000 - 20}%`;
    }

    useEffect(() => {
        // const mainImage = document.querySelector(`.${styles.main_image}`);
        // mainImage.addEventListener('animationend', () => {
        //     mainImage.style.animation = 'none'; 
        // });

        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);
        return () => {
            window.removeEventListener('scroll', updateScrollBar);
            window.removeEventListener('resize', updateScrollBar);
        }

    }, []);

    return (
        <div>
            <div className={styles.cover_container}>
                <Image ref={coverImageRef} className={styles.main_image}
                    src="/profile/jungwoo_profile.jpg" alt="piano" 
                    width={1000} height={0} layout="intrinsic"
                />

                <div>
                    <h1 className={styles.cover_name_text}
                        style={{
                            paddingLeft: '8px',
                            paddingBottom: '-10px',
                            color: 'rgba(50, 20, 21, 0.5)',
                        }}
                    >
                        Go Jung Woo
                    </h1>
                    <h1 className={styles.cover_name_text}>
                        Go Jung Woo
                    </h1>
                </div>
            </div>

            <Spacer height={50} />
            <Title1 title={"공 피 라"} subTitle={"고정우"} />
            <Spacer height={100} />
            <Title2 title="About" />
            
            <Title3 title="학업" />
            <Title3 title="경력" />
            <Title3 title="??" />

            <Spacer height={100} />
            <Title2 title="연주영상" />

            <Spacer height={100} />
            <Title2 title="p.s " />


            <div
                style={{
                    height: '100vh',
                    backgroundColor: 'grey',
                    margin: '50px',
                    padding:'20px',
                }}
            >
                이것은 스크롤 더미입니다.   
            </div>
        </div>
    );
}