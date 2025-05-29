'use client';

const { default: getPageSize } = require("./getPageSize");

const getSizedImage = (path, name) => {
    const sizeList = [ 128, 320, 720, 1024 ];
    const wid = getPageSize().width;

    // wid보다 작거나 같은 sizeList의 최대값을 찾는다.
    const size = sizeList.reduce((prev, curr) => {
        return (curr <= wid && curr > prev) ? curr : prev;
    }, 0);
    if (size === 0) {
        size = 128;
    }

    // name에서 확장자와 경로를 분리
    const baseName = name.substring(0, name.lastIndexOf('.'));
    const ext = name.split('.').pop();

    return `${path}/resized/${baseName}_${size}.${ext}`;
};

export default getSizedImage;