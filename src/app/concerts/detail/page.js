'use client';
/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import getPageSize from '@/app/api/client/getPageSize';
import { Spacer } from '@/components/common/spacer';
import { Title1 } from '@/components/common/title';
import ResponsiveImage from '@/components/layout/responsiveImaage';
import YoutubeCarousel from '@/components/media/youtubeCarousel';
/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useEffect, useState } from "react";
import ReserveForm from '@/components/concerts/reserveForm';

export default function ConcertDetail() {
    const [mounted, setMounted] = useState(false);
    const [imageWidth, setImageWidth] = useState(300);
    const [concertInfo, setConcertInfo] = useState(null);

    const [reserveEnable, setReserveEnable] = useState(false);

    const PlayerContainer = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: left;
        margin: 0 20%;
    `;
    
    const PlayerRow = styled.div`
        display: flex;
    `;

    const PlayerName = styled.div`
        font-size: 12px;
        font-weight: regular;
        padding: 2px 10px;
        border-radius: 22px;
        border: 4px solid black;
        margin: 4px;

        background-color: black;
        color: white;
    `;

    const DescriptionContainer = styled.div`
        flex-grow: 2;
        display: flex;
        flex-direction: column;
        width: ${props => props.width};
    `;

    const PosterImage = styled(ResponsiveImage)`
        display: flex;
        justify-content: center;
        margin: 10px auto;
        height: auto;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    `;

    const slideDown = keyframes`
        from {
            height: 0px;
            opacity: 0;
        }
        to {
            height: 380px;
            opacity: 1;
        }
    `;

    const slideUp = keyframes`
        from {
            height: 380px;
            opacity: 1;
        }
        to {
            height: 0px;
            opacity: 0;
        }
    `;

    const ReserveContainer = styled.div`
        height: ${reserveEnable ? '380px' : '0px'};
        opacity: ${reserveEnable ? 1 : 0};
        overflow: hidden;
        margin: 0 20%;
        
        /* 애니메이션은 상태 변경시에만 */
        animation: ${reserveEnable ? slideDown : slideUp} 0.5s ease forwards;
    `;

    const ReserveButton = styled.button`
        display: flex;
        justify-content: center;
        
        width: 60%;
        margin: 0 20%;

        background-color: white;
        color: black;
        border: 1px solid black;
        border-radius: 2px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 12px;

        font-weight: light;
        transition: background-color 0.3s ease;
        // margin: auto;
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
            <Spacer height={10} />

            {
                // concertInfo.players.length > 4 ? 
                // <PlayerContainer>
                //     <PlayerRow>
                //         {concertInfo.players.slice(0, concertInfo.players.length / 2).map((player, index) => 
                //             <PlayerName key={index + player.name}>
                //                 {player.name}
                //             </PlayerName>
                //         )}
                //     </PlayerRow>
                //     <PlayerRow>
                //         {concertInfo.players.slice(concertInfo.players.length / 2).map((player, index) => 
                //             <PlayerName key={index + player.name}>
                //                 {player.name}
                //             </PlayerName>
                //         )}
                //     </PlayerRow>
                // </PlayerContainer>
                // :
                <PlayerContainer>
                    {concertInfo.players.map((player, index) => 
                        <PlayerName key={index + player.name}>
                            {player.name}
                        </PlayerName>
                    )}
                </PlayerContainer>

            }
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
            </div>
            
            {/* url에서 now=true인지 검사 */}
            {new URLSearchParams(window.location.search).get('now') === 'true' && (
                <div>
                    <ReserveButton onClick={() => setReserveEnable((prev) => !prev)}>
                        예매하기
                    </ReserveButton>
                    <ReserveContainer>
                        <ReserveForm concertInfo={concertInfo} />
                    </ReserveContainer>
                </div>
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