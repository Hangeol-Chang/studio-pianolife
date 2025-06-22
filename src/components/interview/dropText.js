'use client';
/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export default function DropText({ text }) {
    const dropAnimation = keyframes`
        0% {
            transform: translateY(-100%);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    `;

    const Wrapper = styled.div`
        display: inline-block;
        overflow: hidden;
        font-size: 2rem;
    `;

    const Char = styled.div`
        display: inline-block;
        transform: translateY(-100%);

        animation: ${dropAnimation} 0.6s forwards;
        animation-delay: ${({ delay }) => delay}s;
    `;

    return (
        <Wrapper>
            {[...text].map((char, index) => (
                <Char key={index} delay={index * 0.3}>
                {char}
                </Char>
            ))}
        </Wrapper>
    );
}