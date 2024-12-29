'use client';

import getScrollProgress from "@/app/api/client/getScrollProgress";
import Image from "next/image";
import { useEffect, useReducer, useRef, useState } from "react";
import styles from './sheet.module.scss';

const Note = ({index, width, left, top, flip = false}) => {
    // var randInt = Math.floor(Math.random() * 100);
    const filename = index < 10 ? '0' + index : index.toString();
    const [topPos, setTopPos] = useState(top);
    const [rot, setRot] = useState(flip ? 180 : 0);
    const ref = useRef(null);

    let scrollConst = 1;
    let rotConst = 1;

    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
        
        if(ref.current) {
            let yPos = ref.current.getBoundingClientRect().top - 300;
            if(yPos < 0) yPos = 0;
            if(scrollData.scrollPosition < yPos) {
                setTopPos(top);
                setRot(flip ? 180 : 0);
            }
            else {
                setTopPos(top + (scrollData.scrollPosition - yPos) * scrollConst);
                setRot( (flip ? 180 : 0) + (scrollData.scrollPosition - yPos)/20 * rotConst);
            }
        }
    }

    useEffect(() => {
        // yPosition 세팅.

        // 스크롤 상수 지정.
        scrollConst =  Math.floor((Math.random() * 1 - 0.3)*6)/10;
        rotConst =  Math.floor((Math.random() * 1 - 0.5)*10)/10;

        window.addEventListener('scroll', () => updateScrollBar());
        window.addEventListener('resize', () => updateScrollBar());
        return () => {
            window.removeEventListener('scroll', () => updateScrollBar());
            window.removeEventListener('resize', () => updateScrollBar());
        }
    }, []);

    return (
        <div ref={ref} className={styles.note}>
            <Image src={`/note/note_${filename}.png`} alt="note" 
                width={width} height={0} layout="intrinsic"

                style={{
                    position: 'absolute',
                    left: left,
                    top: topPos,
                    transform: `rotate(${rot}deg)`,
                    zIndex: 10,
                }}
            />
        </div>
    )
}

const VerticalLineSingle = ({left, top}) => {
    return (
        <div className={styles.vertical_line_single}
            style={{
                left: left,
                top: top,
            }}
        />
    )
}

const MusicSheet = () => {
    return (
        <div className={styles.music_sheet}
            style={{
                position: "relative",
                width: '100%',
                height: '70px',
            }}
        >
            <hr className={styles.music_sheet_line}/>
            <hr className={styles.music_sheet_line}/>
            <hr className={styles.music_sheet_line}/>
            <hr className={styles.music_sheet_line}/>
            <hr className={styles.music_sheet_line}/>
        </div>
    )
}

const VerticalLine = ({left, top}) => { // 지울 코드
    return (
        <div className={styles.vertical_line}
            style={{ left: left, top: top,}}
        />
    )
}

export {
    MusicSheet,
    Note,
    VerticalLineSingle,
    VerticalLine,
}