<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { fade, fly } from 'svelte/transition';
    
    // 로고 이미지 import
    import fioreLogo from '$lib/assets/icons/fiore_logo.png';
    import fioreText from '$lib/assets/icons/fiore_text.png';
    import fioreLogoText from '$lib/assets/icons/fiore_logo_text_full.png';
    import artnentText from '$lib/assets/icons/artnent_text.png';

    let isMenuOpen = false;
    let scrollProgress = 0;
    let isScrolled = false;
    let isNavHovered = false;

    const menuItems = [
        { 
            name: 'About', 
            href: '/about',
            subItems: [
                { name: 'about', href: '/about' },
                { name: 'membership', href: '/about/membership' },
                { name: 'Fioreum', href: '/about/fioreum' }
            ]
        },
        { 
            name: 'Concerts', 
            href: '/concerts',
            subItems: [
                { name: 'now on', href: '/concerts' },
                // { name: 'schedule', href: '/concerts/schedule' }
            ]
        },
        { 
            name: 'Artists', 
            href: '/artists',
            subItems: null
        },
        { 
            name: 'Gallery', 
            href: '/gallery',
            subItems: [
                { name: 'artists', href: '/gallery/artists' },
                { name: 'concerts', href: '/gallery/concerts' },
                { name: 'concours', href: '/gallery/concours' }
            ]
        },
        { 
            name: 'Contents', 
            href: '/contents',
            subItems: [
                { name: 'interview', href: '/contents/interview' },
                { name: 'podcast', href: '/contents/podcast' },
                { name: 'audition', href: '/contents/audition' }
            ]
        },
        { 
            name: 'Application', 
            href: '/application',
            subItems: null
        }
    ];

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

    function showNav() {
        isNavHovered = true;
    }

    function hideNav() {
        isNavHovered = false;
    }

    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<div class="header-container" class:scrolled={isScrolled} class:nav-hovered={isNavHovered}>
    <div class="progress-container">
        <div class="progress-bar" style="width: {scrollProgress}%"></div>
    </div>

    <header role="none" class="header" onmouseenter={showNav} onmouseleave={hideNav}>
        <div class="logo">
            <a href="/">
                <div class="logo-mobile">
                    <img src={fioreLogoText} alt="Fiore" class="logo-combined" />
                </div>
                <div class="logo-desktop">
                    <img src={fioreText} alt="Fiore" class="logo-text" />
                    <img src={artnentText} alt="Fiore Logo" class="logo-text-small" />
                </div>
            </a>
        </div>

        <!-- Desktop 네비게이션 -->
        <nav class="nav-menu">
            {#each menuItems as item}
                <a class="main-menu-item" href={item.href}>{item.name}</a>
            {/each}
        </nav>

        <!-- 햄버거 메뉴 버튼 (Mobile/Tablet) -->
        <button class="hamburger-menu" onclick={toggleMenu} aria-label="Toggle menu">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
        </button>
    </header>
    
    <div role="none" class="header-expand" class:active={isNavHovered} onmouseenter={showNav} onmouseleave={hideNav}>
        <!-- 왼쪽: 큰 로고 -->
        <div class="logo-expand">
            <a href="/">
                <img src={fioreLogoText} alt="Fiore" class="logo-expand-img" />
            </a>
        </div>

        <div class="nav-menu">
            {#each menuItems as item}
                <div class="dropdown-column">
                    {#if item.subItems}
                        {#each item.subItems as subItem}
                            <a href={subItem.href} class="sub-menu-item">{subItem.name}</a>
                        {/each}
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>

<!-- 사이드 메뉴 (Mobile/Tablet) -->
{#if isMenuOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="side-menu-overlay" onclick={closeMenu} transition:fade></div>
    <div class="side-menu" transition:fly={{ x: 200, duration: 300 }}>
        <button class="close-button" onclick={closeMenu}>&times;</button>
        <ul class="menu-vertical">
            {#each menuItems as item}
                <li class="menu-item-mobile">
                    <a href={item.href} onclick={closeMenu}>{item.name}</a>
                    {#if item.subItems}
                        <ul class="sub-menu-mobile">
                            {#each item.subItems as subItem}
                                <a class="sub-menu-item" href={subItem.href} onclick={closeMenu}>{subItem.name}</a>
                            {/each}
                        </ul>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
{/if}

<style lang="scss">
    .header-container {
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 100;
        height: 60px;
        background-color: rgba(255, 255, 255, 0.95);
        color: black;
        transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;

        /* 스크롤 시 검은 배경 */
        &.scrolled {
            position: fixed;
            top: 0;
            background-color: rgba(0, 0, 0, 0.95);
            color: white;
            backdrop-filter: blur(5px);
            animation: slideDown 0.5s ease forwards;
            
            .header {
                background: transparent;
                display: flex;
                justify-content: space-between;
            }

            .line {
                background-color: white;
            }

            .logo-icon, .logo-text, .logo-combined {
                filter: brightness(0) invert(1);
            }
        }

        /* Desktop에서만 호버 시 검은 배경 */
        @media (min-width: 769px) {
            &.nav-hovered {
                position: fixed;
                top: 0;
                background-color: rgba(0, 0, 0, 0.95);
                color: white;
                backdrop-filter: blur(5px);
                
                .header {
                    background: transparent;
                    display: flex;
                    justify-content: space-between;
                }

                .line {
                    background-color: white;
                }

                .logo-icon, .logo-text, .logo-combined {
                    filter: brightness(0) invert(1);
                }

                .logo {
                    opacity: 0;
                }
            }
            
            &.nav-hovered:not(.scrolled) {
                position: absolute;
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

    /* 로고 스타일 */
    .logo {
        transition: opacity 0.3s ease;
        margin-right: 50px;
    }

    .logo a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
    }

    .logo-mobile {
        display: flex;
        align-items: center;
    }

    .logo-desktop {
        display: none;
        align-items: baseline;
        gap: 8px;
        min-width: 120px;
    }

    /* Tablet 이상에서 분리 로고 표시 (451px 이상) */
    @media (min-width: 451px) {
        .logo-mobile {
            display: none;
        }
        .logo-desktop {
            display: flex;
        }
    }

    .logo-icon {
        height: 32px;
        width: auto;
        transition: filter 0.3s ease;
    }

    .logo-text {
        height: 20px;
        width: auto;
        transition: filter 0.3s ease;
    }

    .logo-text-small {
        height: 12px;
        width: auto;
        transition: filter 0.3s ease;
    }

    .logo-combined {
        height: 44px;
        width: auto;
        transition: filter 0.3s ease;
    }

    /* Desktop 네비게이션 */
    .nav-menu {
        display: block;
        position: relative;
        display: grid;
        max-width: 800px;
        width: 100%;
        margin: 0 0;
        grid-template-columns: repeat(6, 1fr);
        
        padding: 12px 0;
        @media (--tablet) {
            display: none;
        }
    }

    .main-menu-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        text-decoration: none;
        color: inherit;
        font-size: 1rem;
        font-weight: 200;

        &:hover {
            color: #66b3ff;
        }
    }
    .sub-menu-item {
        padding: 6px 0;
        font-weight: 100;
        font-size: 0.9rem;

        transition: all 0.2s ease;

        &:hover {
            color: #66b3ff;
            scale: 1.05;
        }
    }

    /* 메가 드롭다운 메뉴 - 전체 width */
    .header-expand {
        position: absolute;
        top: 60px;
        left: 0;
        width: 100%;
        background-color: black;
        backdrop-filter: blur(10px);
        overflow: hidden;
        max-height: 0;
        min-height: 0px;
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border-top: 1px solid rgba(255, 255, 255, 0.4);

        z-index: 99;

        display: flex;
        justify-content: space-between;
        padding: 0 5vw;

        @media (--tablet) {
            display: none;
        }

        &.active {
            max-height: 300px;
            min-height: 160px;
            opacity: 1;
        }
    }

    .logo-expand {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        padding: 20px 0;
        margin-right: 50px;
        min-width: 120px;
 
        a {
            display: block;
        }
    }

    .logo-expand-img {
        height: 80px;
        width: auto;
        filter: brightness(0) invert(1);
    }

    .dropdown-column {
        display: flex;
        flex-direction: column;
        align-items: center;

        color: white;
        font-size: 1rem;
        font-weight: 100;
    }

    /* 햄버거 메뉴 버튼 */
    .hamburger-menu {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        flex-direction: column;
        justify-content: space-between;
        height: 20px;
        width: 24px;
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
        transition: background-color 0.3s;
    }

    /* 사이드 메뉴 (Mobile/Tablet) */
    .side-menu {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: fixed;
        top: 0;
        right: 0;
        width: 280px;
        max-width: 80vw;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: -2px 0 10px rgba(0,0,0,0.3);
        z-index: 101;
        padding-top: 60px;
        overflow-y: auto;
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
        top: 12px;
        right: 16px;
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: white;
    }

    .menu-vertical {
        width: 100%;
        display: flex;
        flex-direction: column;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .menu-item-mobile {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);

        a {
            display: block;
            padding: 12px 24px;
            text-decoration: none;
            color: white;
            font-size: 1.1rem;
            font-weight: 300;
        }
    }

    .sub-menu-mobile {
        list-style: none;
        padding: 0 0 8px 0;
        margin: 0;
        background-color: rgba(255, 255, 255, 0.05);

        a {
            display: block;
            padding: 4px 24px 8px 40px;
            text-decoration: none;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.95rem;
            font-weight: 100;
        }
    }

    /* Progress bar */
    .progress-container {
        width: 100%;
        height: 2px;
        background: transparent;
    }

    .progress-bar {
        height: 2px;
        background: linear-gradient(90deg, #0056b3, #66b3ff);
        width: 0%;
    }
</style>
