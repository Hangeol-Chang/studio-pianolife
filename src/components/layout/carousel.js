import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './carousel.module.scss';
import getScrollProgress from '@/app/api/client/getScrollProgress';

const images = [
  '/gallary/gallary_1.jpg',
  '/gallary/gallary_2.jpg',
  '/gallary/gallary_3.jpg',
  '/gallary/gallary_4.jpg',
];

export default function Carousel() {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const carouselRef = useRef(null);
    const [imageTop, setImageTop] = useState(-100);
    const [imageScale, setImageScale] = useState(1);

    const updateScrollBar = () => {
        const scrollData = getScrollProgress();       
        let topPos = carouselRef.current.getBoundingClientRect().top - 500;
        if(topPos < 0) {  
            setImageTop(-100 + topPos * 0.4); 
            // setImageScale(1 - topPos * 0.0001);
        }
    }

    const onMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 3; // multiplier to adjust the speed
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    // const onMouseLeave = () => {
    //     setIsDragging(false);
    // };

    const onClickCarouselButton = (direction) => {
        if (carouselRef.current) {
            // 요소의 width 가져오기
            const { width } = carouselRef.current.getBoundingClientRect();
            carouselRef.current.scrollLeft += direction * (width + 20);
        }

    };

    useEffect(() => {
        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);
        return () => {
            window.removeEventListener('scroll', updateScrollBar);
            window.removeEventListener('resize', updateScrollBar);
        };
        images = document.querySelectorAll('.image');

    }, []);

    return (
        <div className={styles.carousel_container}>
            <div 
                className={styles.carousel_button} style={{left: 0, textAlign: 'left'}}
                onClick={() => onClickCarouselButton(-1)}
            >
                ◁
            </div>
            <div className={styles.carousel_button} style={{right: 0, textAlign: 'right'}}
                onClick={() => onClickCarouselButton(1)}
            >
                ▷
            </div>

            <div
                className={styles.carousel_image_container}
                ref={carouselRef}
            >
                {images.map((src, index) => (
                    <div key={src} className={styles.image_wrapper}>
                    <Image src={src}  alt={`Image ${index + 1}`} layout="intrinsic"
                        width={1000} height={300} objectFit="cover" 
                        style={{
                            position: 'absolute',
                            top: imageTop,
                            zIndex: 0,
                            scale: imageScale,
                        }}
                    />
                    </div>
                ))}
            </div>
        </div>
    );
}
