import { useEffect, useRef, useState } from "react";

const YouTubeEmbed = ({ videoId, width, height }) => {      // -> legacy, 다른데서 쓸거임.
    const iframeRef = useRef(null);

    useEffect(() => {
        const updateIframeHeight = () => {
            if(iframeRef.current) {
                const hei = iframeRef.current.offsetWidth * 0.5625;
                iframeRef.current.setAttribute('height', hei);
            }
        }
        updateIframeHeight();
        window.addEventListener('resize', updateIframeHeight);
    })

    return (
        <div 
            style={{
                width, height,
                margin: '0 10%',
            }}
        >
            <iframe
                width="100%"
                ref={iframeRef}
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

export {
    YouTubeEmbed,
}