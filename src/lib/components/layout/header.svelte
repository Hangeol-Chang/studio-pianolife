<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';

    let isMenuOpen = false;
    let scrollProgress = 0;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu() {
        isMenuOpen = false;
    }

    function handleScroll() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress = (winScroll / height) * 100;
    }

    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<div class="header-container">
    <header class="header">
        <div class="logo">
            <a href="/">Studio PianoLife</a>
        </div>

        <nav class="nav-menu">
            <ul class="menu">
                <li class="menu-item"><a href="/about">About</a></li>
                <li class="menu-item"><a href="/concerts">Concerts</a></li>
                <li class="menu-item"><a href="/fourmusics">Four Musics</a></li>
                <li class="menu-item"><a href="/gallary">Gallery</a></li>
                <li class="menu-item"><a href="/interview">Interview</a></li>
                <li class="menu-item"><a href="/contact">Contact</a></li>
            </ul>
        </nav>

        <button class="hamburger-menu" on:click={toggleMenu} aria-label="Toggle menu">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
        </button>
    </header>

    {#if isMenuOpen}
        <div class="side-menu-overlay" on:click={closeMenu} transition:fade></div>
        <div class="side-menu" transition:fade>
            <button class="close-button" on:click={closeMenu}>&times;</button>
            <ul class="menu-vertical">
                <li class="menu-item"><a href="/about" on:click={closeMenu}>About</a></li>
                <li class="menu-item"><a href="/concerts" on:click={closeMenu}>Concerts</a></li>
                <li class="menu-item"><a href="/fourmusics" on:click={closeMenu}>Four Musics</a></li>
                <li class="menu-item"><a href="/gallary" on:click={closeMenu}>Gallery</a></li>
                <li class="menu-item"><a href="/interview" on:click={closeMenu}>Interview</a></li>
                <li class="menu-item"><a href="/contact" on:click={closeMenu}>Contact</a></li>
            </ul>
        </div>
    {/if}

    <div class="progress-container">
        <div class="progress-bar" style="width: {scrollProgress}%"></div>
    </div>
</div>

<style lang="scss">
    .header-container {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 100;
        height: 60px;
        box-shadow: 0 4px 6px rgba(250, 250, 250, 0.1);
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5vw;
        height: 60px;
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.6) 0%, white 65%);
        color: black;
    }

    .logo {
        font-size: 20px;
        font-weight: bold;
        a {
            text-decoration: none;
            color: inherit;
        }
    }

    .nav-menu {
        display: block;
        @media (max-width: 768px) {
            display: none;
        }
    }

    .menu {
        display: flex;
        flex-direction: row;
        list-style: none;
        height: 60px;
        margin: 0;
        padding: 0;
        z-index: 10;
    }

    .menu-vertical {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-left: 10px;
        z-index: 10;
        list-style: none;
        padding: 0;
    }

    .menu-item {
        padding: 0 1vw;
        display: flex;
        align-items: center;
        a {
            text-decoration: none;
            color: inherit;
            height: 100%;
            display: flex;
            align-items: center;
        }
        &:hover {
            color: #0056b3;
            background-color: #f5f5f5;
        }
    }

    .hamburger-menu {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        flex-direction: column;
        justify-content: space-between;
        height: 20px;
        width: 20px;
        padding: 0;

        @media (max-width: 768px) {
            display: flex;
        }
    }

    .line {
        width: 100%;
        height: 3px;
        background-color: black;
        border-radius: 12px;
    }

    .side-menu {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: fixed;
        top: 0;
        right: 0;
        width: 200px;
        height: 100%;
        background-color: #FFFFFF;
        box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        z-index: 101;
        padding-top: 60px;
    }

    .side-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
    }

    .progress-container {
        width: 100%;
        height: 4px;
        background: #ccc;
    }

    .progress-bar {
        height: 4px;
        background: #0056b3;
        width: 0%;
    }
</style>
