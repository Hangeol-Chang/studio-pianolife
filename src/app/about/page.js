'use client';

import Image from "next/image";
import { useEffect } from "react";

export default function About() {
    const updateScrollBar = () => {
        // scrollPosition, scrollPercent
        const scrollData = getScrollProgress();
        mainTextControl(scrollData);
    }

    mainImageControl(scrollData);

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

    return (
        <div>
            <h1>About</h1>
            <p>This is the about page.</p>
            <Image className={'main-image'}
                src="/gallary/gallary_3_tp.png" alt="piano" 
                width={2000} height={0} 
                layout="intrinsic"
            />
        </div>
    );
}