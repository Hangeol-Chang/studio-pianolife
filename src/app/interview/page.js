
'use client';

import { Title1, Title2 } from '@/components/common/title';
import styles from './interview.module.scss';
import { YouTubeEmbed } from '@/components/media/youtube';
import { useState, useEffect } from 'react';
import { Spacer } from '@/components/common/spacer';

/*
raw data
[아마추어를 만나다]

음악을 전공하지는 않았지만 클래식 음악을 너무나도 좋아하여 자신의 열정을 다해 취미를 즐기고 있는 전국의 모든 아마추어를 만나 그들의 이야기와 연주를 들어보는 본격 인터뷰 컨텐츠

1. 수학자 황수연

: 아마추어를 만나다 첫번째 주인공! 전공생들도 힘겨워하는 브람스 소나타 3번 그것도 전악장에 도전하는 그의 열정. 연주회를 준비를 위한 그의 철저한 분석과 함께 음악에 대한 솔직 담백함이 느껴지는 그의 인터뷰와 스페셜 연주를 들어보세요!

https://youtu.be/cVxLS05Ki2Q

2. 프랑스어학부 신소희

: 구독자 19만명의 유튜브 채널 뮤라벨에서 카푸스틴 에튀드로 엄청난 주목을 받았던 주인공! 리듬, 파워, 테크닉 뭐 하나 빠질 것 없는 탄탄한 기본기의 그녀는 왜 불어를 전공하게 되었을까요? 그녀의 이야기와 거쉰 프렐류드를 들어보세요!

https://youtu.be/ki7ogEmeVDQ

3. 전기전자공학부 엄현서

: 아니 이제....아마추어도 국제 콩쿨이 있어?!? 프랑스 파리에서 열린 2024 Piano Link 콩쿨 수상자 엄현서님. 과연 그는 천재인가..아니면 노력형인가..일본의 비음대 출신 피아니스트 스미노 하야토를 연상케 하는 그의 연주와 이야기를 들어보세요!

https://youtu.be/BAaNn80jGBw

4. 공무원 김효재

: '공무원도 사람이랍니다😄' 공무원 스토리와 함께 누군가에게 감동을 주고 싶은 그녀의 음악에 대한 목표를 들어볼 수 있는 솔직 담백 인터뷰! 그녀가 연주하는 뱃노래와 에너지 가득한 인터뷰를 들어보세요!

https://youtu.be/bPOCjXCCSnM

5. AI 연구원 노준탁

: 2024년 9월 폴란드 바르샤바에서 울려퍼진 이름 '노준탁', 2015년 조성진 피아니스트가 우승한 쇼팽 콩쿠르의 아마추어 버전 쇼팽 국제 아마추어 콩쿠르에 참가하여 당당하게 입상한 그가 말해주는 본인의 취미 스토리! 슬프면서도 진중하고 아름다운 마주르카와 함께 그의 다양한 이야기를 들어보세요!

https://youtu.be/m69T4rR1vqM

*/

export default function Interview() {
    const [youtubeWidth, setYoutubeWidth] = useState(200);
    const [youtubeHeight, setYoutubeHeight] = useState(200);

    const resizeEvent = () => {
        const docWidth = document.documentElement.clientWidth;

        setYoutubeWidth(docWidth * 0.9);
        setYoutubeHeight(docWidth * 0.5);
    }

    useEffect(() => {
        resizeEvent();
        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('resize', resizeEvent);
        }
    }, [])

    return (
        <div>
            <Title1 title={"아마추어를 만나다"} subTitle={"interview"} />
            <div>
                <Spacer height={50} />
                <Title2 title={"수학자 황수현"} />
                <p>
                    아마추어를 만나다 첫번째 주인공! <br />
                    전공생들도 힘겨워하는 브람스 소나타 3번 그것도 전악장에 도전하는 그의 열정. <br />
                    연주회를 준비를 위한 그의 철저한 분석과 함께 음악에 대한 솔직 담백함이 느껴지는 그의 인터뷰와 스페셜 연주를 들어보세요!</p>
                <div className={styles.youtube_container}>
                    <YouTubeEmbed videoId="cVxLS05Ki2Q" width={youtubeWidth/3*2} height={youtubeHeight/3*2 + 5}/>
                </div>
            </div> 
            
            <div>
                <Spacer height={50} />
                <Title2 title={"프랑스어학부 신소희"} />
                <p>
                    구독자 19만명의 유튜브 채널 뮤라벨에서 카푸스틴 에튀드로 엄청난 주목을 받았던 주인공! <br />
                    리듬, 파워, 테크닉 뭐 하나 빠질 것 없는 탄탄한 기본기의 그녀는 왜 불어를 전공하게 되었을까요? <br />
                    그녀의 이야기와 거쉰 프렐류드를 들어보세요!
                </p>
                <div className={styles.youtube_container}>
                    <YouTubeEmbed videoId="ki7ogEmeVDQ" width={youtubeWidth/3*2} height={youtubeHeight/3*2 + 5}/>
                </div>
            </div>
            <div>
                <Spacer height={50} />
                <Title2 title={"전기전자공학부 엄현서"} />
                <p>
                    아니 이제....아마추어도 국제 콩쿨이 있어?!? <br />
                    프랑스 파리에서 열린 2024 Piano Link 콩쿨 수상자 엄현서님. <br />
                    과연 그는 천재인가..아니면 노력형인가..일본의 비음대 출신 피아니스트 스미노 하야토를 연상케 하는 그의 연주와 이야기를 들어보세요!
                </p>
                <div className={styles.youtube_container}>
                    <YouTubeEmbed videoId="BAaNn80jGBw" width={youtubeWidth/3*2} height={youtubeHeight/3*2 + 5}/>
                </div>
            </div>
            <div>
                <Spacer height={50} />
                <Title2 title={"공무원 김효재"} />
                <p>
                &rsquo;공무원도 사람이랍니다😄&rsquo; <br />
                    공무원 스토리와 함께 누군가에게 감동을 주고 싶은 그녀의 음악에 대한 목표를 들어볼 수 있는 솔직 담백 인터뷰! <br />
                    그녀가 연주하는 뱃노래와 에너지 가득한 인터뷰를 들어보세요!
                </p>
                <div className={styles.youtube_container}>
                    <YouTubeEmbed videoId="bPOCjXCCSnM" width={youtubeWidth/3*2} height={youtubeHeight/3*2 + 5}/>
                </div>
            </div>
            <div>
                <Spacer height={50} />
                <Title2 title={"AI 연구원 노준탁"} />
                <p>
                    2024년 9월 폴란드 바르샤바에서 울려퍼진 이름 &rsquo;노준탁&rsquo;, <br />
                    2015년 조성진 피아니스트가 우승한 쇼팽 콩쿠르의 아마추어 버전 쇼팽 국제 아마추어 콩쿠르에 참가하여 당당하게 입상한 그가 말해주는 본인의 취미 스토리! <br />
                    슬프면서도 진중하고 아름다운 마주르카와 함께 그의 다양한 이야기를 들어보세요!
                </p>
                <div className={styles.youtube_container}>
                    <YouTubeEmbed videoId="m69T4rR1vqM" width={youtubeWidth/3*2} height={youtubeHeight/3*2 + 5}/>
                </div>
            </div>


            <Spacer height={50} />
        </div> 
    )
}