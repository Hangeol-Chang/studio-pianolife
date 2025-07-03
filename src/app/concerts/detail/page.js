'use client';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import getPageSize from '@/app/api/client/getPageSize';
import { Spacer } from '@/components/common/spacer';
import { Title1 } from '@/components/common/title';
import ResponsiveImage from '@/components/layout/responsiveImaage';
import YoutubeCarousel from '@/components/media/youtubeCarousel';
/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useEffect, useState } from "react";

export default function ConcertDetail() {
    const [mounted, setMounted] = useState(false);
    const [imageWidth, setImageWidth] = useState(300);
    const [concertInfo, setConcertInfo] = useState(null);

    const DescriptionContainer = styled.div`
        flex-grow: 2;
        display: flex;
        flex-direction: column;
        width: ${props => props.width};
    `;

    const PosterImage = styled(ResponsiveImage)`\
        display: flex;
        justify-content: center;
        margin: 10px auto;
        height: auto;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    `;

    useEffect(() => {
        console.log(concertInfo);
    }, [concertInfo]);

    const ReserveButton = styled.button`
        display: flex;
        justify-content: center;

        background-color: white;
        color: black;
        border: 1px solid black;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 12px;
        font-weight: lighter;
        transition: background-color 0.3s ease;
        margin: auto;
        &:hover {
            background-color: #333333;
            color: white;
        }
        &:active {
            background-color: #555555;
            color: white;
        }
        &:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(50, 50, 50, 0.5);
        }
    }`

    const InfoContiner = ({k, val}) => {
        console.log(k, val);
        return (
            <div css={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
            <div css={{ fontWeight: 'bold', marginRight: '10px' }}>{k}:</div>
                <div>{val}</div>
            </div>
        )
    }
    const resizeEvent = () => {
        const pageSize = getPageSize();
        setImageWidth(pageSize.width * 0.6);
    }

    useEffect(() => {
        setMounted(true);
        window.addEventListener('resize', resizeEvent);
        resizeEvent(); // 초기 크기 설정

        const data = localStorage.getItem('concertInfo');
        if (data) {
            setConcertInfo(JSON.parse(data));
            // localStorage.removeItem('concertInfo'); // 사용 후 삭제
        }

        return () => {
            window.removeEventListener('resize', resizeEvent);
        }
    }, []);

    return (
        mounted &&
        <div >
            {/* <p>Title: {new URLSearchParams(window.location.search).get('title')}</p> */}

            <Title1 title={concertInfo?.title} subTitle={concertInfo?.detail.subtitle}/>

            <PosterImage path="/concerts" name={concertInfo?.src} 
                width={imageWidth} height={0} alt={`poster_image`} layout="intrinsic"
            />
            <Spacer height={20} />
            <div
                css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: end;
                    margin-right: ${getPageSize().width * 0.2}px;
                `}
            >
                <InfoContiner k="Date" val={concertInfo?.date} />
                <InfoContiner k="Price" val={concertInfo?.price} />
                <InfoContiner k="Location" val={concertInfo?.location} />
                <Spacer height={20} />
                <InfoContiner k="Players" val={concertInfo?.players?.map(player => player.name).join(', ')} />
            </div>
            
            {/* url에서 now=true인지 검사 */}
            {new URLSearchParams(window.location.search).get('now') === 'true' && (
                <ReserveButton>
                    예매하러 가기
                </ReserveButton>
            )}

            <Spacer height={30} />
            <hr />
            <Spacer height={20} />

            <DescriptionContainer>
                {concertInfo?.detail.descriptions.map((line, i) => (
                    <p key={i}>
                        {line}
                    </p>
                ))}
            </DescriptionContainer>

            <hr />
            <Spacer height={20} />
            {
                concertInfo.videos.length > 0? <YoutubeCarousel videoInfos={concertInfo?.videos} />
                : <></>
            }   
            <Spacer height={60} />
        </div>
    );
}