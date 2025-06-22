'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import getScrollProgress from "../api/client/getScrollProgress";
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Spacer } from "@/components/common/spacer";
import { Title1, Title2, Title3 } from "@/components/common/title";
import YoutubeCarousel from "@/components/media/youtubeCarousel";
import { YouTubeEmbed } from "@/components/media/youtubeMulti";
import { videoInfos } from "./videoInfos.json";
import getSizedImage from "../api/client/getSizedImage";
import ResponsiveImage from "@/components/layout/responsiveImaage";

const CoverContainer = styled.div`
    position: relative;
    width: 100%;
    height: min(120vw, 900px);
    overflow: hidden;
    background: linear-gradient(30deg, #e6bec2 10%, #f1dddf 30%, #f2dfe1 90%);
    background-color: black;
`;

const CoverNameText = styled.h1`
    width: 100%;
    align-items: center;
    text-align: center;
    font-family: 'Cafe24Lovingu';
    font-weight: normal;
    font-size: min(5vw, 60px);
    letter-spacing: min(2vw, 20px);
    color: white;
    margin: auto;
    left: 50%;
    bottom: 10%;
    position: absolute;
    z-index: 10;
    transform: translate(-50%, 0);
    animation: cover-name-init-slide 1s ease-in-out forwards;
    @keyframes cover-name-init-slide {
        from {
            bottom: 20%;
            opacity: 0;
        }
        to {
            bottom: 10%;
            opacity: 1;
        }
    }
`;

const CoverNameTextShadow = styled(CoverNameText)`
    color: rgba(50, 20, 21, 0.3);
    padding-left: 8px;
    padding-bottom: -10px;
    font-weight: 900;
    text-shadow:
        // 0 0px 6px rgba(50,20,21,0.25),
        // 0 0 2px rgba(50,20,21,0.5),
        // 2px 0 0 rgba(50,20,21,0.5),
        // -2px 0 0 rgba(50,20,21,0.5),
        0 2px 0 rgba(50,20,21,0.3),
        0 -2px 0 rgba(50,20,21,0.3);
`;

const MainImage = styled(ResponsiveImage)`
    position: absolute;
    left: 50%;
    bottom: 0%;
    scale: 1;
    transform: translate(-50%, 0);
    animation: image-init-slide 1s ease-in-out forwards;
    z-index: 0;
    width: 70%;
    height: auto;
    mask-image:
        linear-gradient(to right, transparent 0%, black 10%, black 80%, transparent 100%),
        linear-gradient(to left,  transparent 0%, black 10%, black 80%, transparent 100%);

    @keyframes image-init-slide {
        from {
            bottom: -40%;
            opacity: 0;
        }
        to {
            bottom: 0%;
            opacity: 1;
        }
    }
`;

const YoutubeV1 = ({youtubeWidth, youtubeHeight}) => {
    return (
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
            <YouTubeEmbed videoId="kYHdmaMZmwo" width={youtubeWidth/3} height={youtubeHeight/3} />
            <YouTubeEmbed videoId="mja0TKqjtWk" width={youtubeWidth/3} height={youtubeHeight/3} />

        </div>
    )
}


export default function About() {
    const coverImageRef = useRef(null);

    const [youtubeWidth, setYoutubeWidth] = useState(200);
    const [youtubeHeight, setYoutubeHeight] = useState(200);

    const video_infos = videoInfos;

    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
    }

    const resizeEvent = () => {
        const docWidth = document.documentElement.clientWidth;

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
            <CoverContainer>
                <MainImage path="/profile" name="jungwoo_profile.png"
                    ref={coverImageRef}
                    alt="piano" width={1000} height={0} layout="intrinsic"
                />
                <div>
                    <CoverNameTextShadow>
                        Studio Piano Life
                    </CoverNameTextShadow>
                    <CoverNameText>
                        Studio Piano Life
                    </CoverNameText>
                </div>
            </CoverContainer>

            <Spacer height={50} />
            <Title1 title={"공 피 라"} subTitle={"고정우"} />
            <p>
                유튜브 채널 &rsquo;공피라-공대생의 piano life&rsquo; 는 건축공학 전공으로 <br />
                졸업 후 직장 생활을 하며 피아노를 취미로 즐기는 회사원 입니다.
            </p>
            <Spacer height={40} />
            <Title2 title="About" subTitle={"유튜브 채널 공피라는 이런걸 해요"} />
            <p>
            📍피아노 연주 영상 업로드 : 개인 하드웨어로 쓰려 했던 채널이 어쩌다보니 다양해졌어요
            </p>
            <p>
                📍예술의 전당 대관을 위한 도전 : 아마추어 피아노 앙상블 포뮤직스 (포뮤직스 페이지 참고!)
            </p>
            <p>
                📍아마추어 인터뷰 : 본격 아마추어 음악인 인터뷰 &rsquo;아마추어를 만나다&rsquo;
            </p>
            <p>
                📍연주회 기획 : 아마추어 음악인들을 위한 무대 기획<br />
            </p>
            <div style={{paddingLeft: '1.5em'}}>
                <p>
                    🎹 24.02 &rsquo;슈만, 시인은 말한다.&rsquo;<br />
                    🎹 25.02 &rsquo;쇼팽과 라벨&rsquo;<br />
                    🎹 25.08 &rsquo;아마추어를 만나다&rsquo; (예정)<br />
                </p>
            </div>

            <Spacer height={100} />
            <Title2 title="연주영상" />
            
            <Spacer height={30} />
            <YoutubeCarousel videoInfos={video_infos} />
                
            <Spacer height={50} />
        </div>
    );
}