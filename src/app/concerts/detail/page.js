'use client';
import { Spacer } from '@/components/common/spacer';
import { Title1 } from '@/components/common/title';
import ResponsiveImage from '@/components/layout/responsiveImaage';
import YoutubeCarousel from '@/components/media/youtubeCarousel';
/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useEffect, useState } from "react";

export default function ConcertDetail() {
    const [mounted, setMounted] = useState(false);
    const [concertInfo, setConcertInfo] = useState(null);

    const DescriptionContainer = styled.div`
        flex-grow: 2;
        display: flex;
        flex-direction: column;
        width: ${props => props.width};
    `;

    const PosterImage = styled(ResponsiveImage)`
    `;

    useEffect(() => {
        console.log(concertInfo);
    }, [concertInfo]);

    useEffect(() => {
        setMounted(true);

        const data = localStorage.getItem('concertInfo');
        if (data) {
            setConcertInfo(JSON.parse(data));
            // localStorage.removeItem('concertInfo'); // 사용 후 삭제
        }
    }, []);

    return (
        mounted &&
        <div >
            {/* <p>Title: {new URLSearchParams(window.location.search).get('title')}</p> */}

            <Title1 title={concertInfo?.title} subTitle={concertInfo?.detail.subtitle}/>
            <p>This is the detail page for a specific concert.</p>

            <PosterImage path="/concerts" name={concertInfo?.src} 
                width={300} height={0} alt={`poster_image`} layout="intrinsic"
            />
            <Spacer height={20} />
            <div>{concertInfo?.date}</div>
            <div>{concertInfo?.price}</div>

            <DescriptionContainer>
                {concertInfo?.detail.descriptions.map((line, i) => (
                    <p key={i}>
                        {line}
                    </p>
                ))}
            </DescriptionContainer>

            <hr />
            <Spacer height={20} />
            <YoutubeCarousel videoInfos={concertInfo?.videos} />
        </div>
    );
}