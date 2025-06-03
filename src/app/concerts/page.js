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

const MainPosterContainer = styled.div`
    display: flex;
    flex-direction: ${props => props.viewColumn === 2 ? 'row' : 'column'};
    justify-content: center;
    align-items: ${props => props.viewColumn === 2 ? 'flex-start' : 'center'};
    margin: 20px;
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

export default function FourMusics() {
    const [posterWidth, setPosterWidth] = useState(300);
    const [prevPosterWidth, setPrevPosterWidth] = useState(300);
    const posterImageList = mediaInfos.map(info => info.src);
    const [viewColumn, setViewColumn] = useState(1);

    const resizeEvent = () => {
        const pageSize = getPageSize();
        setPosterWidth(pageSize.width * 0.5);
        
        let _prevPosterWidth = pageSize.width * 0.4;
        if( _prevPosterWidth < 300 ) _prevPosterWidth = 300;
        console.log("prevPosterWidth", _prevPosterWidth);

        setPrevPosterWidth(_prevPosterWidth);
        if( pageSize.width > 600 ) { setViewColumn(2); }
        else { setViewColumn(1); }
    }

    useEffect(() => {
        resizeEvent();

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

    return (
        <div>
            <Spacer height={20} />
            <Title1 title="Concerts" subTitle="" />

            <Spacer height={20} />
            <Title2 title="Now On" />

            <MainPosterContainer viewColumn={viewColumn}>
                <ResponsiveImage css={main_image_style}
                    path={"/concerts"} name={mediaInfos[mediaInfos.length - 1].src} 
                    width={posterWidth} height={0} alt="concert_poster" layout="intrinsic"
                />
                <DescriptionContainer width={viewColumn === 2 ? '100%' : `${posterWidth}px`}>
                    <div>
                        <h3>
                            {mediaInfos[mediaInfos.length - 1].title}
                        </h3>
                        <p>{mediaInfos[mediaInfos.length - 1].description}</p>
                        <p style={{ fontWeight : 'lighter'}}>
                            {mediaInfos[mediaInfos.length - 1].price}
                        </p>
                    </div>
                    <div css={css`
                        display: flex;
                        justify-content: flex-end;
                    `}>
                        <BuyButton>
                            buy ticket
                        </BuyButton>
                    </div>
                </DescriptionContainer>
            </MainPosterContainer>

            <Spacer height={50} />
            <hr></hr>
            <Spacer height={100} />
            <hr></hr>
            <Spacer height={50} />

            <PrevConcerts mediaInfos={mediaInfos} imageWidth={prevPosterWidth} />
        </div>
    )
}
