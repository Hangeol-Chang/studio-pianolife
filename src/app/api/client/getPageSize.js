'use client';

const getPageSize = () => {
    // wuidth 768px보다 크면 768을 return
    // height는 그냥 window.innerHeight를 return
    const width = window.innerWidth > 768 ? 768 : window.innerWidth;
    const height = window.innerHeight;

    return { width, height };
}

export default getPageSize;