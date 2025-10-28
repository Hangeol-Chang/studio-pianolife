'use client';
/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import getPageSize from '@/app/api/client/getPageSize';
import { Spacer } from '@/components/common/spacer';
import { HrV, Title1, Title2, Title3, Title4, Title5 } from '@/components/common/title';
import ResponsiveImage from '@/components/layout/responsiveImaage';
import YoutubeCarousel from '@/components/media/youtubeCarousel';
/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useEffect, useState } from "react";
import ReserveForm from '@/components/concerts/reserveForm';

const PartedPlayerContainer = ({children, style}) => {
    const Container = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        ${style}
    `;

    return (
        <Container>
            {children}
        </Container>
    );
};

const PartedPlayerImageUnit = ({children, part, style}) => {

    const Container = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        ${style}
        flex-grow: 1;
        margin: 8px 0;
    `;

    const PartTitle = styled.h3`
        margin: 4px 4px 30px 4px;
        font-size: 18px;
        font-weight: bold;
    `;

    return (
        <Container>
            <PartTitle>{part}</PartTitle>
            {children}
        </Container>
    );
};

const PlayerImageUnit = ({playerName, playerImageName, width = 75}) => {
    const ImageContainer = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 8px ${getPageSize().width / 50}px;
        cursor: pointer;
        
        &:hover img {
            transform: scale(1.1);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        
        &:hover div {
            background-color: white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            color: black;
            transform: translateY(-2px);
            border: 4px solid white;
        }
    `;

    const PlayerImage = styled.img`
        width: ${width}px;
        height: ${width}px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    `;  

    const PlayerName = styled.div`
        font-size: 12px;
        font-weight: regular;
        padding: 2px 12px;
        border-radius: 22px;
        border: 4px solid black;
        margin: 4px;
        background-color: black;
        color: white;
        transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
    `;

    return (
        <ImageContainer>
            <PlayerImage
                src={`/profile/face/${playerImageName}.png`} 
                alt={playerName}
            />
            <PlayerName>
                {playerName}
            </PlayerName>
        </ImageContainer>
    );

}

const ProgramContainer = styled.div`
    margin: 0 5%;
    margin-bottom: 30px;
`;

export default function ConcertDetail() {
    const [mounted, setMounted] = useState(false);
    const [imageWidth, setImageWidth] = useState(300);
    const [concertInfo, setConcertInfo] = useState(null);

    const [reserveEnable, setReserveEnable] = useState(false);
    const [wideMode, setWideMode] = useState(false);
    const [concertInfoMargin, setConcertInfoMargin] = useState('0 5%');

    const [profileImageSize, setProfileImageSize] = useState(75);
    
    // 예매 가능 여부와 D-day 계산
    const [canReserve, setCanReserve] = useState(false);
    const [daysUntilReserve, setDaysUntilReserve] = useState(null);

    const PlayerContainer = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
        margin: ${concertInfoMargin};
    `;
    const TitleContainer = styled.div`
        margin: ${concertInfoMargin};

        & h2 {
            margin: 10px;
        }
    `

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
            height: 450px;
            opacity: 1;
        }
    `;

    const slideUp = keyframes`
        from {
            height: 450px;
            opacity: 1;
        }
        to {
            height: 0px;
            opacity: 0;
        }
    `;

    const ReserveContainer = styled.div`
        height: ${reserveEnable ? '450px' : '0px'};
        opacity: ${reserveEnable ? 1 : 0};
        overflow: hidden;
        margin: ${concertInfoMargin};
        
        /* 애니메이션은 상태 변경시에만 */
        animation: ${reserveEnable ? slideDown : slideUp} 0.5s ease forwards;
    `;

    const ReserveButton = styled.button`
        display: flex;
        justify-content: center;
        
        width: ${imageWidth}px;
        margin: ${concertInfoMargin};

        background-color: ${({ disabled }) => disabled ? '#e0e0e0' : 'white'};
        color: ${({ disabled }) => disabled ? '#999' : 'black'};
        border: 1px solid ${({ disabled }) => disabled ? '#ccc' : 'black'};
        border-radius: 2px;
        padding: 8px 16px;
        cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
        font-size: 12px;

        font-weight: light;
        transition: background-color 0.3s ease, color 0.3s ease;
        // margin: auto;
        &:hover {
            background-color: ${({ disabled }) => disabled ? '#e0e0e0' : '#333333'};
            color: ${({ disabled }) => disabled ? '#999' : 'white'};
        }
        &:active {
            background-color: ${({ disabled }) => disabled ? '#e0e0e0' : '#555555'};
            color: ${({ disabled }) => disabled ? '#999' : 'white'};
        }
        &:focus {
            outline: none;
            box-shadow: ${({ disabled }) => disabled ? 'none' : '0 0 0 2px rgba(50, 50, 50, 0.5)'};
        }
    `;

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
        
        if( pageSize.width > 500 ) { 
            setImageWidth(pageSize.width * 0.6);
            setWideMode(true); 
            setConcertInfoMargin('0 20%'); // 넓은 모드에서는 양쪽 여백을 20%로 설정
        }
        else { 
            setImageWidth(pageSize.width * 0.9);
            setWideMode(false); 
            setConcertInfoMargin('0 5%'); // 좁은 모드에서는 양쪽 여백을 5%로 설정
        }

        if(pageSize.width > 422) {
            setProfileImageSize(75);
        }
        else {
            setProfileImageSize(50);
        }
    }

    useEffect(() => {
        // 페이지 접근 시 스크롤을 맨 위로 이동
        window.scrollTo(0, 0);
        
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

    // 공연 날짜 기반으로 예매 가능 여부 계산
    useEffect(() => {
        if (concertInfo?.date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 시간 정보 제거
            
            // concertInfo.date 형식을 파싱 (예: "2025.10.26" 또는 "2025-10-26")
            const dateParts = concertInfo.date.split(/[.\-/]/);
            const concertDate = new Date(
                parseInt(dateParts[0]), // year
                parseInt(dateParts[1]) - 1, // month (0-based)
                parseInt(dateParts[2]) // day
            );
            
            // 날짜 차이 계산 (일 단위)
            const diffTime = concertDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays >= 1 && diffDays <= 32) {
                // 공연까지 1~32일 남음: 예매 가능
                setCanReserve(true);
                setDaysUntilReserve(null);
            } else if (diffDays >= 33 && diffDays <= 37) {
                // 공연까지 33~37일 남음: 예매까지 D-X일 표시
                setCanReserve(false);
                setDaysUntilReserve(diffDays - 32); // 예매 시작까지 남은 일수
            } else {
                // 그 외: 예매 불가
                setCanReserve(false);
                setDaysUntilReserve(null);
            }
        }
    }, [concertInfo]);

    return (
        mounted &&
        <div >
            {/* <p>Title: {new URLSearchParams(window.location.search).get('title')}</p> */}

            <Title1 title={concertInfo?.title} subTitle={concertInfo?.detail.subtitle}/>

            <PosterImage path="/concerts" name={concertInfo?.src} 
                width={imageWidth} height={0} alt={`poster_image`} layout="intrinsic"
            />
            <Spacer height={10} />

            <TitleContainer>
                <Title2 title="Players" />
            </TitleContainer>
            
            {
                Array.isArray(concertInfo.players) ?
                    <PlayerContainer>
                        {concertInfo.players.map((player, index) => 
                            <PlayerImageUnit 
                                key={player.name + index} 
                                playerName={player.name} playerImageName={player.name} 
                                width={profileImageSize}
                            />
                        )}
                    </PlayerContainer>
                    :
                    <PartedPlayerContainer style={{margin: concertInfoMargin}}>
                        {
                            Object.entries(concertInfo.players).map(([part, players], index) =>
                                <PartedPlayerImageUnit key={part + index} part={part} style={{width: '100%'}}>
                                    <hr style={{flexGrow: 1, margin: '8px 4px 34px 4px'}}/>
                                    <div style={{display: 'flex'}}>
                                        {players.map((player, idx) => 
                                            <PlayerImageUnit 
                                                key={player.name + idx} 
                                                playerName={player.name} playerImageName={player.name} 
                                                width={profileImageSize}
                                            />
                                        )}
                                    </div>
                                </PartedPlayerImageUnit>
                            )
                        }
                    </PartedPlayerContainer>
            }

            <Spacer height={10} />

            <TitleContainer>
                <hr style={{ margin: '10px 0' }}/>
            </TitleContainer>

            <Spacer height={10} />

            <div
                css={css`
                    display: flex;
                    flex-direction: column;
                    align-items: end;
                    margin: ${concertInfoMargin};
                `}
            >
                <InfoContiner k="Date" val={concertInfo?.date} />
                <InfoContiner k="Price" val={concertInfo?.price} />
                <InfoContiner k="Location" val={concertInfo?.location} />
            </div>
            
            {/* url에서 now=true인지 검사 */}
            {new URLSearchParams(window.location.search).get('now') === 'true' && (
                <div>
                    <ReserveButton 
                        onClick={() => canReserve && setReserveEnable((prev) => !prev)}
                        disabled={!canReserve}
                    >
                        {canReserve 
                            ? '예매하기' 
                            : daysUntilReserve 
                                ? 
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <div>
                                        예매 오픈까지
                                    </div>
                                    <div style={{fontSize: '20px', fontWeight: 'bold', marginTop: '4px'}}>
                                        D-{daysUntilReserve}
                                    </div>
                                </div>
                                : '예매 불가'}
                    </ReserveButton>
                    {canReserve && (
                        <ReserveContainer>
                            <ReserveForm concertInfo={concertInfo} />
                        </ReserveContainer>
                    )}
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


            {
                concertInfo?.detail.program ? 
                <>
                    <Title2 title="Program"/>
                    <ProgramContainer>
                        {Object.entries(concertInfo.detail.program).map(([part, details]) => (
                            <div key={part}>
                                <Title4 title={part} />
                                {details.items.map((item, index) => (
                                    <p key={item[0] + index} style={{ marginLeft: '20px' }}>
                                        {item}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </ProgramContainer>
                </>
                : <></>
            }

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