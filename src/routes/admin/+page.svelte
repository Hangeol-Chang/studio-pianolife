<script>
  /** @type {{ data: import('./$types').PageData }} */
  let { data } = $props();
</script>

<svelte:head>
  <title>Admin - Studio Pianolife</title>
</svelte:head>

<div class="admin-container">
  <header class="admin-header">
    <h1>Admin Dashboard</h1>
    <div class="user-info">
      {#if data.user?.image}
        <img src={data.user.image} alt="profile" class="profile-img" />
      {/if}
      <span>{data.user?.name || data.user?.email}</span>
      <form method="POST" action="/admin/logout">
        <button type="submit" class="logout-btn">로그아웃</button>
      </form>
    </div>
  </header>

  <main class="admin-main">
    <section class="admin-section">
      <h2>데이터 관리</h2>
      <div class="admin-cards">
        <a href="/admin/concerts" class="admin-card">
          <h3>🎵 공연 관리</h3>
          <p>공연 정보 추가/수정/삭제</p>
        </a>
        <a href="/admin/artists" class="admin-card">
          <h3>🎹 아티스트 관리</h3>
          <p>아티스트 정보 추가/수정/삭제</p>
        </a>
        <a href="/admin/gallery" class="admin-card">
          <h3>🖼️ 갤러리 관리</h3>
          <p>갤러리 이미지 업로드/삭제</p>
        </a>
        <a href="/admin/fourmusics" class="admin-card">
          <h3>🎶 Four Musics 관리</h3>
          <p>Four Musics 콘텐츠 관리</p>
        </a>
      </div>
    </section>

    <section class="admin-section">
      <h2>업로드</h2>
      <div class="admin-cards">
        <a href="/admin/upload/images" class="admin-card">
          <h3>📤 이미지 업로드</h3>
          <p>이미지 파일 업로드</p>
        </a>
      </div>
    </section>
  </main>
</div>

<style lang="scss">
  .admin-container {
    min-height: 100vh;
    background-color: #1a1a2e;
    color: #eee;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #16213e;
    border-bottom: 1px solid #0f3460;

    h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .profile-img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background-color: #e94560;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #c73e54;
      }
    }
  }

  .admin-main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .admin-section {
    margin-bottom: 2rem;

    h2 {
      margin-bottom: 1rem;
      font-size: 1.25rem;
      color: #a0a0a0;
    }
  }

  .admin-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .admin-card {
    display: block;
    padding: 1.5rem;
    background-color: #16213e;
    border: 1px solid #0f3460;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    h3 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
    }

    p {
      margin: 0;
      color: #888;
      font-size: 0.9rem;
    }
  }
</style>
