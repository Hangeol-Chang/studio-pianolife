'use client';

import Image from "next/image";
import { useEffect } from "react";
import getScrollProgress from "../api/client/getScrollProgress";

export default function About() {
    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
        mainTextControl(scrollData);
    }

    const mainImageControl = (scrollData) => {
        const mainImage = document.querySelector('.main-image');
        mainImage.style.right = `${-scrollData.scrollPosition * 40 / 1000 - 20}%`;
    }

    useEffect(() => {
        const mainImage = document.querySelector('.main-image');
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
            <h1>About</h1>
            <p>This is the about page.</p>
            <Image className={'main-image'}
                src="/profile/jungwoo_profile.jpg" alt="piano" 
                width={500} height={0}
                layout="intrinsic"
            />
        </div>
    );
}