const getScrollProgress = () => {
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    
    const scrollPercent = (scrollPosition / (documentHeight - windowHeight)) * 100;
    
    return { scrollPosition, scrollPercent };
}

export default getScrollProgress;