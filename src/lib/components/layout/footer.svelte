<script>
    // Icons are now SVG directly in the template
</script>

<footer class="footer">
    <hr class="divider"/>
    <div class="footer-container">
        
        <!-- left part -->
        <div class="footer-left-part">
            <p class="company-info">
                company. STUDIO PIANOLIFE / owner. 고정우
                <br />
                BRN. 815-55-00377  
                <br />
                Contact. (인터뷰, 연주회 참가 문의)
                <br />
                instagram. @pianolife38 / mail. jwgo0311@gmail.com
                <br />
                <br />
                © 2024 Hangeol-Chang. All rights reserved.
            </p>
        </div>

        <!-- right part -->
        <div class="footer-right-part">
            <p class="slogan">공대생의 piano life</p>
            <div class="icon-container">
                <a href="mailto:jwgo0311@gmail.com" aria-label="Email">
                    <!-- Envelope Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="Github">
                    <!-- Github Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="https://instagram.com/pianolife38" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <!-- Instagram Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                    <!-- Youtube Icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
            </div>
        </div>
    </div>
</footer>

<style lang="scss">
    .footer {
        background-color: #FFFFFF;
        color: white;
        padding: 0;
        text-align: center;
    }

    .divider {
        margin: 0;
    }

    .footer-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        color: black;

        * {
            font-size: 12px;
        }
    }

    .footer-left-part {
        display: flex;
        flex-direction: column;
        flex-grow: 2;
        align-items: start;
    }

    .company-info {
        text-align: start;
        margin: 0;
    }

    .footer-right-part {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: end;
        gap: 10px;
    }

    .slogan {
        margin: 0;
    }

    .icon-container {
        display: flex;
        gap: 10px; 
        justify-content: end;

        a {
            color: #000000;
            transition: color 0.3s ease-in-out;
            display: flex;
            align-items: center;
            
            &:hover {
                color: #ccc;
            }
        }
    }
</style>
