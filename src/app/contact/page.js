'use client';

import { Spacer } from "@/components/common/spacer";
import { Title1, Title2, Title3 } from "@/components/common/title";
import { FaEnvelope, FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";
import styles from './contact.module.scss';


const DeveloperInfo = () => {
    return (
        <div>
            
            <Title2 title="이 사이트 만든 사람 정보" />
            <Spacer height={15} />
            <div style={{
                display: 'flex', 
                flexDirection: 'row', 
                alignItems: 'center',
                margin : '0 5vw'
            }}>
                <a href="https://github.com/Hangeol-Chang">
                    <img src="https://github.com/Hangeol-Chang.png" width="40" />
                </a>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <a href="https://github.com/Hangeol-Chang" className={styles.contact_link}>
                        <FaGithub size={20} color="black" /> 
                        <span>@hihangeol</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default function Contact() {
    return (
        <div>
            <Spacer height={30} />

            <Title1 title="Contact" subTitle="인터뷰, 연주회 참가 문의" />
            <Spacer height={15} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    margin : '0 5vw'
                }}
            >
                <a href="https://www.instagram.com/pianolife38/" className={styles.contact_link}>
                    <FaInstagram size={20} color="#E4405F" /> 
                    <span>@pianolife38</span>
                </a>
                <a href="mailto:jwgo0311@gmail.com" className={styles.contact_link}>
                    <FaEnvelope size={20} color="#AAAAAA" />
                    <span>jwgo0311@gmail.com</span>
                </a>
                <a href ="https://www.youtube.com/@-pianolife1607" className={styles.contact_link}>
                    <FaYoutube size={20} color="#D44638" />
                    <span>YouTube</span>
                </a>
            </div>


            <Spacer height={100} />
            <DeveloperInfo />
        </div>
    );
}