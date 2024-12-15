'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import getScrollProgress from "./api/client/getScrollProgress";
import '@/styles/common/musicsheet.scss'
import '@/styles/pages/mainpage.scss'

// css 분리 등의 작업 해야함.

const MusicSheet = () => {
    return (
        <div className={'music-sheet'}
            style={{
                position: "relative",
                width: '100%',
                height: '70px',
            }}
        >
            <hr className={'music-sheet-line'}/>
            <hr className={'music-sheet-line'}/>
            <hr className={'music-sheet-line'}/>
            <hr className={'music-sheet-line'}/>
            <hr className={'music-sheet-line'}/>
        </div>
    )
}

const VerticalLine = ({left, top}) => {
    return (
        <div className={'vertical-line'}
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
        
        if(scrollData.scrollPosition < 200) {
            setTopPos(top);
            setRot(flip ? 180 : 0);
        }
        else {
            setTopPos(top + (scrollData.scrollPosition - 200) * scrollConst);
            setRot( (flip ? 180 : 0) + (scrollData.scrollPosition - 200)/20 * rotConst);
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

export default function Home() {

    const updateScrollBar = () => {
        // scrollPosition, scrollPercent
        const scrollData = getScrollProgress();
        mainImageControl(scrollData);
        mainTextControl(scrollData);
    }

    const mainImageControl = (scrollData) => {
        const mainImage = document.querySelector('.main-image');
        mainImage.style.right = `${-scrollData.scrollPosition * 40 / 1000 - 20}%`;
    }
    const mainTextControl = (scrollData) => {
        document.querySelector('.main-text').style.top = `${scrollData.scrollPosition * 40 / 70 + 100}px`;
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

    }, [])


    return (
        <div>
            <div
                style={{
                    height: '125vw',
                    minHeight: 650,
                    maxHeight: 900,
                }}
            >
                <Image className={'main-image'}
                    src="/gallary/gallary_3_tp.png" alt="piano" 
                    width={2000} height={0} 
                    layout="intrinsic"
                /> 
                <div className={'main-text'}>
                    <h1>공 피 라</h1>
                    <h3>공대생의 Piano Life </h3>
                    <p>
                        this is content
                        <br></br>
                        simple description
                    </p>

                </div> 


            </div>
            
            <div className={'music-sheet-container'}>
                <MusicSheet />
                
                <Note index={21} width={25} left={10} top={20} />
                <Note index={7} width={28} left={60} top={35} />
                <VerticalLine left={110} top={25} />

                <Note index={1} width={17} left={130} top={26} />
                <Note index={3} width={28} left={200} top={24} />
                <Note index={14} width={70} left={240} top={15} />
                <VerticalLine calLine left={330} top={25} />
                
                <Note index={10} width={40} left={350} top={-4} />
                <Note index={23} width={13} left={350} top={56} />
                <Note index={1} width={17} left={400} top={-16} />
                <Note index={1} width={17} left={400} top={62} flip={true} />
                <Note index={10} width={40} left={490} top={-16} />
                <VerticalLine left={550} top={25} />
                
                <Note index={10} width={40} left={570} top={-4} />
                <Note index={2} width={17} left={570} top={62} flip={true} />
                <Note index={10} width={40} left={630} top={14} />
                <Note index={1} width={17} left={628} top={68} flip={true} />
                <Note index={10} width={40} left={690} top={3} />
                <Note index={10} width={40} left={750} top={20} />
                <Note index={7} width={28} left={745} top={80} flip={true} />


            </div>


            <div className={'description-container'}
                style={{
                    height: '3000px',
                    backgroundColor: '#DDDDDD',
                }}
            >
                <div
                    style={{
                        padding: '20px',
                    }}
                >
                    스크롤 테스트를 위한 더미입니다.
                </div>
            </div>
        </div>
    )
}