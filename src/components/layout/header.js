'use client';
/** @jsxImportSource @emotion/react */
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import getScrollProgress from '@/app/api/client/getScrollProgress';
import { css } from '@emotion/react';

const headerContainer_style = css`
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
    height: 60px;
    box-shadow: 0 4px 6px rgba(250, 250, 250, 0.1);
`;

const header_style = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5vw;
    height: 60px;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.6) 0%, white 65%);
    color: black;
`;

const logo_style = css`
    font-size: 20px;
    font-weight: bold;
`;

const navMenu_style = css`
    display: block;
    flex-direction: row;
    align-items: stretch;

    @media (max-width: 768px) {
        display: none;
    }
`;

const menu_style = css`
    display: flex;
    flex-direction: row;
    list-style: none;
    height: 60px;
`;

const menuItem_style = css`
    padding: 0 1vw;
    display: flex;
    align-items: center;
    &:hover {
        color: #0056b3; /* Replace with your primary intensed color */
        background-color: #f5f5f5; /* Replace with $white1 */
    }
`;

const hamburgerMenu_style = css`
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    flex-direction: column;
    justify-content: space-between;
    height: 20px;
    width: 20px;

    @media (max-width: 768px) {
        display: flex;
    }
`;

const line_style = css`
    width: 100%;
    height: 3px;
    background-color: black;
    border-radius: 12px;
`;

const sideMenu_style = css`
    position: fixed;
    top: 0;
    right: -300px;
    width: 300px;
    height: 100%;
    background-color: #f2f2f2; /* Replace with $white2 */
    opacity: 0.9;
    box-shadow: -4px 0 6px rgba(50, 50, 50, 0.2);
    transition: transform 0.3s ease-in-out;
    transform: translateX(0);
    z-index: 1;

    &.open {
        transform: translateX(-200px);
    }
`;

const closeBtn_style = css`
    background: none;
    border: none;
    color: black;
    font-size: 24px;
    padding: 20px;
    cursor: pointer;
    margin-bottom: 8px;
`;

const overlay_style = css`
    display: block;
    background-color: transparent;
    transition: background-color 0.5s ease-in-out;

    &.open {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(230, 230, 230, 0.5);
        z-index: 0;
    }
`;

const HeaderMenu = ({ toggleMenu }) => {
    return (
        <div>
            <ul css={menu_style}>
                <li css={menuItem_style}>
                    <Link href="/" onClick={toggleMenu}>
                        Home
                    </Link>
                </li>
                <li css={menuItem_style}>
                    <Link href="/about" onClick={toggleMenu}>
                        About
                    </Link>
                </li>
                <li css={menuItem_style}>
                    <Link href="/interview" onClick={toggleMenu}>
                        Interview
                    </Link>
                </li>
                <li css={menuItem_style}>
                    <Link href="/fourmusics" onClick={toggleMenu}>
                        포뮤직스
                    </Link>
                </li>
                <li css={menuItem_style}>
                    <Link href="/contact" onClick={toggleMenu}>
                        Contact
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default function Header() {

    const scrollProgressContainer_style = css`
        position: fixed;
        top: 60px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: rgba(255, 255, 255, 0.5);
    `;

    const scrollProgressBar_style = css`
        width: 0;
        height: 100%;
        background-color: #007bff; /* Replace with $primary */
        transition: width 0.25s ease;
    `

    const [mounted, setMounted] = useState(false);
    const scrollProgressBarRef = useRef(null);
    useEffect(() => {
        setMounted(true);
        return () => { setMounted(false); }
    }, []);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const updateScrollBar = () => {
        if (!mounted || !scrollProgressBarRef.current) return;
        const scrollData = getScrollProgress();
        scrollProgressBarRef.current.style.width = `${scrollData.scrollPercent}%`;
    };

    useEffect(() => {
        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);
        return () => {
            window.removeEventListener('scroll', updateScrollBar);
            window.removeEventListener('resize', updateScrollBar);
        };
    });

    return (
        mounted ?
        <div css={headerContainer_style}>
            <header css={header_style}>
                <Link href="/">
                    <div css={logo_style}>Studio Pianolife</div>
                </Link>

                <nav css={navMenu_style}>
                    <HeaderMenu toggleMenu={() => {}} />
                </nav>

                <button css={hamburgerMenu_style} onClick={toggleMenu}>
                    <span css={line_style}></span>
                    <span css={line_style}></span>
                    <span css={line_style}></span>
                </button>
            </header>

            <div css={[overlay_style, isMenuOpen && overlay_style.open]} onClick={toggleMenu}></div>
            <div css={[sideMenu_style, isMenuOpen && sideMenu_style.open]}>
                <button css={closeBtn_style} onClick={toggleMenu}>
                    ×
                </button>
                <HeaderMenu toggleMenu={toggleMenu} />
            </div>

            <div css={scrollProgressContainer_style}>
                <div css={scrollProgressBar_style} ref={scrollProgressBarRef}></div>
            </div>
        </div>
        : <></>
    );
}
