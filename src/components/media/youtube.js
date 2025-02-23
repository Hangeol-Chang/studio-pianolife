const YouTubeEmbed = ({ videoId, width, height }) => {      // -> legacy, 다른데서 쓸거임.
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

export {
    YouTubeEmbed,
}