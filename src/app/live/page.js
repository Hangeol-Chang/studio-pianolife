'use client';
/** @jsxImportSource @emotion/react */

import { Title1, Title2, Title3, Title4 } from '@/components/common/title';
import { useState, useEffect, useRef } from 'react';
import { Spacer } from '@/components/common/spacer';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import YoutubePlayer from '@/components/media/youtubeSingle';

const LiveContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StatusContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
    padding: 20px;
    border-radius: 12px;
    background: ${({ isLive }) => (isLive ? 'linear-gradient(135deg, #ff6b6b, #ff8787)' : 'linear-gradient(135deg, #6c757d, #adb5bd)')};
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StatusIndicator = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.2rem;
    font-weight: bold;
`;

const YoutubeContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 5%;
    width: 90%;
`;

const LoadingSpinner = styled.div`
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const RefreshButton = styled.button`
    margin-top: 10px;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`;

export default function Live() {
    const [isLive, setIsLive] = useState(false);
    const [liveVideoId, setLiveVideoId] = useState(null);
    const [liveVideoTitle, setLiveVideoTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [lastCheckTime, setLastCheckTime] = useState(null);
    const intervalRef = useRef(null);

    // 모니터링할 채널 ID (환경변수나 설정으로 관리 가능)
    const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID; // 예시 채널 ID, 실제 채널 ID로 변경 필요

    // YouTube Data API를 사용해서 라이브 스트림 체크
    const checkLiveStream = async () => {
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        
        if (!API_KEY) {
            console.error('YouTube API Key가 설정되지 않았습니다.');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            
            // YouTube Data API v3를 사용해서 해당 채널의 라이브 스트림 검색
            const searchResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`,
                { cache: 'no-store' }
            );

            if (!searchResponse.ok) {
                throw new Error(`API 요청 실패: ${searchResponse.status}`);
            }

            const searchData = await searchResponse.json();
            
            if (searchData.items && searchData.items.length > 0) {
                // 라이브 스트림이 발견됨
                const liveVideo = searchData.items[0];
                
                // 추가 정보를 가져오기 위해 videos API 호출
                const videoResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${liveVideo.id.videoId}&key=${API_KEY}`,
                    { cache: 'no-store' }
                );

                if (videoResponse.ok) {
                    const videoData = await videoResponse.json();
                    const videoInfo = videoData.items[0];
                    
                    // 실제로 라이브 중인지 확인
                    if (videoInfo.liveStreamingDetails && !videoInfo.liveStreamingDetails.actualEndTime) {
                        setIsLive(true);
                        setLiveVideoId(liveVideo.id.videoId);
                        setLiveVideoTitle(liveVideo.snippet.title);
                    } else {
                        setIsLive(false);
                        setLiveVideoId(null);
                        setLiveVideoTitle('');
                    }
                }
            } else {
                // 라이브 스트림이 없음
                setIsLive(false);
                setLiveVideoId(null);
                setLiveVideoTitle('');
            }
            
            setLastCheckTime(new Date());
            
        } catch (error) {
            console.error('라이브 스트림 확인 중 오류:', error);
            setIsLive(false);
            setLiveVideoId(null);
            setLiveVideoTitle('');
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 초기 체크 및 주기적 폴링 설정
    useEffect(() => {
        // 초기 체크
        checkLiveStream();
        
        // 5분마다 체크 (API 할당량 고려)
        const POLLING_INTERVAL = 5 * 60 * 1000; // 5분
        intervalRef.current = setInterval(checkLiveStream, POLLING_INTERVAL);
        
        // 컴포넌트 언마운트 시 인터벌 클리어
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Page Visibility API를 사용한 성능 최적화
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // 페이지가 백그라운드로 갈 때 폴링 중단
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            } else {
                // 페이지가 다시 활성화될 때 즉시 체크하고 폴링 재시작
                checkLiveStream();
                const POLLING_INTERVAL = 5 * 60 * 1000;
                intervalRef.current = setInterval(checkLiveStream, POLLING_INTERVAL);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <div>
            <Spacer height={20} />
            <Title1 title={"Live Streaming"} />
            
            <LiveContainer>
                <Spacer height={20} />                
                <StatusContainer isLive={isLive}>
                    <StatusIndicator>
                        {isLoading ? (
                            <>
                                <LoadingSpinner />
                                <span>스트리밍 상태 확인 중...</span>
                            </>
                        ) : isLive ? (
                            <span>🔴 라이브 스트리밍 중</span>
                        ) : (
                            <span>⚫ 오프라인</span>
                        )}
                    </StatusIndicator>
                    
                    {liveVideoTitle && (
                        <div css={css`margin-top: 8px; text-align: center; font-size: 0.9rem;`}>
                            {liveVideoTitle}
                        </div>
                    )}
                    
                    {lastCheckTime && (
                        <div css={css`margin-top: 8px; font-size: 0.8rem; opacity: 0.8;`}>
                            마지막 확인: {lastCheckTime.toLocaleString()}
                        </div>
                    )}
                    
                    <RefreshButton onClick={() => checkLiveStream()}>
                        수동 새로고침
                    </RefreshButton>
                </StatusContainer>

                {isLive && liveVideoId && (
                    <>
                        <div css={css`
                            width: 90%;
                            text-align: center;
                            margin: 20px 0 10px 0;
                            font-size: 1.1rem;
                            font-weight: bold;
                            color: #ff6b6b;
                        `}>
                            🎥 라이브 스트리밍이 진행 중입니다!
                        </div>
                        <YoutubeContainer>
                            <YoutubePlayer 
                                videoId={liveVideoId} 
                                size="100%" 
                                autoplay={1}
                            />
                        </YoutubeContainer>
                    </>
                )}

                {!isLive && !isLoading && (
                    <div css={css`
                        text-align: center;
                        padding: 40px 20px;
                        color: #666;
                    `}>
                        <div css={css`font-size: 1.2rem; margin-bottom: 10px;`}>
                            현재 라이브 스트리밍이 없습니다
                        </div>
                        <div css={css`font-size: 0.9rem;`}>
                            새로운 라이브 스트리밍이 시작되면 자동으로 표시됩니다
                        </div>
                    </div>
                )}
            </LiveContainer>
        </div>
    );
}
