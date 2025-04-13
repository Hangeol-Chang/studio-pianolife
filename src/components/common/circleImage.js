'use client';

const CircleImage = ({ src, alt, size, style }) => {
    return (
        <>
            <style>
                {`
                    @keyframes rotate {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    img:hover {
                        animation: rotate 10s linear infinite;
                    }
                `}
            </style>
            <img
                src={src}
                alt={alt}
                style={{
                    width: size, height: size,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto',
                    // ...style
                    position : 'absolute',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                    // animation: 'rotate 10s linear infinite',
                }}
            />
        </>
    );
}

export default CircleImage;