'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './carousel2.module.scss'
import getPageSize from '@/app/api/client/getPageSize';
import Image from 'next/image';

export default function Carousel2({ imageList, imageWidth }) {
    // check mountecd
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { 
        setIsMounted(true); 
        return () => { setIsMounted(false);  }
    }, []);


    const [imageContainerWidth, setImageContainerWidth] = useState(1000);

    const [imageIndex, setImageIndex] = useState(0);
    const imageRefs = useRef([]);
    const imageContainerRef = useRef(null);

    useEffect(() => {
        const pageSize = getPageSize();
        setImageContainerWidth(
            pageSize.width * 0.4 * imageList.length 
            + 20 * (imageList.length - 1)
        );
    }, [imageWidth])

    
    useEffect(() => {
        const containerX = 
            0.5*getPageSize().width - (imageIndex+0.5) * imageWidth 
            - (imageList.length-1) * 10;

        imageContainerRef.current.style.left = `${containerX}px`;
        console.log(imageRefs.current);

        imageRefs.current.forEach((element, index) => {
            console.log("element", element, index, imageIndex);
            if (index == imageIndex) {
                console.log("add", index, element);
                element.classList.add(styles.image_main);
            }
            else {
                element.classList.remove(styles.image_main);
            }
        });
        setTimeout(() => changeimageIndex(), 5000);
    }, [imageIndex]);

    const changeimageIndex = () => {
        setImageIndex((imageIndex + 1) % imageList.length);
    }

    // 최초 1회 로딩될 때 수동으로 지정해줘야 함.
    useEffect(() => {
        if(isMounted) imageRefs.current[0].classList.add(styles.image_main);
    }, [isMounted]);

    return(
        <div 
            className={styles.carousel_container}
            ref={imageContainerRef}
            style={{
                width: `${imageContainerWidth}px`,
                height: `${imageWidth*2.2}px`,
            }}
        >
            {
                isMounted ? 
                    imageList.map((src, index) => (
                        <Image className={styles.image}
                            key={src+index}
                            ref={(el) => imageRefs.current[index] = el} // 각 iframe에 ref 할당
                            src={src} alt="piano" 
                            width={imageWidth} height={0} layout="intrinsic"
                        />
                    ))
                : null
            }
        </div>
    )
}