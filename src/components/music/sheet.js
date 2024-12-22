'use client';

import getScrollProgress from "@/app/api/client/getScrollProgress";
import Image from "next/image";
import { useEffect, useState } from "react";

const VerticalLineSingle = ({left, top}) => {
    return (
        <div className={'vertical-line-single'}
            style={{
                left: left,
                top: top,
            }}
        />
    )
}


const Note = ({index, width, left, top, flip = false}) => {
    // var randInt = Math.floor(Math.random() * 100);
    const filename = index < 10 ? '0' + index : index.toString();    
    const [topPos, setTopPos] = useState(top);
    const [rot, setRot] = useState(flip ? 180 : 0);
    let scrollConst = 1;
    let rotConst = 1;

    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
        
        if(scrollData.scrollPosition < 0) {
            setTopPos(top);
            setRot(flip ? 180 : 0);
        }
        else {
            setTopPos(top + (scrollData.scrollPosition - 0) * scrollConst);
            setRot( (flip ? 180 : 0) + (scrollData.scrollPosition - 0)/20 * rotConst);
        }
        // document.querySelector('.note').style.top = `${scrollData.scrollPosition * width + 100}px`;
        // console.log(index, scrollData.scrollPosition * width + 100);
    }

    useEffect(() => {
        // 스크롤 상수 지정.
        scrollConst =  Math.floor((Math.random() * 1 - 0.3)*10)/10;
        rotConst =  Math.floor((Math.random() * 1 - 0.5)*10)/10;

        window.addEventListener('scroll', () => updateScrollBar());
        window.addEventListener('resize', () => updateScrollBar());
        return () => {
            window.removeEventListener('scroll', () => updateScrollBar());
            window.removeEventListener('resize', () => updateScrollBar());
        }
    }, []);

    return (
        <div className={'note'}>
            <Image src={`/note/note_${filename}.png`} alt="note" 
                width={width} height={0} layout="intrinsic"

                style={{
                    position: 'absolute',
                    left: left,
                    top: topPos,
                    transform: `rotate(${rot}deg)`,
                }}
            />
        </div>
    )
}

export {
    Note,
    VerticalLineSingle,
}