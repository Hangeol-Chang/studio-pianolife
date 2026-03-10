<script>
    import rentalImage from '$lib/assets/images/fioreum/rental_info.png';
    import { PIANOLIFE_BACKEND_URL } from '$env/static/public';
    import { Phone, Mail, CheckCircle, XCircle } from 'lucide-svelte';

    const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';

    let form = { name: '', phone: '', email: '', desired_date: '', usage_time: '' };
    let submitting = false;
    let resultMessage = '';
    let resultType = ''; // 'success' | 'error'
    let visible = false;
    let fadeOut = false;
    let timer;

    function showToast(message, type) {
        clearTimeout(timer);
        resultMessage = message;
        resultType = type;
        fadeOut = false;
        visible = true;
        timer = setTimeout(() => {
            fadeOut = true;
            setTimeout(() => { visible = false; resultMessage = ''; }, 600);
        }, 2000);
    }

    async function handleSubmit() {
        submitting = true;
        try {
            const res = await fetch(`${API}/api/email/rental-inquiry`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    email: form.email,
                    desired_date: form.desired_date,
                    usage_time: form.usage_time,
                })
            });
            const data = await res.json();
            if (res.ok) {
                showToast(data.message || '신청이 완료되었습니다.', 'success');
                form = { name: '', phone: '', email: '', desired_date: '', usage_time: '' };
            } else {
                showToast(data.detail || '오류가 발생했습니다. 다시 시도해주세요.', 'error');
            }
        } catch {
            showToast('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.', 'error');
        } finally {
            submitting = false;
        }
    }
</script>

<div>
    <section class="rental-info">
        <img src="{rentalImage}" alt="Rental Information" class="rental-image" />

        <div class="contact-box">
            <div class="contact-item">
                <Phone size={18} strokeWidth={1.8} />
                <span class="contact-text">010-3480-9451</span>
            </div>
            <div class="contact-divider"></div>
            <div class="contact-item">
                <Mail size={18} strokeWidth={1.8} />
                <span class="contact-text">fioreartnent@gmail.com</span>
            </div>
        </div>
        
    </section>

    <section class="rental-apply">
        <h2 class="apply-title">대관 신청</h2>
        <form class="apply-form" on:submit|preventDefault={handleSubmit}>
            <div class="form-row">
                <label for="name">대관자 성함 <span class="required">*</span></label>
                <input id="name" type="text" bind:value={form.name} required placeholder="홍길동" />
            </div>
            <div class="form-row">
                <label for="phone">연락처 <span class="required">*</span></label>
                <input id="phone" type="tel" bind:value={form.phone} required placeholder="010-0000-0000" />
            </div>
            <div class="form-row">
                <label for="email">이메일 <span class="required">*</span></label>
                <input id="email" type="email" bind:value={form.email} required placeholder="example@email.com" />
            </div>
            <div class="form-row">
                <label for="desired_date">대관 희망일 <span class="required">*</span></label>
                <input id="desired_date" type="date" bind:value={form.desired_date} required />
            </div>
            <div class="form-row">
                <label for="usage_time">사용 시간 <span class="required">*</span></label>
                <input id="usage_time" type="text" bind:value={form.usage_time} required placeholder="예) 오후 2시 ~ 5시" />
            </div>

            <div class="submit-row">
                <button type="submit" class="submit-btn" disabled={submitting}>
                    {submitting ? '전송 중...' : '전송 요청'}
                </button>
            </div>
        </form>
    </section>
</div>

{#if visible}
    <div class="toast {resultType}" class:fade-out={fadeOut}>
        {#if resultType === 'success'}
            <CheckCircle size={18} strokeWidth={2} />
        {:else}
            <XCircle size={18} strokeWidth={2} />
        {/if}
        {resultMessage}
    </div>
{/if}

<style>
    .rental-info {
        margin: 20px 0;
        text-align: center;

        display: flex;
        flex-direction: column;
    }

    .rental-image {
        max-width: 1000px;
        height: auto;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin: 0 auto 20px;
    }

    .contact-box {
        display: inline-flex;
        flex-direction: column;
        gap: 12px;
        margin: 0 auto;
        padding: 24px 40px;
    }

    .contact-item {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .contact-item :global(svg) {
        color: #7b6c6c;
        flex-shrink: 0;
    }

    .contact-text {
        font-size: 1rem;
        color: #444;
        letter-spacing: 0.02em;
    }

    .contact-divider {
        height: 1px;
        background: #e0e0e0;
    }

    /* ── 대관 신청 폼 ─────────────────────────────────────── */
    .rental-apply {
        max-width: 1000px;
        margin: 48px auto 0;
        padding: 0 16px 48px;
        display: grid;
        
        grid-template-columns: 300px 1fr;

        
        @media(--tablet) {
            grid-template-columns: 1fr;
            max-width: 600px;
        }
    }

    .apply-title {
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 24px;
        padding-bottom: 10px;
        text-align: center;
        align-items: center;
        align-self: center;

        border-right: 2px solid #c9b8a8;
        height: 100%;

        @media(--tablet) {
            border-right: none;
            border-bottom: 2px solid #c9b8a8;
        }
    }

    .apply-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 0 24px;
    }

    .form-row {
        gap: 6px;
        display: grid;
        grid-template-columns: 120px 1fr;
        align-items: center;
        
        @media (--mobile) {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            max-width: 400px;
            width: 100%;
            margin: 0 auto;
        }
        label {
            font-size: 0.9rem;
            color: #555;
            font-weight: 500;
        }
        input {
            padding: 10px 14px;
            border: 1px solid #d6ccc2;
            border-radius: 2px;
            font-size: 0.95rem;
            color: #333;
            background: #fdfaf7;
            transition: border-color 0.2s;
            width: 100%;
        }
         input:focus {
            outline: none;
            border-color: #a08878;
            background: #fff;
        }
    }

    .required {
        color: #c0392b;
    }

    .submit-btn {
        margin-top: 8px;
        padding: 12px;
        background: #7b6c6c;
        color: #fff;
        border: none;
        border-radius: 2px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
    }

    .submit-row {
        display: flex;
        justify-content: flex-end;

        @media (--mobile) {
            justify-content: center;
        }
    }

    .submit-btn:hover:not(:disabled) {
        background: #5a4e4e;
    }

    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .result-msg {
        padding: 12px 16px;
        border-radius: 2px;
        font-size: 0.9rem;
        text-align: center;
    }

    .result-msg.success {
        background: #eaf7ea;
        color: #2e7d32;
        border: 1px solid #a5d6a7;
    }

    .result-msg.error {
        background: #fdecea;
        color: #c62828;
        border: 1px solid #ef9a9a;
    }

    /* ── Toast 팝업 ───────────────────────────────────────── */
    .toast {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 18px 36px;
        border-radius: 4px;
        font-size: 0.95rem;
        font-weight: 500;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.6s ease;
        white-space: nowrap;
        letter-spacing: 0.02em;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .toast :global(svg) {
        flex-shrink: 0;
    }

    .toast.success {
        background: #f5f2f0;
        color: #5a4e4e;
        border: 1px solid #c9b8a8;
    }

    .toast.error {
        background: #f5f0f0;
        color: #7b5050;
        border: 1px solid #c9a8a8;
    }

    .toast.fade-out {
        opacity: 0;
    }
</style>