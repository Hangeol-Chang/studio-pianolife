'use client';

import { useEffect, useState } from "react";

export default function Debug() {
    const [windowWidth, setWindowWidth] = useState(1280);
 
    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    }

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); }
    }, [])

    const boxStyle = {
        width : '100px',
        height : '100px',
   }

    return (
        <div>
            그냥 이것저것 테스트해보려고 만든 페이지입니다. 별 생각 없습니다.
            <div></div>
            {windowWidth}

            <div
                style={{
                    ...boxStyle,
                    backgroundColor : 'blue'
                }}
            ></div>
        </div>
    )
}