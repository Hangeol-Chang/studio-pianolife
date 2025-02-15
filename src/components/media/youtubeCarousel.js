

/*
    video_infos = [
        {
            videoId: 'videoId'
            title: 'title',
        }
    ]
*/

import { useEffect, useState } from "react";
import styles from './youtubeCarousel.module.scss';

const YouTubeEmbed = ({ videoId, width, height }) => {      // -> legacy
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

export default function YoutubeCarousel({ video_infos }) {

    const [youtubeWidth, setYoutubeWidth] = useState(300);
    const [youtubeHeight, setYoutubeHeight] = useState(150);

    const resizeEvent = () => {
        setYoutubeWidth(window.innerWidth * 0.9);
        setYoutubeHeight(window.innerHeight * 0.45);
    }

    useEffect(() => {
        resizeEvent();
        console.log(video_infos);

        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('resize', resizeEvent);
        };
    }, []);

    return (
        <div className={styles.youtube_carousel_container}>
            {video_infos.map((video_info, index) => (
                <div key = {video_info.videoId}>
                    <h3>{video_info.title}</h3>
                    <YouTubeEmbed videoId={video_info.videoId} width={youtubeWidth} height={youtubeHeight} />
                </div>
            ))}
        </div>
    )
}