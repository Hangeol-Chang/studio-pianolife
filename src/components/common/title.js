import { Note } from '../music/sheet.js';
import { LongSheet, MediumSheet, ShortSheet } from '../music/sheetPreset.js';

const Title1 = ({title, subTitle, idf=1}) => {
    return (
        <div className={'title-text'}>
            <h1>{title}</h1>
            <div >
                <div className='music-sheet-container-single'>
                    <hr className={'music-sheet-line-single'}/>
                    <Note index={21} width={20} left={'1vw'} top={-25} />
                    <MediumSheet idf={idf} />
                </div>
            </div>
            <h3>{subTitle}</h3>
        </div>
    )
}

const Title2 = ({title, idf=1}) => {
    return (
        <>
            <h2>
                {title}
                <div className='music-sheet-container-single'>
                    <hr className={'music-sheet-line-single-light'}/>
                    <ShortSheet idf={idf} />
                </div>
                
            </h2>

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