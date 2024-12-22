import { Note, VerticalLineSingle } from '../music/sheet.js';


const Title1 = ({title, subTitle, }) => {
    return (
        <div className={'title-text'}>
            <h1>{title}</h1>
            <div 
                style={{
                    height: '1px',
                }}
            >
                {/* <div className={'music-sheet'} */}
                <div
                    style={{
                            position: "relative",
                            width: '100%',
                        }}
                    >
                    <hr className={'music-sheet-line-single'}/>

                    {/* 이렇게 많이 넣지 말고, 한마디씩 가능한걸로 ㄱㄱ */}

                    <Note index={21} width={20} left={'1vw'} top={-25} />
                    
                    <div
                        style={{
                            width: 'min(30vw, 200px)',
                            right: '0',
                            position: 'absolute',
                        }}
                    >
                        <Note index={7} width={20} left={0} top={-20} />
                        <VerticalLineSingle left={40} top={-7.5} />

                        <Note index={1} width={12} left={55} top={-30} />
                        <Note index={3} width={18} left={80} top={-15} flip={true} />
                        <Note index={14} width={40} left={100} top={-10} />
                        <Note index={3} width={18} left={155} top={-20} flip={true} />
                        <VerticalLineSingle left={180} top={-7.5} />

                    </div>
                </div>
            </div>
            <h3>{subTitle}</h3>
        </div>
    )
}

const Title2 = ({title, }) => {
    return (
        <>
            <h2>{title}</h2>
            <hr />
        </>
    )
}
const Title3 = () => {
    
}
const Title4 = () => {
    
}
const Title5 = () => {
    
}
const Title6 = () => {
    
}



export {
    Title1,
    Title2,
    Title3,
    Title4,
    Title5,
    Title6,

}