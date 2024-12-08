'use client';
import './header.css'
import { useState } from 'react'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
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
                    Home
                    <ul className="submenu">
                        <li>Introduction</li>
                        <li>Gallery</li>
                    </ul>
                </li>
                <li className="menu-item">
                    About
                    <ul className="submenu">
                    <li>Team</li>
                    <li>History</li>
                    </ul>
                </li>
                <li className="menu-item">
                    Services
                    <ul className="submenu">
                    <li>Consulting</li>
                    <li>Development</li>
                    </ul>
                </li>
                <li className="menu-item">
                    Contact
                    <ul className="submenu">
                    <li>Email</li>
                    <li>Phone</li>
                    </ul>
                </li>
            </ul>
        </div>


        </div>
    );
}
