'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import getScrollProgress from "../api/client/getScrollProgress";
import styles from './about.module.scss';
import { Spacer } from "@/components/common/spacer";
import { Title1, Title2, Title3 } from "@/components/common/title";

const YouTubeEmbed = ({ videoId, width, height }) => {
    return (
        <div 
            style={{width, height}}
        >
            <iframe
                width="100%"
                height="100%"
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default function About() {
    const coverImageRef = useRef(null);

    const [youtubeWidth, setYoutubeWidth] = useState(200);
    const [youtubeHeight, setYoutubeHeight] = useState(200);

    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
    }

    const resizeEvent = () => {
        const docWidth = document.documentElement.clientWidth;
        console.log(docWidth);

        setYoutubeWidth(docWidth * 0.9);
        setYoutubeHeight(docWidth * 0.5);
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
        resizeEvent();

        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);
        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('scroll', updateScrollBar);
            window.removeEventListener('resize', updateScrollBar);
            window.removeEventListener('resize', resizeEvent);
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
                    <h1 className={styles.cover_name_text}  // shadow
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
            <p>
                <br />
                유튜브 채널 '공피라-공대생의 piano life' 는 건축공학 전공으로 <br />
                졸업 후 직장 생활을 하며 피아노를 취미로 즐기는 회사원 입니다.
            </p>
            <Spacer height={100} />
            <Title2 title="About" subTitle={"유튜브 채널 공피라는 이런걸 해요"} />
            <p>
                <br /><br />
                📍피아노 연주 영상 업로드 : 개인 하드웨어로 쓰려 했던 채널이 어쩌다보니 다양해졌어요
                <br /><br />
                📍예술의 전당 대관을 위한 도전 : 아마추어 피아노 앙상블 포뮤직스 (포뮤직스 페이지 참고!)
                <br /><br />
                📍아마추어 인터뷰 : 본격 아마추어 음악인 인터뷰 '아마추어를 만나다'
                <br /><br />
                📍연주회 기획 : 아마추어 음악인들을 위한 무대 기획<br />
            </p>
            <div style={{paddingLeft: '1.5em'}}>
                <p>
                    🎹 24.02 '슈만, 시인은 말한다.'<br />
                    🎹 25.02 '쇼팽과 라벨'<br />
                    🎹 25.08 '아마추어를 만나다' (예정) <br />
                </p>
            </div>

            <Spacer height={100} />
            <Title2 title="연주영상" />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    // padding: '10px',
                    gap: '10px',
                    margin: '0 5vw',
                }}
            >
                <YouTubeEmbed videoId="vDs4sTqhmQg" width={youtubeWidth} height={youtubeHeight} />

                <div
                    style={{
                        display: 'flex',
                        width: '100%', height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 'px',
                    }}
                >
                    <YouTubeEmbed videoId="jkb3VdzEn2M" width={youtubeWidth/3*2} height={youtubeHeight/3*2 + 5} />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                    }}>
                        <YouTubeEmbed videoId="U9C5GZ-G69A" width={youtubeWidth/3} height={youtubeHeight/3} />
                        <YouTubeEmbed videoId="mXJeCx12igw" width={youtubeWidth/3} height={youtubeHeight/3} />
                    </div>

                </div>
                <YouTubeEmbed videoId="mXJeCx12igw" width={youtubeWidth/3} height={youtubeHeight/3} />
                <YouTubeEmbed videoId="mXJeCx12igw" width={youtubeWidth/3} height={youtubeHeight/3} />

            </div>
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