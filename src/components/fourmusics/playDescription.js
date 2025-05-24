'use client';
/** @jsxImportSource @emotion/react */

import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import getPageSize from '@/app/api/client/getPageSize';

import testData from './testData.json';
import { Title3, Title4, HrV } from '../common/title';
import { FaBackward, FaForward, FaPause, FaPlay, FaShare, FaStepBackward, FaStepForward, FaThumbsUp } from 'react-icons/fa';
import YoutubePlayer from '../media/youtubeSingle';
import { Spacer } from '../common/spacer';

const IconWrapper = ({ children, onClick, size, Icon, inversed = false }) => {
    const icon_wrapper_style = css`
        width: ${size};
        height: ${size};
        cursor: pointer;
        
        display: flex;
        justify-content: center;
        align-items: center;
        
        transition: all 0.3s ease-in-out;
        animation: all 0.3s ease-in-out;
        padding: 10px;
        border-radius: ${size + 10}px;

        background-color: ${inversed ? 'rgba(0, 0, 0, 0.9)' : 'transparent'};

        &:hover {
            * { color: ${inversed ? 'black' : 'white'} }
            background-color: ${inversed ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.8)'};
            transform: scale(1.1);
        }
        &:active {
            transform: scale(0.9);
        }
    `;

    const icon_style = css`
        color: ${inversed ? 'white' : 'black'};
    `;

    return (
        <div onClick={onClick} css={inversed ? icon_wrapper_style : icon_wrapper_style}>
            {Icon && <Icon css={icon_style} size={size} />}
            {children}
        </div>
    );
}

const TimelineSlider = ({length, currentTime}) => {
    const videoRef = useRef(null);
    const [isSeeking, setIsSeeking] = useState(false);

    const timeline_container_style = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
    `;

    const timeline_text_container_style = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0px 16px;
    `;

    const timeline_slider_style = css`
        -webkit-appearance: none;
        width: 100%;
        width: 100%;
        height: 1px;
        background: transparent;
        padding: 16px 8px;

        &::-webkit-slider-runnable-track {
            height: 2px;
            background: #AAAAAA;
            border-radius: 3px;
            // box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
            margin: 0px 10px;
        }
        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            margin-top: -7px;
            background: #FFFFFF;
            border: 2px solid #AAAAAA;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        &::-webkit-slider-thumb:active {
            // background: #AAAAAA;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        &::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            // background: #777777;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        &::-moz-range-track {
            height: 6px;
            // background: #000000;
            border-radius: 3px;
        }
        &::-moz-range-progress {
            // background-color: #AAAAAA;
            height: 6px;
        }
    `;

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
    }, [isSeeking]);

    const handleSliderChange = (e) => {
        // const time = parseFloat(e.target.value);
    };

    const handleSeekCommit = (e) => {
        const time = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
        }
        setIsSeeking(false);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    return (
        <>
            {currentTime &&
                <div css={timeline_container_style}>
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
                    <div css={timeline_text_container_style}>
                        <div>{formatTime(currentTime)}</div>
                        <div>{formatTime(length)}</div>
                    </div>
                </div>
            }
        </>
    );
}

const TagList = ({ tags }) => {
    const [expanded, setExpanded] = useState(false);

    const tag_container_style = css`
        display: flex;
        flex-wrap: wrap;
        margin: 10px;

        max-height: ${expanded ? 'none' : '60px'};
        overflow: hidden;
    `;
    const tag_style = css`
        margin: 0px 5px;
        color: grey;

        font-size: 14px;
        border-radius: 20px;
        background-color: #F0F0F0;
        padding: 5px 10px;
        margin: 2px 5px;
    `;

    const expand_button_style = css`
        cursor: pointer;
        text-align: center;
        margin: 10px;
        font-size: 12px;
        border-radius: 20px;
        padding: 5px 10px;
        &:hover {
            background-color: #FAFAFA;
        }
        &:active {
            background-color: #EFEFEF;
        }
    `;

    return (
        <div>
            <div css={tag_container_style}>
                {tags.map((tag, i) => (
                    <span key={tag + `-` + i} css={tag_style}>
                        {tag}
                    </span>
                ))}
            </div>
            <div css={expand_button_style} onClick={() => setExpanded(!expanded)}>
                {expanded ? '△ 접기' : '▽ 더보기'}
            </div>
        </div>
    )
}

