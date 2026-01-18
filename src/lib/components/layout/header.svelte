<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fade, fly } from 'svelte/transition';

    let isMenuOpen = false;
    let scrollProgress = 0;
    let isScrolled = false;

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
        isScrolled = winScroll > 50;
    }

    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<div class="header-container" class:scrolled={isScrolled}>
    <div class="progress-container">
        <div class="progress-bar" style="width: {scrollProgress}%"></div>
    </div>

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

        <button class="hamburger-menu" onclick={toggleMenu} aria-label="Toggle menu">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
        </button>
    </header>
</div>

{#if isMenuOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="side-menu-overlay" onclick={closeMenu} transition:fade></div>
    <div class="side-menu" transition:fly={{ x: 200, duration: 300 }}>
        <button class="close-button" onclick={closeMenu}>&times;</button>
        <ul class="menu-vertical">
            <li class="menu-item"><a href="/about" onclick={closeMenu}>About</a></li>
            <li class="menu-item"><a href="/concerts" onclick={closeMenu}>Concerts</a></li>
            <li class="menu-item"><a href="/fourmusics" onclick={closeMenu}>Four Musics</a></li>
            <li class="menu-item"><a href="/gallary" onclick={closeMenu}>Gallery</a></li>
            <li class="menu-item"><a href="/interview" onclick={closeMenu}>Interview</a></li>
            <li class="menu-item"><a href="/contact" onclick={closeMenu}>Contact</a></li>
        </ul>
    </div>
{/if}

<style>

    .header-container {
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 100;
        height: 60px;
        background-color: rgba(255, 255, 255, 0.9);
        color: black;
        transition: background-color 0.5s ease, color 0.5s ease, box-shadow 0.5s ease;

        &.scrolled {
            position: fixed;
            top: 0;
            animation: slideDown 0.5s ease forwards;
            background-color: rgba(0, 0, 0, 0.85);
            color: white;
            backdrop-filter: blur(5px);
            
            .header {
                background: transparent;
            }

            .line {
                background-color: white;
            }

            .menu-item {
                &:hover {
                    color: #66b3ff;
                    background-color: #333;
                }
            }
        }
    }

    @keyframes slideDown {
        from {
            transform: translateY(-100%);
        }
        to {
            transform: translateY(0);
        }
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5vw;
        height: 60px;
        background: transparent;
        color: inherit;
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
        
        @media (--tablet) {
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
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2px;
        z-index: 10;
        list-style: none;
        padding: 0;
    }

    .menu-item {
        padding: 12px calc(1vw + 8px);
        display: flex;
        align-items: center;
        transition: all 0.3s ease;

        a {
            width: 100%;
            text-decoration: none;
            color: inherit;
            height: 100%;
            display: flex;
            align-items: center;
        }
        &:hover {
            color: #0056b3;
            background-color: #f5f5f5;
            font-size: 1.1rem;
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

        @media (--tablet) {
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
        height: 2px;
        background: transparent;
    }

    .progress-bar {
        height: 2px;
        background: #FFFFFF;
        width: 0%;
    }
</style>
