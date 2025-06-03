import styled from "@emotion/styled";
import ResponsiveImage from "../layout/responsiveImaage";

const ImageListContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 20px;
    gap: 20px;
    justify-content: space-around;
`;

export default function PrevConcerts({ mediaInfos, imageWidth = 300 }) {
    return (
        <ImageListContainer>
            {mediaInfos.map((info, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <ResponsiveImage path="/concerts" name={info.src} 
                        width={imageWidth} height={0} alt={`concert_poster_${index}`} layout="intrinsic"
                        style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                    />
                    <div>{info.title}</div>
                </div>
            ))}
        </ImageListContainer>
    );
}