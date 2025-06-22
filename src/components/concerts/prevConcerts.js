'use client';
import styled from "@emotion/styled";
import ResponsiveImage from "../layout/responsiveImaage";
import { useRouter } from "next/navigation";

const ImageListContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 20px;
    gap: 20px;
    justify-content: space-around;
`;

const ConcertContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${props => props.width || '300px'};
`;

const PosterImage = styled(ResponsiveImage)`

    width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    &:hover {
        transform: scale(1.05);
    }
    margin-bottom: 10px;
    
    cursor: pointer;
`;

export default function PrevConcerts({ mediaInfos, imageWidth = 300 }) {
    const router = useRouter();

    return (
        <ImageListContainer>
            {mediaInfos.map((info, index) => (
                <ConcertContainer key={index} style={{ marginBottom: '20px' }}>
                    <PosterImage path="/concerts" name={info.src} 
                        width={imageWidth} height={0} alt={`concert_poster_${index}`} layout="intrinsic"
                        style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                        onClick={() => router.push(`/concerts/detail?title=${info.title}`)}
                    />
                    <div>[ {info.title} ]</div>
                </ConcertContainer>
            ))}
        </ImageListContainer>
    );
}