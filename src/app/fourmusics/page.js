'use client';
/** @jsxImportSource @emotion/react */

import { Spacer } from "@/components/common/spacer";
import { Title1, Title2 } from "@/components/common/title";
import { useEffect, useState } from "react";
import getPageSize from "../api/client/getPageSize";
import Carousel2 from "@/components/layout/carousel2";
import { css } from "@emotion/react";
import { mediaInfos } from "./media.json";
import { SP } from "next/dist/shared/lib/utils";

export default function Concerts() {
    const [posterWidth, setPosterWidth] = useState(300);

    const posterImageList = mediaInfos.map(info => info.src);

    const poster_click_info_style = css`
        font-size: 0.8em;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 2px 10px;
        text-align: center;
        justify-content: center;
        position: absolute;
        bottom: 20px;
        z-index: 6;
    `
    const resizeEvent = () => {
        const pageSize = getPageSize();
        setPosterWidth(pageSize.width * 0.4);
    }

    useEffect(() => {
        resizeEvent();

        window.addEventListener('resize', resizeEvent);
        return () => {
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
                언젠가 예술의 전당 무대에 올라볼 수 있는 순간을 공통 목표로 모인
            </p>
            <p> 
                4명의 직장인 아마추어 피아노 앙상블
            </p>

            {/* <a href="/fourmusics/media"> */}
                <div style={{position: 'relative',}}>
                    <Carousel2
                        imageList={posterImageList}
                        imageWidth={posterWidth}
                    >
                    </Carousel2>
                    {/* <div css={poster_click_info_style}>
                        포스터 클릭 시 관련 미디어로 연결됩니다.
                    </div> */}
                </div>
            {/* </a> */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <a href="/fourmusics/media">
                    연주영상 보러가기 ▷
                </a>
            </div>

            <Spacer height={20} />
            <Title2 title="Introduction"/>
            <p>
                포뮤직스는 2023년 12월 Four Colors for Chopin을 시작으로,
            </p>
            <p>
                매 연주회마다 하나의 주제 아래 네 명의 연주자가 각기 다른 색깔의 컨셉을 담아 무대를 꾸미고 있습니다.
            </p>
            <br />
                
            <p>
                현재 포뮤직스의 연주 영상과 인터뷰는 유튜브 공피라 채널에서 공개되고 있으며,
            </p>
            <p>
                무대 위에서의 열정적인 순간을 생생하게 담아내고 있습니다.
            </p>
            <p>
                특히, 일상에서 벗어나 음악이라는 공통된 꿈을 향해 나아가는 직장인 연주자들의 모습은 많은 이들에게 공감과 감동을 전하고 있습니다.
            </p>

            <Spacer height={20} />
            <hr></hr>
            <Spacer height={20} />
            <p>
                포뮤직스는 단순히 하나의 목표를 향해 나아가는 것이 아니라,
            </p>
            <p>
                그 여정 속에서 음악적 도전을 이어가며 스스로의 한계를 뛰어넘고자 합니다.
            </p>
            <p>
                매번 새로운 곡과 테마를 선정하여 깊이 있는 해석과 개성을 담아내며,
            </p>
            <p>
                이를 통해 또 다른 예술적 가능성을 탐색하고 있습니다.
            </p>
            <p>
                이러한 과정 속에서 연주자들은 한층 더 성장하고, 새로운 무대를 만들어가는 기쁨을 느끼고 있습니다.
            </p>

            <Spacer height={20} />
            <hr></hr>
            <Spacer height={20} />
            <p>
                앞으로도 포뮤직스는 다양한 레퍼토리와 창의적인 기획을 통해 더 많은 사람들에게 감동을 선사하고자 합니다. 
            </p>
            <p>
                음악을 사랑하는 사람들이 모여 함께 만들어가는 이 도전의 여정은 계속될 것이며,
            </p>
            <p>
                포뮤직스만의 색깔을 담은 무대는 더욱 다채롭게 펼쳐질 것입니다.
            </p>
            <p>
                앞으로의 포뮤직스의 여정에 많은 관심과 응원 부탁드립니다!
            </p>


            <Spacer height={20} />
            <Title2 title="Gallary" subTitle="포뮤직스 연주영상" />
            {/* Youtube List 추가될 예정. */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <a href="/fourmusics/media">
                    더 많은 연주영상 보러가기 ▷
                </a>
            </div>
            <Spacer height={20} />
        </div>
    )
}