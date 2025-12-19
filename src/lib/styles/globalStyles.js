'use client';
/** @jsxImportSource @emotion/react */
import { Global, css } from '@emotion/react';
import theme from './theme';

const styles = css`
    @font-face {
        font-family: 'Pretendard';
        src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Thin.woff') format('woff');
        font-weight: 100;
        font-style: normal;
    }
    @font-face {
        font-family: 'Pretendard';
        src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-ExtraLight.woff') format('woff');
        font-weight: 200;
        font-style: normal;
    }
    @font-face {
        font-family: 'Pretendard';
        src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Light.woff') format('woff');
        font-weight: 300;
        font-style: normal;
    }
    @font-face {
        font-family: 'Pretendard';
        src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
        font-weight: 400;
        font-style: normal;
    }
    @font-face {
        font-family: 'Pretendard';
        src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Medium.woff') format('woff');
        font-weight: 500;
        font-style: normal;
    }
    @font-face {
        font-family: 'Pretendard';
        src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-SemiBold.woff') format('woff');
        font-weight: 600;
        font-style: normal;
    }
    @font-face {
        font-family: 'Pretendard';
        src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Bold.woff') format('woff');
        font-weight: 700;
        font-style: normal;
    }
    @font-face {
        font-family: 'Pretendard';
        src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-ExtraBold.woff') format('woff');
        font-weight: 800;
        font-style: normal;
    }
    @font-face {
        font-family: 'Pretendard';
        src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Black.woff') format('woff');
        font-weight: 900;
        font-style: normal;
    }
    @font-face {
        font-family: 'Cafe24Lovingu';
        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/2405-3@1.1/Cafe24Lovingu.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
    }
    @font-face {
        font-family: 'LeferiPoint-SpecialItalicA';
        src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/LeferiPoint-SpecialItalicA.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    body {
        font-family: 'Pretendard', sans-serif;
        font-weight: 400;
        background-color: #ffffff; /* $white0 */
        overflow-x: hidden;
    }

    :root {
        --border-radius: 12px;
        --font-mono: ui-monospace, Menlo, Monaco, 'Cascadia Mono', 'Segoe UI Mono',
            'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro',
            'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --foreground-rgb: 255, 255, 255;
            --background-start-rgb: 0, 0, 0;
            --background-end-rgb: 0, 0, 0;
            --primary-glow: radial-gradient(rgba(1, 65, 255, 0.4), rgba(1, 65, 255, 0));
            --secondary-glow: linear-gradient(
                to bottom right,
                rgba(1, 65, 255, 0),
                rgba(1, 65, 255, 0),
                rgba(1, 65, 255, 0.3)
            );
            --tile-start-rgb: 2, 13, 46;
            --tile-end-rgb: 2, 5, 19;
        }
    }

    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }

    html {
        background-color: #f5f5f5; /* $white2 */
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    .content > * {
        overflow: hidden;
        position: relative;
        width: 100%;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family: 'Pretendard', sans-serif;
        font-weight: 700;
        color: #000000; /* $black1 */
        margin: 0px 5vw;
    }

    p {
        font-family: 'Pretendard', sans-serif;
        font-weight: 300;
        color: #070707; /* $black2 */
        margin: 0px 5vw;
    }

    hr {
        border: 0;
        height: 1px;
        background: #bbbbbb; /* $gray1 */
        margin: 3px 5vw 8px 5vw;
    }
`;

export default function GlobalStyles() {
    return <Global styles={styles}/>
}