'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import './page.module.scss';
import { Title1, Title2 } from "@/components/common/title";
import Carousel from "@/components/layout/carousel";
import { Spacer } from "@/components/common/spacer";
import About from "./about/page";

export default function Home() {

    // const updateScrollBar = () => {
    //     // scrollPosition, scrollPercent
    //     const scrollData = getScrollProgress();
    // }
    
    useEffect(() => {
        // window.addEventListener('scroll', updateScrollBar);
        // window.addEventListener('resize', updateScrollBar);
        // return () => {
        //     window.removeEventListener('scroll', updateScrollBar);
        //     window.removeEventListener('resize', updateScrollBar);
        // }

    }, [])


    return (
        <div>
            <About />

            <Carousel />
        </div>
    )
}