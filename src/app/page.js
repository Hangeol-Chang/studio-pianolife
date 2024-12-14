'use client';
import Image from "next/image";
import { useEffect } from "react";
import getScrollProgress from "./api/client/getScrollProgress";

// css 분리 등의 작업 해야함.

export default function Home() {
    const updateScrollBar = () => {
        // scrollPosition, scrollPercent
        const scrollData = getScrollProgress();
    }
    
    useEffect(() => {
        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);
        return () => {
            window.removeEventListener('scroll', updateScrollBar);
            window.removeEventListener('resize', updateScrollBar);
        }
    })


    return (
        <div
            style={{
                overflow: "hidden",
                position: "relative",
                width: "100%",
            }}
        >
            {/* <Image src="/background/sunset-field.jpg" alt="field-bg" 
                width={2000} height={0} 
                layout="intrinsic"
                style={{
                    position: "absolute",
                    left: 0,    
                    scale: 2
                }}
            /> */}

            <Image src="/gallary/gallary_3_tp.png" alt="piano" 
                width={2000} height={0} 
                layout="intrinsic"
                style={{
                    position: "absolute",
                    top: '100px',
                    right: "-20%",
                    scale: 1.5,
                    // right:  "50%",
                    // transform: "translate(-50%, -50%)"
                }}
            /> 
            <div
                style={{
                    position: "absolute",
                    top: "100px",
                    left: "60px",
                    width: "100%",
                    height: "5px",
                }}
            >
                <h1>Gong Pira</h1>
                <h3> this is subtitle </h3>
                <p>
                    this is content
                    simple description
                </p>

            </div>
        </div>
    )
}