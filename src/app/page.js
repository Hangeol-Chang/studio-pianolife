'use client';
import Image from "next/image";
import { useEffect } from "react";
import getScrollProgress from "./api/client/getScrollProgress";

// css 분리 등의 작업 해야함.

export default function Home() {

    const controlBackgroundColor = () => {

    }

    const updateScrollBar = () => {
        // scrollPosition, scrollPercent
        const scrollData = getScrollProgress();
        mainImageControl(scrollData);
        mainTextControl(scrollData);
    }

    const mainImageControl = (scrollData) => {
        document.querySelector('.main-image').style.right = `${-scrollData.scrollPosition * 40 / 1000 - 20}%`;

    }
    const mainTextControl = (scrollData) => {
        // document.querySelector('.main-text').style
    }
    
    useEffect(() => {
        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);
        return () => {
            window.removeEventListener('scroll', updateScrollBar);
            window.removeEventListener('resize', updateScrollBar);
        }
    }, [])


    return (
        <div>
            <div
                style={{
                    height: '1000px',
                    
                }}
            >
                <Image src="/gallary/gallary_3_tp.png" alt="piano" 
                    width={2000} height={0} 
                    layout="intrinsic"
                    className={'main-image'}

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
                        width: '200px',
                        height: "5px",
                        scale : 1.2,
                    }}
                >
                    <h1>공 피 라</h1>
                    <h3>공대생의 Piano Life </h3>
                    <p>
                        this is content
                        <br></br>
                        simple description
                    </p>

            </div>

            </div>
                <hr>
                </hr>
        </div>
    )
}