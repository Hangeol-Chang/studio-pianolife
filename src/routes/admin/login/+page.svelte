<script>
  import { signIn } from "@auth/sveltekit/client";
</script>

<svelte:head>
  <title>Admin Login - Studio Pianolife</title>
</svelte:head>

<div class="login-container">
  <div class="login-box">
    <h1>Admin Login</h1>
    <p>관리자 페이지에 접근하려면 Google 계정으로 로그인하세요.</p>
    <p class="notice">* 허용된 이메일만 접근 가능합니다.</p>
    
    <button class="google-btn" onclick={() => signIn("google", { callbackUrl: "/admin" })}>
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Google로 로그인
    </button>
  </div>
</div>

<style lang="scss">
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    color: #222;
  }

  .login-box {
    padding: 3rem;
    background-color: #f8f9fa;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    text-align: center;
    max-width: 400px;
    width: 90%;

    h1 {
      margin: 0 0 1rem;
      font-size: 1.75rem;
      color: #111;
    }

    p {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .notice {
      font-size: 0.85rem;
      color: #dc3545;
      margin-bottom: 2rem;
    }
  }

  .google-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background-color: #fff;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
  }
</style>
