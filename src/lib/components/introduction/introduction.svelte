<script>
    import { onMount } from 'svelte';
    import introImage from '$lib/assets/images/about/about_2.jpg';

    let listContainer;
    let imageContainer;

    onMount(() => {
        const initObservers = () => {
            const textObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        textObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -30% 0px' });

            if (listContainer) {
                const items = listContainer.querySelectorAll('li');
                items.forEach((item, index) => {
                    item.style.setProperty('--delay', `${index * 0.5}s`);
                    textObserver.observe(item);
                });
            }

            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        imageObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -50% 0px' });

            if (imageContainer) {
                imageObserver.observe(imageContainer);
            }
        };

        if (window.scrollY > 50) {
            initObservers();
        } else {
            const onScroll = () => {
                if (window.scrollY > 50) {
                    window.removeEventListener('scroll', onScroll);
                    initObservers();
                }
            };
            window.addEventListener('scroll', onScroll);
        }
    });
</script>

<div>
    <div class="intro-top-container">
        <div class="top-image-wrapper" bind:this={imageContainer}>
            <img src={introImage} class="top-image" alt="img" />
        </div>
        <ul class="intro-top-text" bind:this={listContainer}>
            <li class="visible"></li>
            <li>
                Stories of people 
            </li>
            <li>
                <span>with</span>
            </li>
            <li>
                day jobs <span>and</span>
            </li>
            <li>
                a life at the piano.
            </li>
        </ul>
    </div>
</div>

<style>
    .intro-top-container {
        display: grid;
        direction: rtl;
        justify-content: center;

        grid-template-columns: 3fr minmax(400px, 2fr);
        @media(--desktop) {
            grid-template-columns: 3fr minmax(360px, 2fr);
        }
        @media(--tablet) {
            grid-template-columns: 2fr minmax(240px, 1fr);
        }
    }

    .intro-top-container > * {
        direction: ltr;
    }
    
    .top-image-wrapper {
        display: flex;
        justify-content: right;
        align-items: center;
        overflow: hidden;
        opacity: 0;


        @media (--tablet) {
            justify-content: left;
        }
    }

    .top-image {
        width: 100%;
        min-width: 400px;
        max-width: 1000px;
        min-height: 400px;
        max-height: 800px;
        height: auto;
        object-fit: cover;
    }
    .top-image-wrapper:global(.visible) {
        animation: fadeInImage 2s ease-out forwards;
    }
    @keyframes fadeInImage {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .intro-top-text {
        text-decoration: none;
        list-style: none;
        display: flex;
        flex-direction: column;
        margin: 20px 40px;

        @media (--tablet) {
            margin: 10px 20px;
        }
    }

    .intro-top-text li {
        font-size: 2rem;
        font-weight: 200;
        opacity: 0;
        transform: translateY(10px);
        color: black;
        
        @media (--tablet) {
            font-size: 1.4rem;
        }
    }

    li.visible {
        animation: fadeInUpBold 2s ease-out forwards;
        animation-delay: var(--delay);
    }

    .intro-top-text span {
        color: #aaa;
        font-size: 0.6em;
        font-weight: 300;
        vertical-align: middle;
        margin: 0 0.5rem;
    }

    @keyframes fadeInUpBold {
        0% {
            opacity: 0;
            transform: translateY(20px);
            font-weight: 500;
        }
        40% {
            opacity: 1;
            transform: translateY(0);
            font-weight: 500;
        }
        60% {
            font-weight: 500;
        }
        100% {
            opacity: 1;
            transform: translateY(0);
            font-weight: 200;
        }
    }
</style>