export default function PlayDescription({ videoIds }) {  
    const [videoItems, setVideoItems] = useState([]);

    const [videoData, setVideoData] = useState(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(['00:00:00', 0]);
    const [tags, setTags] = useState([]);

    const [nowIndex, setNowIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    // 여러 데이터
    async function getVideoDatas(vidList) {
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // 환경 변수로 관리

        if (process.env.NODE_ENV === 'production') {
            // 배포(Production) 환경에서만 실행할 코드
            const res = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${vidList.join(',')}&key=${API_KEY}`,
                { cache: 'no-store' } // App Router SSR을 사용하는 경우
            );
            if (!res.ok) {
                throw new Error('Failed to fetch video data');
            }
            const data = await res.json();
            parseDuration(data.items[nowIndex].contentDetails.duration);
            return data.items;

        } else {
            // 개발(Development) 환경에서만 실행할 코드
            const data = testData; // 테스트 데이터 사용
            parseDuration(data.items[nowIndex].contentDetails.duration);
            return data.items;
        }
    
        // 전처리

    }

    // 하나만
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
        parseTag(data.items[0].snippet.description);

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

    const parseTag = (description) => {
        const tags = [...description.matchAll(/#(\S+)/g)].map(match => match[0]);
        setTags(tags);
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
        if(videoIds) {
            async function fetchVideoData() {
                const data = await getVideoDatas(videoIds);
                setVideoItems(data);
            }
            fetchVideoData();
        }
    }, [videoIds]);

    useEffect(() => {

    }, [isPlaying]);

    useEffect(() => {
        if (videoItems.length === 0) return;

        parseDuration(videoItems[nowIndex]?.contentDetails.duration);
        parseTag(videoItems[nowIndex]?.snippet.description);
        setVideoData(videoItems[nowIndex]);
    }, [videoItems, nowIndex]);
    
    if (!videoData) return <div>Loading...</div>;

    const play_controller_style = css`
        display: flex;
        flex-direction: column;
        margin: 0px clamp(0px, 5vw, 38.4px);
    `;
    const play_icon_container_style = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 10px;
    `;
    const share_icon_container_style = css`
        ${play_icon_container_style};
        justify-content: flex-end;
        gap: 10px;
    `;

    const hr_vertical_style = css`
        margin: 0px 5px;
    `;

    const youtube_container_style = css`
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    return (
        <div>
            <Title3 title={videoData.snippet.title} line={false}></Title3>
            <Spacer height={10} />

            <div css={play_controller_style}>
                <div css={youtube_container_style}>
                    <YoutubePlayer 
                        videoId={videoData.id} autoplay={1} size={getPageSize().width - 100} 
                        callback={getPlayInfo} isPlaying={isPlaying}
                    />
                </div>

                <div css={share_icon_container_style}>
                    <IconWrapper size={16} Icon={FaThumbsUp} >
                        <HrV height={16} style={hr_vertical_style}/>
                        <div>{videoData.statistics.likeCount}</div>
                    </IconWrapper>
                    <IconWrapper size={16} Icon={FaShare}>
                    </IconWrapper> 
                </div>

                <TimelineSlider length={duration[1]} currentTime={currentTime}/>

                <div css={play_icon_container_style}>
                    <IconWrapper size={20} Icon={FaStepBackward} onClick={() => setNowIndex((nowIndex - 1 + videoItems.length) % videoItems.length)}>
                    </IconWrapper>
                    <IconWrapper size={20} Icon={FaBackward}>
                    </IconWrapper>
                    {isPlaying ?
                        <IconWrapper size={26} Icon={FaPause} onClick={() => setIsPlaying(false)} inversed={true}>
                        </IconWrapper>
                        :
                        <IconWrapper size={26} Icon={FaPlay} onClick={() => setIsPlaying(true)} inversed={true}>
                        </IconWrapper>
                    }
                    <IconWrapper size={20} Icon={FaForward}>
                    </IconWrapper>
                    <IconWrapper size={20} Icon={FaStepForward} onClick={() => setNowIndex((nowIndex + 1) % videoItems.length)}>
                    </IconWrapper>
                </div>

                {/* <p>길이: {duration[0]}</p>
                <p>좋아요: {videoData.statistics.likeCount}</p> */}

                <Spacer height={10} />
                <Title3 title="Description"/>
                <Spacer height={10} />
                <p>
                    {videoData.snippet.description.split('\n').map((line, i) => (
                        line.includes('#') ? (
                            <span key={i} css={css`display: none;`}></span>
                        ) : (
                            <span key={i}>
                                {line}
                                <br />
                            </span>
                        )
                    ))}
                </p>

                <hr />
                <TagList tags={tags} />
            </div>
        </div>
    );
}