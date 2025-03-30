'use client';

import { Spacer } from "@/components/common/spacer";
import { Title1, Title2, Title4 } from "@/components/common/title";
import Image from "next/image";
import styles from "./fourmusics.module.scss";
import { useEffect, useRef, useState } from "react";
import getScrollProgress from "../api/client/getScrollProgress";
import getPageSize from "../api/client/getPageSize";
import { YouTubeEmbed } from "@/components/media/youtube";
import Carousel2 from "@/components/layout/carousel2";

export default function FourMusics() {
    const [posterWidth, setPosterWidth] = useState(300);

    const posterImageList = [
        "/fourmusics/fourmusics_poster_1.jpg",
        "/fourmusics/fourmusics_poster_2.jpg",
        "/fourmusics/fourmusics_poster_3.jpg"
    ]
    
    const updateScrollBar = () => {
        const scrollData = getScrollProgress();
    }
    const resizeEvent = () => {
        const pageSize = getPageSize();
        setPosterWidth(pageSize.width * 0.4);
    }

    useEffect(() => {
        const pageSize = getPageSize();
    }, [posterWidth])

    useEffect(() => {
        resizeEvent();

        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);
        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('scroll', updateScrollBar);
            window.removeEventListener('resize', updateScrollBar);
            window.removeEventListener('resize', resizeEvent);
        }
    }, []);

    return (
        <div>
            <Spacer height={20} />
            <Title1 title="포뮤직스" subTitle="Four Musics" />

            <Spacer height={20} />
            <Title2 title="Concerts" />

            <p>
                언젠가 예술의 전당 무대에 올라볼 수 있는 순간을 공통 목표로 하여 모인 4명의 직장인 아마추어 피아노 앙상블
            </p>

            <Carousel2
                imageList={posterImageList}
                imageWidth={posterWidth}
            />

            <Spacer height={20} />
            <Title2 title="Introduction"/>
            <p>
                포뮤직스는 2023년 12월 Four Colors for Chopin을 시작으로, <br />
                매 연주회마다 하나의 주제 아래 네 명의 연주자가 각기 다른 색깔의 컨셉을 담아 무대를 꾸미고 있습니다. <br />
                <br /><br />
                
                현재 포뮤직스의 연주 영상과 인터뷰는 유튜브 공피라 채널에서 공개되고 있으며, <br />
                무대 위에서의 열정적인 순간을 생생하게 담아내고 있습니다. <br />
                특히, 일상에서 벗어나 음악이라는 공통된 꿈을 향해 나아가는 직장인 연주자들의 모습은 많은 이들에게 공감과 감동을 전하고 있습니다. <br />
                <br /><br />

                포뮤직스는 단순히 하나의 목표를 향해 나아가는 것이 아니라, <br />
                그 여정 속에서 음악적 도전을 이어가며 스스로의 한계를 뛰어넘고자 합니다. <br />
                매번 새로운 곡과 테마를 선정하여 깊이 있는 해석과 개성을 담아내며, <br />
                이를 통해 또 다른 예술적 가능성을 탐색하고 있습니다. <br />
                이러한 과정 속에서 연주자들은 한층 더 성장하고, 새로운 무대를 만들어가는 기쁨을 느끼고 있습니다.
                <br /><br />

                앞으로도 포뮤직스는 다양한 레퍼토리와 창의적인 기획을 통해 더 많은 사람들에게 감동을 선사하고자 합니다. <br />
                음악을 사랑하는 사람들이 모여 함께 만들어가는 이 도전의 여정은 계속될 것이며, <br />
                포뮤직스만의 색깔을 담은 무대는 더욱 다채롭게 펼쳐질 것입니다. <br /> 
                앞으로의 포뮤직스의 여정에 많은 관심과 응원 부탁드립니다! <br />
                <br /><br />
            </p>

            <Spacer height={40} />
            <Title2 title="Gallary" subTitle="포뮤직스 연주영상" />
            <div style={{margin: '2% 10%'}}>
                <YouTubeEmbed videoId="ki7ogEmeVDQ" width={'100%'} height={'auto'}/>
            </div>

            <Spacer height={20} />
        </div>
    )
}