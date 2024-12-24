import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from './carousel.module.scss';

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

    const [wid, setWidth] = useState(0);

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

    const onMouseLeave = () => {
        setIsDragging(false);
    };


    return (
        <div
            className={styles.carousel_container}
            ref={carouselRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
        {images.map((src, index) => (
            <div key={src} className={styles.image_wrapper}>
            <Image 
                src={src} 
                alt={`Image ${index + 1}`} 
                layout="intrinsic"
                width={1000} height={300}
                objectFit="cover" // to make sure the image covers the entire space
            />
            </div>
        ))}
        </div>
    );
}
