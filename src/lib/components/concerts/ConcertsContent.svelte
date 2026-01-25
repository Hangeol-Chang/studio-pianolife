<script>
  import { onMount } from 'svelte';
  
  // Data extraction from the raw code provided
  const concerts = [
    {
      id: 1,
      title: "슈만, 시인은 말한다",
      description: "피아노라는 악기를 누구보다 열망하고 사랑한 슈만. 정해진 음악 형식을 벗어나 깊은 곳에서 부터 묻어나는",
      date: "2025년 3월 15일",
      time: "19:30",
      location: "Hall Fioreum",
      price: "10,000 Won",
      image: "", // Placeholder
      status: "booking" 
    },
    {
      id: 2,
      title: "슈만, 시인은 말한다",
      description: "피아노라는 악기를 누구보다 열망하고 사랑한 슈만. 정해진 음악 형식을 벗어나 깊은 곳에서 부터 묻어나는",
      date: "2025년 3월 15일",
      time: "19:30",
      location: "Hall Fioreum",
      price: "10,000 Won",
      image: "",
      status: "booking"
    },
    {
      id: 3,
      title: "슈만, 시인은 말한다",
      description: "피아노라는 악기를 누구보다 열망하고 사랑한 슈만. 정해진 음악 형식을 벗어나 깊은 곳에서 부터 묻어나는",
      date: "2025년 3월 15일",
      time: "19:30",
      location: "Hall Fioreum",
      price: "10,000 Won",
      image: "",
      status: "booking"
    },
     {
      id: 4,
      title: "슈만, 시인은 말한다",
      description: "피아노라는 악기를 누구보다 열망하고 사랑한 슈만. 정해진 음악 형식을 벗어나 깊은 곳에서 부터 묻어나는",
      date: "2025년 3월 15일",
      time: "19:30",
      location: "Hall Fioreum",
      price: "10,000 Won",
      image: "",
      status: "booking"
    }
  ];

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

