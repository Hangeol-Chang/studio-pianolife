'use client';

import { useEffect, useRef, useState } from "react";
import getScrollProgress from "../api/client/getScrollProgress";
import styled from '@emotion/styled';
import { Spacer } from "@/components/common/spacer";
import { Title1, Title2, Title3 } from "@/components/common/title";
import YoutubeCarousel from "@/components/media/youtubeCarousel";
import { YouTubeEmbed } from "@/components/media/youtubeMulti";
import { videoInfos } from "./videoInfos.json";
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
    font-family: 'LeferiPoint-SpecialItalicA';
    font-weight: normal;
    font-size: min(5vw, 50px);
    letter-spacing: min(1vw, 8px);
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
    text-shadow:
        4px 4px 2px rgba(50, 20, 21, 0.6);
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

export default function About() {
    const coverImageRef = useRef(null);
    const video_infos = videoInfos;

    return (
        <div>
            <CoverContainer>
                <MainImage path="/profile" name="jungwoo_profile.png"
                    ref={coverImageRef}
                    alt="piano" width={1000} height={0} layout="intrinsic"
                />
                <div>
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