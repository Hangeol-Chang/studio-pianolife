
'use client';
/** @jsxImportSource @emotion/react */

import { Title1, Title2 } from '@/components/common/title';
import { YouTubeEmbed } from '@/components/media/youtubeMulti';
import { useState, useEffect, useRef } from 'react';
import { Spacer } from '@/components/common/spacer';
import { css } from '@emotion/react';
import PianoIndex from '@/components/interview/pianoIndex';

// raw data import
import { interview as interviewData } from './interview.json';

export default function Interview() {
    const [nowIndex, setNowIndex] = useState(1);

    const scrollHijackRef = useRef(null);
    const wheelTimeoutRef = useRef(null);
    let scrollDelta = useRef(0);

    const [dragging, setDragging] = useState(false);
    const startPos = useRef({x : 0, y : 0});
    const endPos = useRef({x : 0, y : 0});

    const youtube_container_style = css`
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px 5%;
    `;
    const interview_container_style = css`
        width: 100%;
    `;

    const scroll_hijack_style = css`
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 20;
    `;
    const description_container_style = css`
        min-height: 100px;
    `;

    const setNowIndex_ = (index) => {
        if(index < 0) { index = Object.keys(interviewData).length - 1; }
        else if(index >= Object.keys(interviewData).length) { index = 0; }
        setNowIndex(index);
    }

    const changeIndex = (dir) => {
        if(dir === 1) {
            setNowIndex((prev) => (prev + 1) % Object.keys(interviewData).length);
        }
        else if(dir === -1) {
            const len = Object.keys(interviewData).length;
            setNowIndex((prev) => (prev - 1 + len) % len);
        }
    };

    // drag 처리
    useEffect(() => {
        const area = scrollHijackRef.current;
        if (!area) return;
    
        // 모바일 드래그 처리.
        const isTouchDevice = 'ontouchstart' in window;
        const getPoint = (e) => ('touches' in e ? e.touches[0] : e);
        const onStart = (e) => {
            e.preventDefault();
            setDragging(true);
            const point = getPoint(e);
            startPos.current = { x: point.clientX, y: point.clientY };
            endPos.current = { x: point.clientX, y: point.clientY };
        };
        const onMove = (e) => {
            if (!dragging) return;
            e.preventDefault();
            const point = getPoint(e);
            endPos.current = { x: point.clientX, y: point.clientY };
        };
        const onEnd = (e) => {
            e.preventDefault();
            setDragging(false);
            const dx = endPos.current.x - startPos.current.x;
            const dy = endPos.current.y - startPos.current.y;

            // console.log('드래그 종료', dx, dy);
            if(dy < -100) { // 위로 드래그
                changeIndex(1);
            }
            else if(dy > 100) { // 아래로 드래그
                changeIndex(-1);
            }
            else if(dx < -100) { // 왼쪽으로 드래그
                changeIndex(1);
            }
            else if(dx > 100) { // 오른쪽으로 드래그
                changeIndex(-1);
            }
        };

        if (isTouchDevice) {    // 모바일
            area.addEventListener('touchstart', onStart, { passive: false });
            area.addEventListener('touchmove', onMove, { passive: false });
            area.addEventListener('touchend', onEnd, { passive: false });
        } else {
            area.addEventListener('mousedown', onStart);
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onEnd);
        }

        // 휠 이벤트 (PC 기준)
        const onWheel = (e) => {
            e.preventDefault();
      
            const { deltaY } = e;
            scrollDelta.current += deltaY; // 스크롤 델타 누적
      
            // 이전 타이머 클리어
            if (wheelTimeoutRef.current) {
                clearTimeout(wheelTimeoutRef.current);
            }
      
            // 200ms 내에 추가 휠 이벤트가 없으면 "스크롤 종료"로 간주
            wheelTimeoutRef.current = setTimeout(() => {
                // console.log('스크롤 종료:', scrollDelta.current);

                if (scrollDelta.current > 0) {
                    // console.log('스크롤 아래로:', scrollDelta.current);
                    if(scrollDelta.current >= 300) { changeIndex(1); } // 300 이상일 때만 인덱스 변경
                } else {
                    // console.log('스크롤 위로:', scrollDelta.current);
                    if(scrollDelta.current <= -300) { changeIndex(-1); } // -300 이하일 때만 인덱스 변경
                }
                scrollDelta.current = 0; // 스크롤 델타 초기화
            }, 200);
        };
        area.addEventListener('wheel', onWheel, { passive: false });
    
        return () => {
            if (isTouchDevice) {
                area.removeEventListener('touchstart', onStart);
                area.removeEventListener('touchmove', onMove);
                area.removeEventListener('touchend', onEnd);
            } else {
                area.removeEventListener('mousedown', onStart);
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onEnd);
            }
            area.removeEventListener('wheel', onWheel, { passive: false });
            if(wheelTimeoutRef.current) { clearTimeout(wheelTimeoutRef.current); }
        };
    }, [dragging]);
    

    return (
        <div>
            <Spacer height={20} />
            <Title1 title={"아마추어를 만나다"} subTitle={"interview"} />

            <Spacer height={20} />
            <PianoIndex nowIndex={nowIndex} setNowIndex={setNowIndex_} />

            <div css={interview_container_style}>
                {interviewData[nowIndex] && 
                    <>
                        <div ref={scrollHijackRef} css={scroll_hijack_style}></div>
                        <Spacer height={20} />
                        <Title2 title={interviewData[nowIndex].title} />
                        <p css={description_container_style}>
                            {interviewData[nowIndex].description.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </p>
                        {interviewData[nowIndex].youtube &&
                            <div css={youtube_container_style}>
                                <YouTubeEmbed videoId={interviewData[nowIndex].youtube} width={'100%'} height={'auto'}/>
                            </div>
                        }
                    </>
                }
            </div>
        </div> 
    )
}