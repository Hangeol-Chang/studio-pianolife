'use client';
import { useEffect } from "react";
import About from "./about/page";

export default function Home() {
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
            {/* <Carousel /> */}
        </div>
    )
}