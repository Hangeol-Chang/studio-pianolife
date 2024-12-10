import React from "react";
import "./Footer.scss";
import { FaGithub } from "react-icons/fa"; // react-icons를 설치해야 사용 가능

export default function Footer() {
return (
    <footer className="footer">
        <div className="footer-content">
            <p>© 2024 Hangeol-Chang. All rights reserved.</p>
            <div>
                <a  href="https://github.com/Hangeol-Chang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                >            
                    <FaGithub size={24} /> {/* GitHub 아이콘 */}
                </a>
                <a  href="https://github.com/Hangeol-Chang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                >            
                    <FaGithub size={24} /> {/* GitHub 아이콘 */}
                </a>
            </div>
        </div>
    </footer>
);
}
