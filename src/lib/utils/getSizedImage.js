import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const getSizedImage = (path, name) => {
    const sizeList = [ 128, 320, 720, 1024 ];
    const wid = typeof window !== 'undefined' ? window.innerWidth : 0;
    
    // Ensure path starts with / if not present, but usually it is passed as /concerts
    // We want to construct: http://localhost:8000/static/concerts/resized/...
    // If path is "/concerts", we need to handle the leading slash or just join.
    
    const backendUrl = PUBLIC_BACKEND_URL || '';
    const staticPath = '/static';
    
    // Clean up path to avoid double slashes if needed, but simple concatenation is often enough if conventions are followed.
    // Assuming path starts with / like "/concerts"
    
    if (wid === 0) {
        // SSR or initial load fallback
        const baseName = name.substring(0, name.lastIndexOf('.'));
        const ext = "webp";
        return `${backendUrl}${staticPath}${path}/resized/${baseName}_320.${ext}`;
    }

    let size = sizeList.find(s => s >= wid);
    if (!size) {
        size = sizeList[sizeList.length - 1]; 
    }

    const baseName = name.substring(0, name.lastIndexOf('.'));
    const ext = "webp";

    return `${backendUrl}${staticPath}${path}/resized/${baseName}_${size}.${ext}`;
};