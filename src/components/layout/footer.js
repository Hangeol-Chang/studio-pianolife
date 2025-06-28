'use client';
/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { FaEnvelope, FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";  
import { Spacer } from "../common/spacer";

export default function Footer() {
    const footer_style = css`
        background-color: #FFFFFF;
        color: white;
        padding: px 0px;
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

    const icon_style = css`
        color: #000000; /* 아이콘 색상 */
        transition: color 0.3s ease-in-out;
    `;
    
    const footer_container_style = css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;

        & * {
            font-size: 12px;
        }
    `;

    const footer_left_part_style = css`
        display: flex;
        flex-direction: column;
        flex-grow: 2;
        align-items: start;
    `;

    const footer_right_part_style = css`
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: end;
        gap: 10px;
    `;

    const icon_container_style = css`
        display: flex;
        gap: 10px; 
        justify-content: end;
    `;

    const contact_link_style = css`{
        display: flex;
        align-items: center;

        gap: 5px;
        padding: 3px 10px;
    `;

    return (
        <footer css={footer_style}>
            <hr css={css`margin: 0px`}/>
            <div css={footer_container_style}>
                
                {/* left part */}
                <div css={footer_left_part_style}>
                    <p css={css`text-align: start;`}>
                        company. STUDIO PIANOLIFE / owner. 고정우 / phonnumber. 010-XXXX-XXXX
                        <br />
                        Contact. (인터뷰, 연주회 참가 문의)
                        <br />
                        instagram. @pianolife38 / mail. jwgo0311@gmail.com
                        <br />
                        <br />
                        © 2024 Hangeol-Chang. All rights reserved.
                    </p>
                </div>

                {/* right part */}
                <div css={footer_right_part_style}>
                    <p css={css`margin: 0px;`}>gong-pira</p>
                    <div css={icon_container_style}>
                        <a href="https://www.instagram.com/pianolife38/" css={contact_link_style}>
                            <FaInstagram size={20} color="black"/> 
                        </a>
                        <a href="mailto:jwgo0311@gmail.com" css={contact_link_style}>
                            <FaEnvelope size={20} color="black"/>
                        </a>
                        <a href ="https://www.youtube.com/@-pianolife1607" css={contact_link_style}>
                            <FaYoutube size={20} color="black"/>
                        </a>
                    </div>
                    <p css={css`margin: 0px;`}>developer</p>
                    <a href="https://github.com/Hangeol-Chang" css={contact_link_style}>
                        <FaGithub size={20} color="black" />
                    </a>
                </div>
            </div>

            <Spacer height={10} />
        </footer>
    );
}