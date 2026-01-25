<script>
    import { onMount } from 'svelte';
    
    export let artist;

    let activeTab = 'profile'; // profile, video, concert, notice

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            // Adjust for header height if needed
            const offset = 100; 
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            activeTab = id;
        }
    };

    // Simple scroll spy or manual tab switching could be added here
</script>

<div class="artist-detail-page">
    <!-- Header Section (Name) -->
     <header class="artist-header">
        <h1 class="en-name">{artist.en}</h1>
        <h2 class="kr-name">{artist.name}</h2>
     </header>

     <!-- Hero Image & Slogan -->
     <section class="hero-section">
        <div class="artist-hero-image">
            {#if artist.image}
                <img src={artist.image} alt={artist.name} />
            {:else}
                <div class="placeholder"></div>
            {/if}
        </div>
        
        <div class="slogan-bar">
            <p class="slogan-text">{artist.slogan}</p>
        </div>
     </section>

     <!-- Content Layout -->
     <div class="content-container container">
        
        <!-- Left: Image (Sticky in PC) -->
        <aside class="left-sidebar">
             <div class="sidebar-image">
                {#if artist.image}
                    <img src={artist.image} alt={artist.name} />
                {:else}
                    <div class="placeholder"></div>
                {/if}
             </div>
        </aside>

        <!-- Center: Main Content -->
        <main class="main-content">
            
            <!-- Profile Section -->
            <section id="profile" class="detail-section">
                <h3 class="mobile-section-title">Profile</h3>
                
                {#if artist.subSlogan}
                    <h4 class="sub-slogan">{artist.subSlogan}</h4>
                {/if}

                <div class="career-group">
                    <div class="label-row">
                        <div class="icon-trophy"></div> <!-- Trophy Icon Placeholder -->
                        <span class="label">Career</span>
                    </div>
                    <div class="career-list">
                        {#each artist.career as item}
                            <p class="career-item">{item}</p>
                        {/each}
                    </div>
                </div>

                <div class="description-text">
                    <p>{artist.description}</p>
                </div>
            </section>

            <!-- Video Section -->
            <section id="video" class="detail-section">
                <h3 class="section-header">Video</h3>
                 <div class="video-grid">
                    <div class="video-placeholder">Video Content 1</div>
                    <div class="video-placeholder">Video Content 2</div>
                 </div>
            </section>

            <!-- Concert Section -->
            <section id="concert" class="detail-section">
                <h3 class="section-header">Concert</h3>
                <div class="concert-link-box">
                    <p>관련 공연 정보가 없습니다.</p>
                </div>
            </section>

            <!-- Notice Section -->
            <section id="notice" class="detail-section">
                 <h3 class="section-header">Notice</h3>
                 <div class="notice-box">
                     <p>등록된 공지사항이 없습니다.</p>
                 </div>
            </section>

        </main>

        <!-- Right: Navigation (Sticky) -->
        <nav class="right-nav">
            <ul class="nav-list">
                <li class:active={activeTab === 'profile'}>
                    <button on:click={() => scrollToSection('profile')}>Profile</button>
                </li>
                <li class:active={activeTab === 'video'}>
                    <button on:click={() => scrollToSection('video')}>Video</button>
                </li>
                <li class:active={activeTab === 'concert'}>
                    <button on:click={() => scrollToSection('concert')}>Concert</button>
                </li>
                 <li class:active={activeTab === 'notice'}>
                    <button on:click={() => scrollToSection('notice')}>Notice</button>
                </li>
            </ul>
        </nav>
     </div>
</div>

<style lang="scss">
    @use '../../styles/common.scss' as *;

    .artist-detail-page {
        width: 100%;
        background-color: $color-white;
        padding-top: 4rem; /* Header Space */
    }

    /* Header */
    .artist-header {
        text-align: center;
        margin-bottom: 2rem;
        
        .en-name {
            font-size: 1.5rem;
            font-weight: 200;
            letter-spacing: 0.1rem;
            margin-bottom: 0.5rem;
            color: #000;
            text-transform: uppercase;
            
            @include min-width(1024px) {
                font-size: 2.5rem;
                letter-spacing: 0.2rem;
            }
        }

        .kr-name {
            font-size: 1.2rem;
            font-weight: 200;
            letter-spacing: 0.5rem;
            color: #000;

             @include min-width(1024px) {
                font-size: 1.5rem;
                letter-spacing: 1rem;
            }
        }
    }

    /* Hero Section */
    .hero-section {
        position: relative;
        margin-bottom: 4rem;

        .artist-hero-image {
            width: 80%; /* Mobile: somewhat smaller */
            aspect-ratio: 3/4;
            max-width: 400px;
            margin: 0 auto 2rem auto;
            background-color: #f0f0f0;
            
            /* In PC, this main hero image might be hidden or different */
            @include min-width(1024px) {
                display: none; /* We use the sidebar image in PC */
            }

            .placeholder { width: 100%; height: 100%; }
            img { width: 100%; height: 100%; object-fit: cover; }
        }

        .slogan-bar {
            width: 100%;
            background-color: #000;
            color: #fff;
            padding: 2rem 1rem;
            text-align: center;
            
            .slogan-text {
                font-size: 1rem;
                font-weight: 300;
                line-height: 1.4;
                letter-spacing: 0.05rem;
                white-space: pre-wrap;

                @include min-width(1024px) {
                    font-size: 1.5rem;
                    padding: 3rem 0;
                }
            }
        }
    }

    /* Layout Container */
    .content-container {
        display: flex;
        flex-direction: column;
        padding-bottom: 8rem;
        position: relative;

        @include min-width(1024px) {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
        }
    }

    /* Left Sidebar (Image) - PC Only */
    .left-sidebar {
        display: none;
        
        @include min-width(1024px) {
            display: block;
            width: 300px;
            position: sticky;
            top: 150px;
            
            .sidebar-image {
                width: 100%;
                aspect-ratio: 3/4;
                background-color: #f0f0f0;
                .placeholder { width: 100%; height: 100%; }
                img { width: 100%; height: 100%; object-fit: cover; }
            }
        }
    }

    /* Main Content */
    .main-content {
        flex: 1;
        padding: 0 1.5rem;
        
        @include min-width(1024px) {
            max-width: 600px; /* Constrain width for readability */
            margin: 0 auto;
            padding: 0 4rem;
        }
    }

    .detail-section {
        margin-bottom: 6rem;
        scroll-margin-top: 150px;

        .section-header {
            font-size: 1.5rem;
            font-weight: 300;
            text-align: center;
            margin-bottom: 2rem;
            border-bottom: 1px solid #ddd;
            padding-bottom: 1rem;
            
            @include min-width(1024px) {
                 display: none; /* Hidden in PC if using Side Nav active state, or kept as divider */
                 /* Actually raw code shows distinct section headers in mobile, but not strictly in PC text block */
                 display: block; 
                 text-align: left;
                 border-bottom: none;
                 padding-bottom: 0;
                 margin-bottom: 1rem;
                 font-size: 1.25rem;
                 color: #999;
            }
        }
        
        .mobile-section-title {
             /* Only for Mobile 'Profile' text in black bar... wait, we have a black bar slogan */
             /* Raw code mobile has 'Profile' text below slogan bar */
             font-size: 1.25rem;
             font-weight: 300;
             text-align: center;
             margin-bottom: 1.5rem;
             color: #fff; /* If inside black bar? No, sticking to raw code 'node-Profile-45589' which is black text on white bg */
             color: #000;

             @include min-width(1024px) {
                 display: none;
             }
        }
    }

    /* Profile Content */
    #profile {
        .sub-slogan {
            font-size: 1.2rem;
            font-weight: 300;
            margin-bottom: 2rem;
            color: #333;
        }

        .career-group {
            margin-bottom: 2rem;
            
            .label-row {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                
                .icon-trophy {
                    width: 20px; height: 20px;
                    background-color: #ccc; /* Placeholder for Trophy Icon */
                    border-radius: 50%;
                }
                .label {
                    font-size: 1.2rem;
                    font-weight: 400;
                }
            }

            .career-list {
                padding-left: 0.5rem;
                .career-item {
                    font-size: 0.95rem;
                    font-weight: 300;
                    line-height: 1.6;
                    margin-bottom: 0.3rem;
                    color: #333;
                }
            }
        }

        .description-text {
            font-size: 0.95rem;
            line-height: 1.8;
            font-weight: 300;
            color: $color-text-secondary;
        }
    }

    /* Placeholders */
    .video-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        
        .video-placeholder {
            width: 100%;
            aspect-ratio: 16/9;
            background-color: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
        }
    }

    .concert-link-box, .notice-box {
        padding: 2rem;
        background-color: #f9f9f9;
        text-align: center;
        color: #999;
        font-weight: 300;
    }


    /* Right Nav (PC Only) */
    .right-nav {
         display: none;

        @include min-width(1024px) {
            display: block;
            width: 150px;
            position: sticky;
            top: 250px;
            text-align: right;
        }

        .nav-list {
            list-style: none;
            
            li {
                margin-bottom: 1.5rem;
                
                button {
                    background: none;
                    border: none;
                    font-size: 1.1rem;
                    font-weight: 300;
                    color: #999;
                    cursor: pointer;
                    transition: color 0.3s;
                    text-transform: capitalize;

                    &:hover {
                        color: #000;
                    }
                }

                &.active button {
                    color: #000;
                    font-weight: 500;
                }
            }
        }
    }

</style>
