'use client';
import Link from 'next/link';
import './header.scss';
import { useEffect, useState } from 'react'
import getScrollProgress from '@/app/api/client/getScrollProgress';

const HeaderMenu = ({toggleMenu}) => {
    return (
        <div className="header-menu">
            <ul className="menu">
                <li className="menu-item">
                    <Link href="/" onClick={toggleMenu}>
                        Home
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/about" onClick={toggleMenu}>
                        About
                    </Link>                    
                </li>
                <li className="menu-item">
                    <Link href="/fourmusics" onClick={toggleMenu}>
                        포뮤직스
                    </Link>
                </li>
                <li className="menu-item">
                    <Link href="/contact" onClick={toggleMenu}>
                        Contact
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const updateScrollBar = () => {
        // scrollPosition, scrollPercent
        const scrollData = getScrollProgress();
        document.querySelector('.scroll-progress-bar').style.width = `${scrollData.scrollPercent}%`;
    }
    
    useEffect(() => {
        window.addEventListener('scroll', updateScrollBar);
        window.addEventListener('resize', updateScrollBar);
        return () => {
            window.removeEventListener('scroll', updateScrollBar);
            window.removeEventListener('resize', updateScrollBar);
        }
    })


    return (
        <div className="haeder-container">
            <header className="header">
                <Link href="/">
                    <div className="logo">Studio Pianolife</div>
                </Link>

                <nav className="nav-menu">
                    <HeaderMenu toggleMenu={() => {}} />
                </nav>

                <button className="hamburger-menu" onClick={toggleMenu}>
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </button>
            </header>

            <div className={`overlay ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}></div>
            <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
                <button className="close-btn" onClick={toggleMenu}>×</button>
                <HeaderMenu toggleMenu={toggleMenu} />
            </div>

            <div className="scroll-progress-container">
                <div className="scroll-progress-bar"></div>
            </div>
        </div>
    )
}
