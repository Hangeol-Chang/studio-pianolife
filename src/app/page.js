'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import './page.module.scss';
import { Title1, Title2 } from "@/components/common/title";
import Carousel from "@/components/layout/carousel";
import { Spacer } from "@/components/common/spacer";

export default function Home() {

    // const updateScrollBar = () => {
    //     // scrollPosition, scrollPercent
    //     const scrollData = getScrollProgress();
    // }
    
    useEffect(() => {
        // window.addEventListener('scroll', updateScrollBar);
        // window.addEventListener('resize', updateScrollBar);
        // return () => {
        //     window.removeEventListener('scroll', updateScrollBar);
        //     window.removeEventListener('resize', updateScrollBar);
        // }

    }, [])


    return (
        <div>
            <Spacer height={'30px'} />
            <Title1 title={'공 피 라'} subTitle={'공대생의 Piano Life'} />

            <div style={{height:'100px'}}></div>
            <Title2 title={'Who Am I?'} idf={1} />
            <p>
                안녕하세요, 저는 피아니스트 A입니다.<br />
                다양한 연주회를 통해 관객들에게 음악의 아름다움을 전하고 있습니다.<br /><br />
                솔로 리사이틀부터 오케스트라 협연, 테마 음악회까지<br />
                각 공연마다 새로운 이야기를 담아 무대에 오르고 있습니다.<br />
                특히, 클래식 음악의 깊이를 전달하는 동시에 현대적인 해석을 더해<br />
                연주를 통해 사람들의 마음을 움직이는 것을 목표로 하고 있습니다.<br /><br />
                무대 위에서 관객과 교감하는 순간은 제가 음악을 계속하는 이유입니다.
            </p>
            <Spacer height={'100px'} />

            <Title2 title={'What I Do'} idf={2} />
            <p>
                저는 음악 스튜디오를 운영하며 다양한 음악적 활동을 이어가고 있습니다.<br />
                스튜디오에서는 녹음, 편곡, 연주 영상 제작과 같은 서비스를 제공하며,<br />
                음악을 사랑하는 분들과 함께 작업하는 시간을 소중히 여기고 있습니다.<br /><br />
                또한, 음악을 배우고자 하는 분들을 위한 맞춤형 레슨을 진행하며,<br />
                제 경험과 기술을 나누고자 노력하고 있습니다.<br /><br />
                스튜디오에서의 활동은 저에게 새로운 영감과 도전의 기회를 선사합니다.
            </p>
            <Spacer height={'100px'} />

            <Title2 title={'Gallary'} idf={3} />
            <Carousel />

            <div className={'description-container'}
                style={{
                    height: '3000px',
                    backgroundColor: '#DDDDDD',
                }}
            >
                <div
                    style={{
                        padding: '20px',
                    }}
                >
                    스크롤 테스트를 위한 더미입니다.
                </div>
            </div>

        </div>
    )
}