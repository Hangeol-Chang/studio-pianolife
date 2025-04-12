'use client';
/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react';
import { css, keyframes } from '@emotion/react';

export default function DiskCarousel({ mediaInfos, imageSize, nowIndex }) {

    const disk_container = css`
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30%;
        position: relative;
        // background-color: #f0f0f0;
    `;

    const rotate = keyframes`
        0% { transform: scale(1.4) rotate(0deg); }
        100% { transform: scale(1.4) rotate(360deg); }
    `;
    
    const disk = css`
        border-radius: 50%;
        object-fit: cover;
        position : absolute;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        transition: all 0.7s ease-in-out;

        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const disk_hole = css`
        box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.3);
    `;

    const disk_top = css`
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        top: 0; left: -15%;
        z-index: 1;
        filter: brightness(0.8);
        opacity: 0.6;
    `;
    
    const disk_bot =  css`
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        bottom: 0; left: -15%;
        z-index: 1;
        filter: brightness(0.8);
        opacity: 0.6;
    `;

    const disk_main = css`
        transform: scale(1.4);
        width: 140%;
        height: 140%;
        animation: ${rotate} 10s linear infinite;

        z-index: 10;

        &:hover {
            transform: scale(1.4);
        }
    `;

    const disk_hide = css`
        display: none;
    `;

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        return () => { setIsMounted(false); }
    }, []);

    const [imageList, setImageList] = useState([]);
    const diskRefs = useRef([]);

    useEffect(() => {
        if(isMounted) setImageList(mediaInfos.map((mediaInfo) => mediaInfo.src));
    }, [isMounted, mediaInfos]); 


    const Disk = (({ image, index, diskRef }) => {
        let styles = [disk];
      
        if (index === nowIndex) {
            styles.push(disk_main);
        } else if (index === (nowIndex - 1 + imageList.length) % imageList.length) {
            styles.push(disk_top);
        } else if (index === (nowIndex + 1) % imageList.length) {
            styles.push(disk_bot);
        }
      
        return (
            <div
                key={image + index} ref={diskRef} css={styles}
                style={{ width: imageSize, height: imageSize }}
            >
                <img
                    css={disk} src={image} alt="disc"
                    style={{ width: imageSize, height: imageSize }}
                />
                <div
                    css={disk_hole}
                    style={{
                        width: imageSize * 0.2,
                        height: imageSize * 0.2,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        zIndex: 2,
                    }}
                />
            </div>
        );
    });



    return (
        <div  style={{ display: 'flex' }}>
            <div 
                css={disk_container}
            
                style={{
                    width: imageSize * 2,
                    height: imageSize * 2.5,
                    margin: '20px 0',
                }}
            >
                {/* {
                    imageList.map((image, index) => 
                        <img 
                            className={styles.disk}
                            key={image + index}
                            src={image} 
                            alt="disc" 
                            style={{
                                width: imageSize, height: imageSize,
                            }}
                        />
                    )
                } */}
                {
                    isMounted ? 
                        imageList.map((image, index) => 
                            Disk({ image, index, diskRef: (el) => diskRefs.current[index] = el })
                        )
                    : <></>
                }
            </div>
        </div>
    )
}