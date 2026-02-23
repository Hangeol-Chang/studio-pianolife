<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    
    // Import gallery images
    import artist1 from '$lib/assets/images/artists/artists_wallpaper.png';
    import profile2 from '$lib/assets/images/artists/artists_wallpaper.png';
    import profile3 from '$lib/assets/images/artists/artists_wallpaper.png';
    import about1 from '$lib/assets/images/about/about_1.jpg';
    import about2 from '$lib/assets/images/about/about_2.jpg';

    // Mock Data
    const galleryItems = [
        {
            id: 1,
            category: 'artist',
            title: 'Ko Jeong Woo',
            subTitle: '고정우',
            mainImage: artist1,
            thumbnails: [artist1, about1, about2, profile2]
        },
        {
            id: 2,
            category: 'artist',
            title: 'Kim Jun Han',
            subTitle: '김준한',
            mainImage: profile2,
            thumbnails: [profile2, about1, about2]
        },
        {
            id: 3,
            category: 'artist',
            title: 'Park Seo Hyeon',
            subTitle: '박서현',
            mainImage: profile3,
            thumbnails: [profile3, about1, about2, artist1]
        }
    ];

    const filters = ['Gallery', 'Artist', 'Concours', 'Interview', 'Concert'];
    let activeFilter = 'Gallery'; // Default

    function setFilter(filter) {
        activeFilter = filter;
        // Logic to filter items would go here
    }

    let observer;
    const observe = (node) => {
        if (observer) observer.observe(node);
        return {
            destroy() {
                if (observer) observer.unobserve(node);
            }
        };
    };

    onMount(() => {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        return () => {
            if (observer) observer.disconnect();
        };
    });
</script>

<div class="gallery-page">
    <!-- Filter Navigation -->
    <nav class="gallery-nav">
        <ul>
            {#each filters as filter}
                <li class:active={activeFilter === filter}>
                    <button on:click={() => setFilter(filter)}>{filter}</button>
                </li>
            {/each}
        </ul>
    </nav>

    <!-- Gallery List -->
    <div class="gallery-list">
        {#each galleryItems as item}
            <section class="gallery-group" use:observe>
                <div class="container">
                    <div class="group-header">
                        <h2 class="group-title">{item.title}</h2>
                        <!-- <span class="group-subtitle">{item.subTitle}</span> -->
                    </div>

                    <div class="group-content">
                        <!-- Main Featured Image (Left or Top) -->
                        <div class="main-image-area">
                            <div class="img-box main">
                                {#if item.mainImage}
                                    <img src={item.mainImage} alt={item.title} />
                                {:else}
                                    <div class="placeholder"></div>
                                {/if}
                            </div>
                        </div>

                        <!-- Thumbnails (Right or Bottom) -->
                        <div class="thumbnails-area">
                            {#each item.thumbnails as thumb, i}
                                <div class="img-box thumb">
                                    <div class="placeholder"></div>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <!-- Footer / More -->
                    <div class="group-footer">
                        <div class="divider-line"></div>
                        <a href="/gallary/{item.id}" class="more-link">+ more</a>
                    </div>
                </div>
            </section>
        {/each}
    </div>
</div>

<style lang="scss">
    @use '../../styles/common.scss' as *;

    .gallery-page {
        width: 100%;
        background-color: $color-white;
        padding-bottom: 8rem;
    }

    /* Navigation */
    .gallery-nav {
        padding: 4rem 0 6rem 0;
        
        ul {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1.5rem;
            list-style: none;

            @include min-width(768px) {
                gap: 3rem;
            }

            li {
                button {
                    background: none;
                    border: none;
                    font-size: 1rem;
                    font-weight: 700;
                    color: $color-text-secondary; // #999 or lighter
                    cursor: pointer;
                    transition: color 0.3s;
                    text-transform: capitalize;

                    &:hover {
                        color: #000;
                    }
                }

                &.active button {
                    color: #000;
                    // border-bottom: 1px solid #000; // Optional design choice
                }
            }
        }
    }

    /* Animation Wrapper */
    .gallery-group {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;
        margin-bottom: 6rem;

        &.visible {
            opacity: 1;
            transform: translateY(0);
        }
    }


    /* Group Layout */
    .gallery-group {
        .group-header {
            margin-bottom: 2rem;
            .group-title {
                font-size: 2rem;
                font-weight: 700;
                color: #000;
                
                @include min-width(1024px) {
                    font-size: 2.5rem;
                }
            }
        }

        .group-content {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 2rem;

            @include min-width(1024px) {
                flex-direction: row;
                height: 500px; /* Fixed height for PC alignment */
                gap: 2rem;
            }
            
            .main-image-area {
                flex: 1.2;
                height: 400px; /* Mobile height */
                
                @include min-width(1024px) {
                    height: 100%;
                }

                .img-box.main {
                    width: 100%;
                    height: 100%;
                    background-color: #f0f0f0;
                    overflow: hidden;
                    
                    .placeholder { width: 100%; height: 100%; }
                    img { width: 100%; height: 100%; object-fit: cover; }
                }
            }

            .thumbnails-area {
                flex: 1;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(2, 1fr);
                gap: 1rem;
                
                @include min-width(1024px) {
                    /* On PC, maybe irregular layout or grid */
                     grid-template-columns: repeat(2, 1fr);
                     gap: 1.5rem;
                }

                .img-box.thumb {
                    background-color: #f8f8f8;
                    width: 100%;
                    height: 100%;
                    min-height: 150px;
                    
                    .placeholder { width: 100%; height: 100%; }
                }
            }
        }

        .group-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;

            .divider-line {
                flex: 1;
                height: 1px;
                background-color: #ddd;
            }

            .more-link {
                font-size: 1rem;
                color: #999;
                text-decoration: none;
                font-weight: 300;
                white-space: nowrap;

                &:hover {
                    color: #000;
                }
            }
        }
    }
</style>
