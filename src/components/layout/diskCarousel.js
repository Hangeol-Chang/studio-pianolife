'use client';

import YoutubeCarousel2 from '../media/youtubeCarousel2';
import styles from './diskCarousel.module.scss'
import { useEffect, useRef, useState } from 'react';

export default function DiskCarousel({ mediaInfos, imageSize, nowIndex }) {
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

    useEffect(() => {
        const nextIndex = (nowIndex + 1) % imageList.length;
        const prevIndex = (nowIndex - 1 + imageList.length) % imageList.length;

        if(isMounted) {
            diskRefs.current.forEach((element, index) => {
                if (index == nowIndex) {
                    element.classList.add(styles.disk_main);
                    element.classList.remove(styles.disk_top);
                    element.classList.remove(styles.disk_bot);
                }
                else if (index == prevIndex) {  // top
                    element.classList.add(styles.disk_top);
                    element.classList.remove(styles.disk_bot);
                    element.classList.remove(styles.disk_main);
                }
                else if (index == nextIndex) {  // bot
                    element.classList.add(styles.disk_bot);
                    element.classList.remove(styles.disk_top);
                    element.classList.remove(styles.disk_main);
                }
            });
        }
    } , [nowIndex]);

    useEffect(() => {
        console.log('imageList', imageList);
        console.log('diskRefs', diskRefs.current);
        if(isMounted) {
            diskRefs.current[0].classList.add(styles.disk_main);
            diskRefs.current[1].classList.add(styles.disk_bot);
            diskRefs.current[2].classList.add(styles.disk_top);
        }
    }, [imageList]);

    return (
        <div  style={{ display: 'flex' }}>
            <div className={styles.disk_container}
            
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
                        imageList.map((image, index) => (
                            <div 
                                key={image + index}
                                ref={(el) => diskRefs.current[index] = el}
                                className={[styles.disk].join(' ')} alt="disc" 
                                style={{ width: imageSize, height: imageSize }}
                            >
                                <img 
                                    className={styles.disk}
                                    src={image} alt="disc" 
                                    style={{ width: imageSize, height: imageSize }}
                                />
                                <div
                                    className={styles.disk_hole}
                                    style={{
                                        width: imageSize*0.2,
                                        height: imageSize*0.2,
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        zIndex: 2,
                                    }}
                                >
                                </div>
                            </div>
                        ))
                    : <></>
                }
                {
                    isMounted ?
                        <YoutubeCarousel2 
                            videoIds={mediaInfos[0].videos}
                            videoWidth={imageSize * 2}
                            changeInterval={3000}
                        />
                    : <></>
                }

            </div>
        </div>
    )
}