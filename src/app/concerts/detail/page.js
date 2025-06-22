'use client';

import { useEffect, useState } from "react";

export default function ConcertDetail() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        mounted &&
        <div style={{ padding: '20px 5%' }}>
            <p>Title: {new URLSearchParams(window.location.search).get('title')}</p>

            <h1>Concert Detail Page</h1>
            <p>This is the detail page for a specific concert.</p>
        </div>
    );
}