'use client';
/** @jsxImportSource @emotion/react */

import { Spacer } from "@/components/common/spacer";
import { Title1, Title2, Title3, Title4 } from "@/components/common/title";
import { useEffect, useState } from "react";
import getPageSize from "../api/client/getPageSize";
import { css } from "@emotion/react";
import { mediaInfos } from "./media.json";
import ResponsiveImage from "@/components/layout/responsiveImaage";
import styled from '@emotion/styled';
import PrevConcerts from "@/components/concerts/prevConcerts";
import { useRouter } from "next/navigation";

const MainPosterContainer = styled.div`
    display: flex;
    flex-direction: ${props => props.viewColumn === 2 ? 'row' : 'column'};
    justify-content: center;
    align-items: ${props => props.viewColumn === 2 ? 'flex-start' : 'center'};
    margin: 0px min(5vw, 38.4px);
`;
const DescriptionContainer = styled.div`
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    width: ${props => props.width};
`;

const BuyButton = styled.button`
    background-color: white;
    color: black;
    border: 1px solid black;
    padding: 8px 16px;  
    cursor: pointer;
    font-size: 12px;
    font-weight: lighter;
    transition: background-color 0.3s ease;
    margin-right: 20px;

    &:hover {
        // background-color: #6fa8c9;
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
    margin-top: 10px;
    align-self: flex-end;
`;

const NoUpcomingContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0px min(5vw, 38.4px);
    padding: 60px 20px;
    border-radius: 10px;
    background-color: #f9f9f9;
    text-align: center;
`;

const NoUpcomingText = styled.div`
    font-size: 18px;
    color: #666;
    line-height: 1.6;
    
    h3 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 20px;
    }
    
    p {
        margin: 0;
        font-weight: lighter;
    }
`;

const MainPosterImage = styled(ResponsiveImage)`
    width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
    }
`;

export default function FourMusics() {
    const [posterWidth, setPosterWidth] = useState(300);
    const [prevPosterWidth, setPrevPosterWidth] = useState(300);
    const [viewColumn, setViewColumn] = useState(1);
    const [currentConcert, setCurrentConcert] = useState(null);
    const [previousConcerts, setPreviousConcerts] = useState([]);
    const router = useRouter();
    

    const resizeEvent= () => {
        const pageSize = getPageSize();
        setPosterWidth(pageSize.width * 0.5);
        
        let _prevPosterWidth = pageSize.width * 0.4;
        if( _prevPosterWidth < 300 ) _prevPosterWidth = 300;

        setPrevPosterWidth(_prevPosterWidth);
        if( pageSize.width > 600 ) { setViewColumn(2); }
        else { setViewColumn(1); }
    }

    const categorizeEvents = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
        
        let upcomingConcert = null;
        let pastConcerts = [];
        
        // 날짜순으로 정렬 (가장 최근 날짜부터)
        const sortedConcerts = [...mediaInfos].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });
        
        // 미래 콘서트와 과거 콘서트 분류
        console.log("prev concerts checking")
        sortedConcerts.forEach(concert => {
            const concertDate = new Date(concert.date);
            concertDate.setHours(0, 0, 0, 0);
            
            if (concertDate >= today) {
                // 미래 콘서트 중 가장 가까운 것을 현재 콘서트로 설정
                if (!upcomingConcert) {
                    upcomingConcert = concert;
                } else {
                    pastConcerts.push(concert);
                }
            } else {
                pastConcerts.push(concert);
            }
        });
        
        setCurrentConcert(upcomingConcert);
        setPreviousConcerts(pastConcerts);
    };

    useEffect(() => {
        resizeEvent();
        categorizeEvents();

        window.addEventListener('resize', resizeEvent);
        return () => {
            window.removeEventListener('resize', resizeEvent);
        }
    }, []);

    const main_image_style = css`
        width: ${posterWidth}px;
        height: auto;
        margin: 0 auto;
        display: block;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        flex-grow : 1,
    `;

    const loadDetailPage = () => {
        if (currentConcert) {
            localStorage.setItem('concertInfo', JSON.stringify(currentConcert));
            router.push('/concerts/detail?now=true');
        }
    }

    return (
        <div>
            <Spacer height={20} />
            <Title1 title="Concerts" subTitle="" />

            <Spacer height={20} />
            <Title2 title="Now On" />

            {currentConcert ? (
                <MainPosterContainer viewColumn={viewColumn}>
                    <MainPosterImage css={main_image_style}
                        path={"/concerts"} name={currentConcert.src} 
                        width={posterWidth} height={0} alt="concert_poster" layout="intrinsic"
                        onClick={loadDetailPage}
                    />
                    <DescriptionContainer width={viewColumn === 2 ? '100%' : `${posterWidth}px`}>
                        <div>
                            <h3>
                                {currentConcert.title}
                            </h3>
                            <p>{currentConcert.description || currentConcert.detail?.subtitle}</p>
                            <p style={{ fontWeight : 'lighter'}}>
                                {currentConcert.price}
                            </p>
                        </div>
                        <div css={css`
                            display: flex;
                            justify-content: flex-end;
                        `}>
                            <BuyButton onClick={loadDetailPage}>
                                buy ticket
                            </BuyButton>
                        </div>
                    </DescriptionContainer>
                </MainPosterContainer>
            ) : (
                <NoUpcomingContainer>
                    <NoUpcomingText>
                        <h3>예정된 콘서트가 없습니다</h3>
                        <p>다음 콘서트를 기대해주세요!</p>
                    </NoUpcomingText>
                </NoUpcomingContainer>
            )}

            <Spacer height={50} />
            <hr></hr>
            <Spacer height={50} />
            <Title2 title="Previous Concerts" />

            <PrevConcerts mediaInfos={previousConcerts} imageWidth={prevPosterWidth} />
        </div>
    )
}
