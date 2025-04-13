'use client';
/** @jsxImportSource @emotion/react */
import { ThemeProvider, css, CacheProvider } from "@emotion/react";
import theme from "@/styles/theme";
import GlobalStyles from "@/styles/globalStyles";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { emotionCache } from "@/emotion/emotion-cache";
import { useEffect, useState } from "react";

const StyledApp = ({ children }) => {
    
    const content_style = css`
        max-width: 768px;
        min-height: 1000px;
        width: 100%;
        margin: 60px auto 0px auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background: #f5f5f5; /* $white2 */
        overflow: hidden;
        display: flex;
        justify-content: center;
    `;

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);    
    }, []);

    return (
        mounted ?
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                <GlobalStyles />
                <Header />
                <div css={content_style}>
                    {children}
                </div>
                <Footer />
            </ThemeProvider>
        </CacheProvider>
        : <></>
    );
}

export default StyledApp;