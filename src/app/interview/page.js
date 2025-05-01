
'use client';
/** @jsxImportSource @emotion/react */

import { Title1, Title2 } from '@/components/common/title';
import { YouTubeEmbed } from '@/components/media/youtube';
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
    let endPos = useRef({x : 0, y : 0});

    const youtube_container_style = css`
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    `;
    const interview_container_style = css`
        width: 100%;
        height: 200px;
        background-color: #DDDDDD;  // 색 지울 것
    `;

    useEffect(() => {
        console.log(interviewData);
    }, [interviewData]);

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

            console.log('드래그 종료', dx, dy);
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
                if (scrollDelta.current > 0) {
                    console.log('스크롤 아래로:', scrollDelta.current);
                } else {
                    console.log('스크롤 위로:', scrollDelta.current);
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
            <PianoIndex />    

            <Spacer height={20} />
            <div ref={scrollHijackRef} 
                css={interview_container_style}
            >
                <Title2 title={interviewData[nowIndex].title} />
                <p>
                    {interviewData[nowIndex].description.split('\n').map((line, i) => (
                        <span key={i}>
                            {line}
                            <br />
                        </span>
                    ))}
                </p>
            </div>

            <div>
                <Spacer height={50} />
                <Title2 title={"수학자 황수현"} />
                <p>
                    아마추어를 만나다 첫번째 주인공! <br />
                    전공생들도 힘겨워하는 브람스 소나타 3번 그것도 전악장에 도전하는 그의 열정. <br />
                    연주회를 준비를 위한 그의 철저한 분석과 함께 음악에 대한 솔직 담백함이 느껴지는 그의 인터뷰와 스페셜 연주를 들어보세요!</p>
                <div css={youtube_container_style}>
                    <YouTubeEmbed videoId="cVxLS05Ki2Q" width={'100%'} height={'auto'}/>
                </div>
            </div> 
            
            <div>
                <Spacer height={50} />
                <Title2 title={"프랑스어학부 신소희"} />
                <p>
                    구독자 19만명의 유튜브 채널 뮤라벨에서 카푸스틴 에튀드로 엄청난 주목을 받았던 주인공! <br />
                    리듬, 파워, 테크닉 뭐 하나 빠질 것 없는 탄탄한 기본기의 그녀는 왜 불어를 전공하게 되었을까요? <br />
                    그녀의 이야기와 거쉰 프렐류드를 들어보세요!
                </p>
                <div css={youtube_container_style}>
                    <YouTubeEmbed videoId="ki7ogEmeVDQ" width={'100%'} height={'auto'}/>
                </div>
            </div>
            <div>
                <Spacer height={50} />
                <Title2 title={"전기전자공학부 엄현서"} />
                <p>
                    아니 이제....아마추어도 국제 콩쿨이 있어?!? <br />
                    프랑스 파리에서 열린 2024 Piano Link 콩쿨 수상자 엄현서님. <br />
                    과연 그는 천재인가..아니면 노력형인가..일본의 비음대 출신 피아니스트 스미노 하야토를 연상케 하는 그의 연주와 이야기를 들어보세요!
                </p>
                <div css={youtube_container_style}>
                    <YouTubeEmbed videoId="BAaNn80jGBw" width={'100%'} height={'auto'}/>
                </div>
            </div>
            <div>
                <Spacer height={50} />
                <Title2 title={"공무원 김효재"} />
                <p>
                &rsquo;공무원도 사람이랍니다😄&rsquo; <br />
                    공무원 스토리와 함께 누군가에게 감동을 주고 싶은 그녀의 음악에 대한 목표를 들어볼 수 있는 솔직 담백 인터뷰! <br />
                    그녀가 연주하는 뱃노래와 에너지 가득한 인터뷰를 들어보세요!
                </p>
                <div css={youtube_container_style}>
                    <YouTubeEmbed videoId="bPOCjXCCSnM"  width={'100%'} height={'auto'}/>
                </div>
            </div>
            <div>
                <Spacer height={50} />
                <Title2 title={"AI 연구원 노준탁"} />
                <p>
                    2024년 9월 폴란드 바르샤바에서 울려퍼진 이름 &rsquo;노준탁&rsquo;, <br />
                    2015년 조성진 피아니스트가 우승한 쇼팽 콩쿠르의 아마추어 버전 쇼팽 국제 아마추어 콩쿠르에 참가하여 당당하게 입상한 그가 말해주는 본인의 취미 스토리! <br />
                    슬프면서도 진중하고 아름다운 마주르카와 함께 그의 다양한 이야기를 들어보세요!
                </p>
                <div css={youtube_container_style}>
                    <YouTubeEmbed videoId="m69T4rR1vqM" width={'100%'} height={'auto'}/>
                </div>
            </div>


            <Spacer height={50} />
        </div> 
    )
}