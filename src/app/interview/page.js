'use client';
/** @jsxImportSource @emotion/react */

import { Title1, Title2 } from '@/components/common/title';
import { YouTubeEmbed } from '@/components/media/youtubeMulti';
import { useState, useEffect, useRef } from 'react';
import { Spacer } from '@/components/common/spacer';
import { css } from '@emotion/react';
import PianoIndex from '@/components/interview/pianoIndex';
import styled from '@emotion/styled';

// raw data import
import { interview as interviewData } from './interview.json';
import YoutubePlayer from '@/components/media/youtubeSingle';
import getScrollProgress from '../api/client/getScrollProgress';

const YoutubeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 5%;
`;
const InterviewContainer = styled.div`
    width: 100%;
`;
const DescriptionContainer = styled.p`
    min-height: 100px;
`;
const PullProgressBar = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-bottom: 12px;
    min-height: 48px;
    pointer-events: none;
    visibility: ${({ isPulling }) => (isPulling ? 'visible' : 'hidden')};
`;
const NavButtonBar = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 32px;
    margin-top: 40px;
    margin-bottom: 24px;
`;
const NavButton = styled.button`
    background: #fff;
    border: 2px solid #e6bec2;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #e6bec2;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    cursor: pointer;
    opacity: 0.9;
    transition: background 0.2s;
    &:hover {
        background: #f1dddf;
    }
`;

export default function Interview() {
    const [nowIndex, setNowIndex] = useState(1);
    const [pullDistance, setPullDistance] = useState(0);
    const [isPulling, setIsPulling] = useState(false);
    const pullThreshold = 80; // px
    const barSize = 48; // px, circle diameter
    const barStroke = 6;
    const barRadius = (barSize - barStroke) / 2;
    const barCircum = 2 * Math.PI * barRadius;
    const scrollContainerRef = useRef(null);
    const startYRef = useRef(null);
    const isTouchingRef = useRef(false);

    // 인덱스 변경 함수
    const setNowIndex_ = (index) => {
        if(index < 0) { index = Object.keys(interviewData).length - 1; }
        else if(index >= Object.keys(interviewData).length) { index = 0; }
        setNowIndex(index);
    }

    // overscroll pull-to-next-index 이벤트 처리
    useEffect(() => {
        const container = window;
        function onTouchStart(e) {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
                isTouchingRef.current = true;
                setIsPulling(true);
                setPullDistance(0);
                startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
            }
        }
        function onTouchMove(e) {
            if (!isTouchingRef.current) return;
            const y = e.touches ? e.touches[0].clientY : e.clientY;
            const diff = Math.max(0, startYRef.current - y);
            setPullDistance(diff);
        }
        function onTouchEnd() {
            if (!isTouchingRef.current) return;
            if (pullDistance >= pullThreshold) {
                setNowIndex((prev) => (prev + 1) % Object.keys(interviewData).length);
            }
            setPullDistance(0);
            setIsPulling(false);
            isTouchingRef.current = false;
        }
        container.addEventListener('touchstart', onTouchStart, { passive: false });
        container.addEventListener('touchmove', onTouchMove, { passive: false });
        container.addEventListener('touchend', onTouchEnd, { passive: false });
        container.addEventListener('mousedown', onTouchStart);
        container.addEventListener('mousemove', onTouchMove);
        container.addEventListener('mouseup', onTouchEnd);
        return () => {
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchmove', onTouchMove);
            container.removeEventListener('touchend', onTouchEnd);
            container.removeEventListener('mousedown', onTouchStart);
            container.removeEventListener('mousemove', onTouchMove);
            container.removeEventListener('mouseup', onTouchEnd);
        };
    }, [pullDistance]);

    // 인덱스 변경 시 스크롤 위치 초기화
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [nowIndex]);

    return (
        <div>
            <Spacer height={20} />
            <Title1 title={"아마추어를 만나다"} subTitle={"interview"} />

            <Spacer height={20} />
            <PianoIndex nowIndex={nowIndex} setNowIndex={setNowIndex_} />

            <InterviewContainer>
                {interviewData[nowIndex] && 
                    <>
                        <Spacer height={20} />
                        <Title2 title={interviewData[nowIndex].title} />
                        <DescriptionContainer>
                            {interviewData[nowIndex].description.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </DescriptionContainer>
                        {interviewData[nowIndex].youtube &&
                            <YoutubeContainer>
                                <YoutubePlayer videoId={interviewData[nowIndex].youtube} size={'100%'} autoplay={0}/>
                            </YoutubeContainer>
                        }
                    </>
                }
            </InterviewContainer>
            {/* bar: pull-to-next-index progress circle */}
            <PullProgressBar isPulling={isPulling}>
                <svg width={barSize} height={barSize}>
                    <circle
                        cx={barSize/2}
                        cy={barSize/2}
                        r={barRadius}
                        stroke="#e6bec2"
                        strokeWidth={barStroke}
                        fill="none"
                        opacity={0.2}
                    />
                    <circle
                        cx={barSize/2} cy={barSize/2}
                        r={barRadius}
                        stroke="#e6bec2"
                        strokeWidth={barStroke}
                        fill="none"
                        strokeDasharray={barCircum}
                        strokeDashoffset={barCircum * (1 - Math.min(1, pullDistance/pullThreshold))}
                        style={{ transition: 'stroke-dashoffset 0.1s' }}
                    />
                </svg>
            </PullProgressBar>
            {/* PC용 인덱스 이동 버튼 */}
            <NavButtonBar>
                <NavButton onClick={() => setNowIndex((prev) => (prev - 1 + Object.keys(interviewData).length) % Object.keys(interviewData).length)}>
                    &#8592;
                </NavButton>
                <NavButton onClick={() => setNowIndex((prev) => (prev + 1) % Object.keys(interviewData).length)}>
                    &#8594;
                </NavButton>
            </NavButtonBar>
        </div> 
    )
}