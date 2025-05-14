'use client';
/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import getPageSize from '@/app/api/client/getPageSize';

import testData from './testData.json';
import { Title3, Title4, HrV } from '../common/title';
import { YouTubeEmbed } from '../media/youtube';
import { FaBackward, FaForward, FaPlay, FaShare, FaThumbsUp } from 'react-icons/fa';
import YoutubePlayer from '../media/youtube2';

const IconWrapper = ({ children, onClick, size, Icon, iconStyle }) => {
    const icon_wrapper_style = css`
        color: grey;
        width: ${size};
        height: ${size};
        padding: 10px;

        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        transition: all 0.3s ease-in-out;
        animation: all 0.3s ease-in-out;
        border-radius: ${size}px;

        &:hover {
            * { color: white; }
            background-color: rgba(0, 0, 0, 0.8);
            transform: scale(1.1);
        }
        &:active {
            transform: scale(0.9);
        }
    `;

    return (
        <div onClick={onClick} css={icon_wrapper_style}>
            {Icon && <Icon css={iconStyle} size={size} />}
            {children}
        </div>
    );
}

const TimelineSlider = ({length, currentTime}) => {
    const videoRef = useRef(null);
    const [isSeeking, setIsSeeking] = useState(false);

    const timeline_slider_style = css`
        width: 100%;
    `;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
  }, [isSeeking]);

  const handleSliderChange = (e) => {
        const time = parseFloat(e.target.value);
  };

  const handleSeekCommit = (e) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
        setIsSeeking(false);
  };

  return (
    <>
        {currentTime &&
            <div className="p-4 max-w-md mx-auto">
                <video
                    ref={videoRef}
                    src="/sample.mp4"
                    controls={false}
                    className="w-full rounded-lg"
                />
                <input
                    css={timeline_slider_style}
                    type="range"
                    min={0} max={length} step="0.1"
                    value={currentTime}
                    onChange={handleSliderChange}
                    onMouseDown={() => setIsSeeking(true)}
                    onMouseUp={handleSeekCommit}
                    onTouchStart={() => setIsSeeking(true)}
                    onTouchEnd={handleSeekCommit}
                />
                <div className="text-sm text-gray-600 text-right">
                    {formatTime(currentTime)} / {formatTime(length)}
                </div>
            </div>
        }
    </>
  );
}

function formatTime(time) {
    const minutes = Math.floor(time / 60)
        .toString()
        .padStart(2, "0");
    const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
}


export default function PlayDescription({ videoId }) {
    const [videoData, setVideoData] = useState(null);
    
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(['00:00:00', 0]);

    async function getVideoData(vid) {
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // 환경 변수로 관리
        // const res = await fetch(
        //     `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${vid}&key=${API_KEY}`,
        //     { cache: 'no-store' } // App Router SSR을 사용하는 경우
        // );
        // if (!res.ok) {
        //     throw new Error('Failed to fetch video data');
        // }
        // const data = await res.json();
    
        const data = testData; // 테스트 데이터 사용

        // 전처리
        parseDuration(data.items[0].contentDetails.duration);

        // console.log(data);
        return data.items[0];
    }

    const parseDuration = (isoDuration) => {
        const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = match?.[1] ? match[1].replace('H', '') : '0';
        const minutes = match?.[2] ? match[2].replace('M', '') : '0';
        const seconds = match?.[3] ? match[3].replace('S', '') : '0';
    
        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');
    
        setDuration([`${h}:${m}:${s}`, parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds)]);
    }

    const getPlayInfo = (player) => {
        // const duration = player.getDuration();
        setCurrentTime(player.getCurrentTime());
        // console.log(`Current Time: ${player.getCurrentTime()}, Duration: ${duration.toFixed(2)}초`);
    }

    // const title = video.snippet.title;
    // const description = video.snippet.description;
    // const likeCount = video.statistics.likeCount;
    // const duration = parseDuration(video.contentDetails.duration);

    useEffect(() => {
        if(videoId) {
            async function fetchVideoData() {
                const data = await getVideoData(videoId);
                setVideoData(data);
            }
            fetchVideoData();
        }
    }, [videoId]);
    
    if (!videoData) return <div>Loading...</div>;
    
    const icon_style = css`
        color: black;
    `;

    const play_controller_style = css`
        display: flex;
        flex-direction: column;
        margin: 0px clamp(0px, 5vw, 38.4px);
    `;
    const play_icon_container_style = css`
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin: 10px;
    `;

    const hr_vertical_style = css`
        margin: 0px 5px;
    `;

    return (
        <div>
            <Title3 title={videoData.snippet.title}></Title3>

            <div css={play_controller_style}>
                <div css={play_icon_container_style}>
                    <IconWrapper size={24} Icon={FaThumbsUp} iconStyle={icon_style}>
                        <HrV height={24} style={hr_vertical_style}/>
                        <div>{videoData.statistics.likeCount}</div>
                    </IconWrapper>
                    <IconWrapper size={24} Icon={FaBackward} iconStyle={icon_style}>
                    </IconWrapper>
                    <IconWrapper size={24} Icon={FaPlay} iconStyle={icon_style}>
                    </IconWrapper>
                    <IconWrapper size={24} Icon={FaForward} iconStyle={icon_style}>
                    </IconWrapper>
                    <IconWrapper size={24} Icon={FaShare} iconStyle={icon_style}>
                    </IconWrapper> 
                </div>
            </div>
            <TimelineSlider length={duration[1]} currentTime={currentTime}/>

            <div css={css`display: flex; justify-content: center; align-items: center;`}>
                <YouTubeEmbed  videoId={videoData.id} width={'300px'} />
            </div>

            <div css={css`display: flex; justify-content: center; align-items: center;`}>
                <YoutubePlayer 
                    videoId={videoData.id} autoplay={1} size={getPageSize().width - 100} 
                    callback={getPlayInfo}
                />
            </div>

            <p>길이: {duration[0]}</p>
            <p>좋아요: {videoData.statistics.likeCount}</p>

            <Title4 title="Description" />
            <p>
                {videoData.snippet.description.split('\n').map((line, i) => (
                    <span key={i}>
                        {line}
                        <br />
                    </span>
                ))}
            </p>
        </div>
    );
}