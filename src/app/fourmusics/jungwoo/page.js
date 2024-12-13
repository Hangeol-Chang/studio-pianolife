import Image from "next/image";

export default function Jungwoo() {

    return (
        <div>
            <h1>Jungwoo</h1>
            {/* 배경이미지, 메인이미지, 설명글귀
                스크롤하면 나올 사진들.
            */}
            <Image src="/jungwoo_bg.webp"
                style={{
                    position : 'absolute',
                    left: '-10%',
                    top : 0,
                    zIndex : -1
                }}
                alt="piano" 
                width={1500} height={400}/>
        </div>
    )
}