<script>
    import PageTitle from '@/components/ui/PageTitle.svelte';
    import SectionTitle from '@/components/ui/SectionTitle.svelte';
    import Spacer from '@/components/ui/Spacer.svelte';
</script>

<div class="contact-container">
    <Spacer height={30} />
    <PageTitle title="Contact" subTitle="인터뷰, 연주회 참가 문의" />
    
    <Spacer height={30} />
    
    <div class="contact-info">
        <div class="info-item">
            <h3>Email</h3>
            <p>jwgo0311@gmail.com</p>
        </div>
        <div class="info-item">
            <h3>Instagram</h3>
            <p>@pianolife38</p>
        </div>
    </div>

    <Spacer height={50} />

    <SectionTitle title="사이트 제작" />
    <div class="developer-info">
        <a href="https://github.com/Hangeol-Chang" target="_blank" rel="noopener noreferrer">
            <img src="https://github.com/Hangeol-Chang.png" width="40" alt="Developer Profile" />
        </a>
        <div class="dev-details">
            <a href="https://github.com/Hangeol-Chang" target="_blank" rel="noopener noreferrer">
                @hihangeol
            </a>
        </div>
    </div>
</div>

<style lang="scss">
    .contact-info {
        padding: 0 5vw;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .info-item {
        h3 {
            margin: 0 0 5px 0;
            font-size: 1.1rem;
        }
        p {
            margin: 0;
            color: #555;
        }
    }
    .developer-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 20px 5vw;
        gap: 15px;
        
        img {
            border-radius: 50%;
        }
        
        a {
            text-decoration: none;
            color: black;
            font-weight: bold;
            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>