<div class="concerts-page">
  <!-- 1. Hero Image Section -->
  <section class="hero-wrapper" use:observe>
    <div class="hero-image-placeholder">
        <!-- Background Image or Img tag -->
    </div>
  </section>

  <!-- 2. Intro Text Section -->
  <section class="intro-wrapper" use:observe>
    <div class="container">
        <div class="intro-grid">
            <div class="intro-headline">
                <p class="main-text">아티스트를 위한 무대<br>당신을 위한 클래식</p>
                <p class="sub-text">피오레 아트앤엔터와 함께 피어나는 젊은 거장의 꿈</p>
            </div>
            <div class="intro-desc">
                <p>
                    피오레 아트앤엔터는 뛰어난 연주력을 갖춘 젊은 신예 아티스트들이 세상 밖으로 힘차게 발돋움할 수 있도록 기회의 무대를 엽니다.
                    다채로운 독주회와 감각적인 테마 기획 연주회를 통해, 아티스트는 자신의 성장을 증명하고 관객은 그 벅찬 열정을 가장 가까이에서 호흡합니다.
                    내일의 거장이 탄생하는 그 빛나는 순간. 연주자의 깊은 몰입과 관객의 높은 만족이 공존하는 최상의 무대를 선사합니다.
                </p>
                <p class="en-text">
                    Fiore Art & Ent. opens a stage of opportunity for talented young artists ready to make their mark on the world. 
                    Through diverse solo recitals and thoughtfully curated themed concerts, we invite audiences to witness the growth of these rising stars and share in the emotion of their journey.
                </p>
            </div>
        </div>
    </div>
  </section>

  <!-- 3. Split Layout: Left(Title) / Right(List) -->
  <section class="concerts-list-wrapper" use:observe>
    <div class="container split-layout">
        <aside class="left-pane">
            <h2 class="sticky-title">Now</h2>
            <p class="sticky-desc">다양한 장르와 스타일의 클래식 공연을 선보입니다</p>
            <div class="sticky-divider"></div>
        </aside>

        <main class="right-pane">
            <div class="concert-cards">
                {#each concerts as concert}
                    <div class="concert-card-horizontal">
                        <div class="card-image">
                            <!-- Image Placeholder -->
                        </div>
                        <div class="card-info">
                            <h3 class="card-title">{concert.title}</h3>
                            <div class="card-meta">
                                <div class="meta-row">
                                    <span class="label">DATE</span>
                                    <span class="value">{concert.date}</span>
                                </div>
                                <div class="meta-row">
                                    <span class="label">TIME</span>
                                    <span class="value">{concert.time}</span>
                                </div>
                                <div class="meta-row">
                                    <span class="label">PLACE</span>
                                    <span class="value">{concert.location}</span>
                                </div>
                                <div class="meta-row">
                                    <span class="label">PRICE</span>
                                    <span class="value">{concert.price}</span>
                                </div>
                            </div>
                            <p class="card-desc">
                                {concert.description}
                            </p>
                        </div>
                        <div class="card-action">
                            <button class="btn-book">예매하기</button>
                            <a href="/" class="more-link">+ more</a>
                        </div>
                    </div>
                {/each}
                
                <div class="prev-concerts-notice">
                    <p>(이전 공연도 추가 필요)</p>
                </div>
            </div>
        </main>
    </div>
  </section>
</div>

<style lang="scss">
@use '../../styles/common.scss' as *;

  .concerts-page {
    width: 100%;
    background-color: $color-white;
    padding-bottom: 8rem;
  }

  /* Animation Base */
  .hero-wrapper, .intro-wrapper, .concerts-list-wrapper {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease-out;
    &.visible {
        opacity: 1;
        transform: translateY(0);
    }
  }

  /* 1. Hero Image */
  .hero-wrapper {
    width: 100%;
    height: 60vh;
    min-height: 400px;
    background-color: #f0f0f0;
    margin-bottom: 4rem;
    
    .hero-image-placeholder {
        width: 100%;
        height: 100%;
        background-color: #e0e0e0; // Placeholder color
    }
  }

  /* 2. Intro Text */
  .intro-wrapper {
    margin-bottom: 6rem;
    
    .intro-grid {
        display: flex;
        flex-direction: column;
        gap: 3rem;
        padding: 0 1.5rem; /* Mobile padding */
        
        @include min-width(1024px) { // PC Layout
            flex-direction: row;
            justify-content: space-between; 
            align-items: flex-start;
            padding: 0; /* Container handles padding */
        }

        .intro-headline {
            flex: 1;
            .main-text {
                font-size: 1.5rem;
                font-weight: 400;
                line-height: 1.4;
                margin-bottom: 1rem;
            }
            .sub-text {
                font-size: 1rem;
                color: $color-text-primary;
                font-weight: 300;
            }
        }

        .intro-desc {
            flex: 2;
            font-size: 0.9rem;
            line-height: 1.8;
            font-weight: 300;
            color: $color-text-secondary;
            
            p { margin-bottom: 1.5rem; }
            .en-text {
                font-size: 0.85rem;
                opacity: 0.8;
            }
        }
    }
  }

  /* 3. Split Layout */
  .concerts-list-wrapper {
    .split-layout {
        display: flex;
        flex-direction: column;
        gap: 3rem;

        @include min-width(1024px) {
            flex-direction: row;
            gap: 4rem;
        }
    }

    .left-pane {
        flex: 0 0 250px;
        padding: 0 1.5rem;

        @include min-width(1024px) {
            position: sticky;
            top: 100px;
            height: fit-content;
            padding: 0;
        }

        .sticky-title {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 1rem;
        }

        .sticky-desc {
            font-size: 1rem;
            font-weight: 300;
            margin-bottom: 2rem;
            line-height: 1.4;
        }

        .sticky-divider {
            width: 100%; /* In PC layout, maybe full width of column */
            max-width: 100px;
            height: 1px;
            background-color: #aaaaaa;
        }
    }

    .right-pane {
        flex: 1;
        padding: 0 1.5rem;
         @include min-width(1024px) {
            padding: 0;
        }
        
        .concert-cards {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
    }
  }

  /* Concert Card Component */
  .concert-card-horizontal {
    display: flex;
    flex-direction: column;
    border: 0.5px solid rgba(0,0,0,0.2);
    padding: 0;
    transition: transform 0.2s, box-shadow 0.2s;
    background: white;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }

    @include min-width(768px) {
        flex-direction: row;
        height: auto; 
        min-height: 380px; 
    }

    .card-image {
        width: 100%;
        aspect-ratio: 3/4;
        background-color: #f5f5f5;
        
        @include min-width(768px) {
            width: 280px;
            aspect-ratio: auto; /* Fill height */
            flex-shrink: 0;
        }
    }

    .card-info {
        padding: 2rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .card-title {
            font-size: 1.5rem;
            font-weight: 400;
            margin-bottom: 2rem;
        }

        .card-meta {
            display: grid;
            gap: 0.8rem;
            margin-bottom: 2rem;

            .meta-row {
                font-size: 0.9rem;
                display: flex;
                align-items: baseline;
                
                .label {
                    display: inline-block;
                    width: 60px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #999;
                }
                .value {
                    font-weight: 300;
                }
            }
        }

        .card-desc {
            font-size: 0.9rem;
            font-weight: 300;
            line-height: 1.6;
            color: $color-text-secondary;
            
            // Limit text lines
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    }

    .card-action {
        padding: 2rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #f0f0f0;

        @include min-width(768px) {
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;
            border-top: none;
            border-left: 1px solid #f0f0f0;
            width: 200px;
            gap: 1rem;
        }

        .btn-book {
            background-color: black;
            color: white;
            padding: 0.8rem 2rem;
            border: none;
            font-size: 0.9rem;
            cursor: pointer;
            transition: opacity 0.2s;
            width: 100%; // Mobile full width
            
            @include min-width(768px) {
                width: auto;
                min-width: 140px;
            }

            &:hover {
                opacity: 0.8;
            }
        }

        .more-link {
            font-size: 0.8rem;
            color: #333;
            text-decoration: none;
            &:hover {
                text-decoration: underline;
            }
        }
    }
  }
  
  .prev-concerts-notice {
    text-align: center;
    padding: 3rem;
    font-size: 1.5rem;
    font-weight: 300;
    color: #999;
  }
</style>
