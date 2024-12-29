import { Note } from '../music/sheet.js';
import { LongSheet, MediumSheet, ShortSheet } from '../music/sheetPreset.js';
import sheetStyles from '@/components/music/sheet.module.scss';


const Title1 = ({title, subTitle, idf=1}) => {
    return (
        <div>
            <h1>{title}</h1>
            <div >
                <div className={sheetStyles.music_sheet_container_single}>
                    <hr className={sheetStyles.music_sheet_line_single}/>
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
        <h2>
            {title}
            <div className={sheetStyles.music_sheet_container_single}>
                <hr className={sheetStyles.music_sheet_line_single_light}/>
                <ShortSheet idf={idf} />
            </div>
        </h2>
    )
}
const Title3 = ({title}) => {
    return (
        <h3>
            {title}
            <hr 
                style={{
                    width: '30%',
                    margin: '1px 0px',
                }}
            />
        </h3>
    )
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