'use client';
import Link from 'next/link';
import './header.scss'
import { useState } from 'react'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        console.log("toggleMenu");
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <header className="header">
                <div className="logo">Studio Pianolife</div>
                <button className="hamburger" onClick={toggleMenu}>
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </button>
            </header>
            {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}

            <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
            <button className="close-btn" onClick={toggleMenu}>×</button>
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


        </div>
    );
}
