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
import getPageSize from '../api/client/getPageSize';
import DropText from '@/components/interview/dropText';
import Carousel2 from '@/components/layout/carousel2';

const YoutubeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 5%;
`;
const InterviewContainer = styled.div`
    width: 100%;
`;
const DescriptionContainer = styled.div`
    min-height: 100px;
`;
const PullProgressBar = styled.div`
    display: flex;
    min-height: 48px;
    pointer-events: none;
    justify-content: center;
    visibility: ${({ isPulling }) => (isPulling ? 'visible' : 'hidden')};
    flex-grow: 1;
`;
const NavButtonBar = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 20px 0;
`;
const NavButton = styled.button`
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    flex-grow: 2;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    border: none;
`;

const NavButton_Left = styled(NavButton)`
    background: linear-gradient(to right,
        #91C4D9 0%, 
        #FFFFFF 20%,
        #FFFFFF 100%);
    background-position: right;
    background-size: 200% 100%;
        
    &:hover {
        background-position: left;
    }
`;

const NavButton_Right = styled(NavButton)`
    background: linear-gradient(to left,
        #91C4D9 0%, 
        #FFFFFF 20%,
        #FFFFFF 100%);
    background-position: left;
    background-size: 200% 100%;
    &:hover {
        background-position: right;
    }
`;

const YoutubeThumbnailCarousel = ({video_infos}) => {
    const [thumbnails, setThumbnails] = useState([]);
    const [pageWidth, setPageWidth] = useState(400); // 기본값

    useEffect(() => {
        const fetchThumbnails = async () => {
            try {
                const result = await video_infos; // Promise를 await로 기다림
                console.log('Fetched thumbnails:', result); // 디버깅용
                setThumbnails(result);
            } catch (error) {
                console.error('Error fetching thumbnails:', error);
            } 
        };

        fetchThumbnails();
    }, [video_infos]);

    useEffect(() => {
        // 클라이언트 사이드에서만 getPageSize 호출
        if (typeof window !== 'undefined') {
            setPageWidth(getPageSize().width);
            
            const handleResize = () => {
                setPageWidth(getPageSize().width);
            };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const carouselItems = thumbnails.map((t, index) => {
        console.log('Carousel item:', t.thumbnails.medium); // 디버깅용
        return t.thumbnails.medium;
    });

    console.log('Final carousel items:', carouselItems); // 디버깅용

    return (
        thumbnails.length > 0 &&
        <div>
            <Carousel2
                imageList={carouselItems}
                imageWidth={pageWidth * 0.8}
            />

            {/* {thumbnails.map((thumbnail, index) => (
                <div key={index}>
                    <img src={thumbnail.thumbnails.medium} alt={thumbnail.title} />
                    <p>{thumbnail.title}</p>
                </div>
            ))} */}
        </div>
    );
}

export default function Interview() {
    const [nowIndex, setNowIndex] = useState(0);
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


    // 유튜브 썸네일 가져오기
    async function getVideoThumbnails(vidList) {
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // 환경 변수로 관리

        if (process.env.NODE_ENV === 'production') {
            // 배포(Production) 환경에서만 실행할 코드
            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${vidList.join(',')}&key=${API_KEY}`,
                { cache: 'no-store' } // App Router SSR을 사용하는 경우
            );
            if (!res.ok) {
                throw new Error('Failed to fetch video thumbnails');
            }
            const data = await res.json();
            
            // 썸네일 URL들을 추출해서 반환
            return data.items.map(item => ({
                videoId: item.id,
                title: item.snippet.title,
                thumbnails: {
                    default: item.snippet.thumbnails.default?.url,
                    medium: item.snippet.thumbnails.medium?.url,
                    high: item.snippet.thumbnails.high?.url,
                    standard: item.snippet.thumbnails.standard?.url,
                    maxres: item.snippet.thumbnails.maxres?.url
                }
            }));

        } else {
            // 개발(Development) 환경에서는 간단한 YouTube 썸네일 URL 구조 사용
            return vidList.map(videoId => ({
                videoId: videoId,
                title: `Test Video ${videoId}`,
                thumbnails: {
                    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
                    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
                    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                }
            }));
        }
    }

    return (
        <div>
            <Spacer height={20} />
            <Title1 title={"아마추어를 만나다"} subTitle={"interview"} />

            <Spacer height={20} />
            <PianoIndex nowIndex={nowIndex} setNowIndex={setNowIndex_} />

            {
                nowIndex == 0 ?
                <div>
                    <Title2 title={"아마추어를 만나다."} />
                    {/* <div
                        css={css`
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin: 20px 0;
                        `}
                    >
                        <DropText text={`-아마추어를 만나다-`} />
                    </div> */}

                    <p>
                        아마추어 연주자들을 만나 그들의 이야기와 음악을 들어보는 시간
                    </p>
                </div>
                : 
                <InterviewContainer>
                    {interviewData[nowIndex] && 
                        <>
                            <Spacer height={20} />
                            <Title2 title={interviewData[nowIndex].title} />
                            <DescriptionContainer>
                                {interviewData[nowIndex].description.split('\n').map((line, i) => (
                                    <p key={i}>
                                        {line}
                                    </p>
                                ))}
                            </DescriptionContainer>
                            {interviewData[nowIndex].youtube &&
                                <YoutubeContainer>
                                    <YoutubePlayer videoId={interviewData[nowIndex].youtube} size={`100%`} autoplay={0}/>
                                </YoutubeContainer> 
                            }
                        </>
                    }
                </InterviewContainer>
            }
            {/* bar: pull-to-next-index progress circle */}

            {/* image carousel */}
            <YoutubeThumbnailCarousel video_infos={getVideoThumbnails(Object.values(interviewData).map(item => item.youtube).filter(youtube => youtube))} />

            {/* PC용 인덱스 이동 버튼 */}
            <NavButtonBar>
                <NavButton_Left onClick={() => setNowIndex((prev) => (prev - 1 + Object.keys(interviewData).length) % Object.keys(interviewData).length)}>
                    ◁
                </NavButton_Left>
                <PullProgressBar isPulling={isPulling}>
                    <svg width={barSize} height={barSize}>
                        <circle
                            cx={barSize/2} cy={barSize/2} r={barRadius}
                            stroke="#e6bec2" strokeWidth={barStroke} 
                            fill="none" opacity={0.2}
                        />
                        <circle
                            cx={barSize/2} cy={barSize/2} r={barRadius}
                            stroke="#e6bec2" strokeWidth={barStroke} fill="none"
                            strokeDasharray={barCircum}
                            strokeDashoffset={barCircum * (1 - Math.min(1, pullDistance/pullThreshold))}
                            style={{ transition: 'stroke-dashoffset 0.1s' }}
                        />
                    </svg>
                </PullProgressBar>
                <NavButton_Right onClick={() => setNowIndex((prev) => (prev + 1) % Object.keys(interviewData).length)}>
                    ▷
                </NavButton_Right>
            </NavButtonBar>
        </div> 
    )
}