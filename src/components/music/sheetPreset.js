'use client';

import { Note, VerticalLineSingle } from "./sheet";

const ShortSheet = ({idf = 1,}) => {
    let content;
    switch(idf) {
    case 1:
        content = (
            <>
                <Note index={1} width={12} left={100} top={-15} flip={true} />
                <Note index={12} width={28} left={120} top={-10} />
                <Note index={3} width={18} left={165} top={-20} flip={true} />
            </>
        );
        break;
    case 2:
        content = (
            <div>
                <Note index={4} width={20} left={100} top={-28} />
                <Note index={24} width={15} left={130} top={-10} />
                <Note index={13} width={48} left={150} top={-20}/>
            </div>
        );
        break;
    case 3:
        content = (
            <div>
                <Note index={10} width={33} left={100} top={-24} />
                <Note index={11} width={33} left={150} top={-15} flip={true} />
                <Note index={24} width={15} left={190} top={-10} />
            </div>
        );
    }

    return (
        <div 
            style={{
                width: 'min(30vw, 200px)',
                position: 'absolute',
                right: '0',
            }}
        >
            {content}
        </div>
    );
};

const MediumSheet = ({idf = 1, }) => {
    let content;
    switch(idf) {
    case 1:
        content = (
            <>
                <Note index={7} width={20} left={0} top={-20} />
                <VerticalLineSingle left={40} top={-7.5} />

                <Note index={1} width={12} left={55} top={-30} />
                <Note index={3} width={18} left={80} top={-15} flip={true} />
                <Note index={14} width={40} left={100} top={-10} />
                <Note index={3} width={18} left={155} top={-20} flip={true} />
                <VerticalLineSingle left={180} top={-7.5} />
            </>
        );
        break;
    case 2:
        content = (
            <div>
                <h1>Medium Sheet 2</h1>
                <p>Sheet 2 content</p>
            </div>
        );
        break;
    }
    return (
        <div
            style={{
                width: 'min(30vw, 200px)',
                position: 'absolute',
                right: '0',
            }}
        >
            {content}
        </div>
    );
};

const LongSheet = ({idf}) => {
  return (
    <div>
      <h1>Long Sheet 1</h1>
      <p>Sheet 1 content</p>
    </div>
  );
};

export { 
    ShortSheet, 
    MediumSheet, 
    LongSheet 
};