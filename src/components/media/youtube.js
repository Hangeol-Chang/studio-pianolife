import { useEffect, useRef, useState } from "react";

const YouTubeEmbed = ({ videoId, width }) => {      // -> legacy, 다른데서 쓸거임.
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
            style={{ width }}
        >
            <iframe
                width="100%"
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen

                style={{
                    borderRadius: '6px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                }}
            ></iframe>
         </div>
    );
};

export {
    YouTubeEmbed,
}