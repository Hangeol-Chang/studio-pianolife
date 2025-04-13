'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { FaGithub } from "react-icons/fa";  

export default function Footer() {
    const footer_style = css`
        background-color: #282c34;
        color: white;
        padding: 20px;
        text-align: center;
    `;
    const footer_content_style = css`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;

        a {
            color: white;
            text-decoration: none;
            transition: color 0.3s ease-in-out;
        }
        a:hover {
            color: #ccc;
        }
    `;

    
    return (
        <footer css={footer_style}>
            <div css={footer_content_style}>
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