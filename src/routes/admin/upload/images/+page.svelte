<script>
  import { PIANOLIFE_BACKEND_URL } from '$env/static/public';

  /** @type {{ data: import('../$types').PageData }} */
  let { data } = $props();

  const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';

  // ── 상태 ──────────────────────────────────
  let files = $state([]);
  let category = $state('general');
  let tags = $state('');
  let altText = $state('');
  let uploading = $state(false);
  let uploadResults = $state([]);

  // ── 미디어 라이브러리 ─────────────────────
  let mediaList = $state([]);
  let mediaTotal = $state(0);
  let mediaLoading = $state(false);
  let filterCategory = $state('');
  let searchQuery = $state('');
  let currentPage = $state(0);
  const PAGE_SIZE = 20;

  // ── 선택 / 상세 ───────────────────────────
  let selectedMedia = $state(null);
  let selectedIds = $state(new Set());

  const categories = [
    { value: 'general', label: '일반' },
    { value: 'artist', label: '아티스트' },
    { value: 'concert', label: '콘서트' },
    { value: 'gallery', label: '갤러리' },
  ];

  // ── 미디어 목록 로드 ──────────────────────
  async function loadMedia() {
    mediaLoading = true;
    try {
      const params = new URLSearchParams({
        skip: String(currentPage * PAGE_SIZE),
        limit: String(PAGE_SIZE),
      });
      if (filterCategory) params.set('category', filterCategory);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`${API}/api/media?${params}`);
      const data = await res.json();
      mediaList = data.items || [];
      mediaTotal = data.total || 0;
    } catch (e) {
      console.error('Failed to load media:', e);
    }
    mediaLoading = false;
  }

  // ── 업로드 ────────────────────────────────
  function handleFileSelect(e) {
    files = Array.from(e.target.files || []);
    uploadResults = [];
  }

  function handleDrop(e) {
    e.preventDefault();
    files = Array.from(e.dataTransfer?.files || []);
    uploadResults = [];
  }

  async function uploadFiles() {
    if (!files.length) return;
    uploading = true;
    uploadResults = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        if (tags) formData.append('tags', tags);
        if (altText) formData.append('alt_text', altText);

        const res = await fetch(`${API}/api/media`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const result = await res.json();
          uploadResults = [...uploadResults, { success: true, name: file.name, data: result }];
        } else {
          uploadResults = [...uploadResults, { success: false, name: file.name, error: res.statusText }];
        }
      } catch (e) {
        uploadResults = [...uploadResults, { success: false, name: file.name, error: e.message }];
      }
    }

    uploading = false;
    files = [];
    // 업로드 후 목록 새로고침
    await loadMedia();
  }

  // ── 삭제 ──────────────────────────────────
  async function deleteMedia(id) {
    if (!confirm('이 이미지를 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`${API}/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        selectedMedia = null;
        await loadMedia();
      }
    } catch (e) {
      console.error('Delete failed:', e);
    }
  }

  async function deleteBatch() {
    if (!selectedIds.size) return;
    if (!confirm(`${selectedIds.size}개의 이미지를 삭제하시겠습니까?`)) return;
    try {
      const params = Array.from(selectedIds).map(id => `ids=${id}`).join('&');
      const res = await fetch(`${API}/api/media/batch/delete?${params}`, { method: 'DELETE' });
      if (res.ok) {
        selectedIds = new Set();
        await loadMedia();
      }
    } catch (e) {
      console.error('Batch delete failed:', e);
    }
  }

  // ── 유틸 ──────────────────────────────────
  function formatSize(bytes) {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function toggleSelect(id) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    selectedIds = next;
  }

  // 초기 로드
  $effect(() => {
    loadMedia();
  });
</script>

<svelte:head>
  <title>이미지 관리 - Admin</title>
</svelte:head>

<div class="page">
  <header class="page-header">
    <a href="/admin" class="back-link">← Admin</a>
    <h1>📤 이미지 관리</h1>
  </header>

  <!-- ── 업로드 섹션 ──────────────────────── -->
  <section class="upload-section">
    <h2>이미지 업로드</h2>

    <div
      class="drop-zone"
      class:drag-over={false}
      ondrop={handleDrop}
      ondragover={(e) => e.preventDefault()}
      role="button"
      tabindex="0"
    >
      <p>📁 파일을 드래그하거나 클릭하여 선택</p>
      <input
        type="file"
        accept="image/*"
        multiple
        onchange={handleFileSelect}
        class="file-input"
      />
    </div>

    {#if files.length > 0}
      <div class="upload-preview">
        <p>{files.length}개 파일 선택됨</p>
        <ul class="file-list">
          {#each files as file}
            <li>{file.name} ({formatSize(file.size)})</li>
          {/each}
        </ul>
      </div>
    {/if}

    <div class="upload-options">
      <label>
        카테고리
        <select bind:value={category}>
          {#each categories as cat}
            <option value={cat.value}>{cat.label}</option>
          {/each}
        </select>
      </label>

      <label>
        태그 (쉼표 구분)
        <input type="text" bind:value={tags} placeholder="프로필, 피아노, 2026" />
      </label>

      <label>
        대체 텍스트
        <input type="text" bind:value={altText} placeholder="이미지 설명" />
      </label>
    </div>

    <button
      class="btn-upload"
      onclick={uploadFiles}
      disabled={!files.length || uploading}
    >
      {uploading ? '업로드 중...' : `업로드 (${files.length})`}
    </button>

    {#if uploadResults.length > 0}
      <div class="upload-results">
        {#each uploadResults as result}
          <div class="result-item" class:success={result.success} class:error={!result.success}>
            {result.success ? '✅' : '❌'} {result.name}
            {#if result.error} — {result.error}{/if}
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- ── 미디어 라이브러리 ────────────────── -->
  <section class="library-section">
    <div class="library-header">
      <h2>미디어 라이브러리 ({mediaTotal})</h2>

      <div class="library-controls">
        <select bind:value={filterCategory} onchange={() => { currentPage = 0; loadMedia(); }}>
          <option value="">전체 카테고리</option>
          {#each categories as cat}
            <option value={cat.value}>{cat.label}</option>
          {/each}
        </select>

        <input
          type="text"
          placeholder="검색..."
          bind:value={searchQuery}
          onkeydown={(e) => { if (e.key === 'Enter') { currentPage = 0; loadMedia(); } }}
        />

        <button class="btn-search" onclick={() => { currentPage = 0; loadMedia(); }}>검색</button>

        {#if selectedIds.size > 0}
          <button class="btn-delete-batch" onclick={deleteBatch}>
            🗑️ {selectedIds.size}개 삭제
          </button>
        {/if}
      </div>
    </div>

    {#if mediaLoading}
      <div class="loading">로딩 중...</div>
    {:else if mediaList.length === 0}
      <div class="empty">업로드된 이미지가 없습니다</div>
    {:else}
      <div class="media-grid">
        {#each mediaList as media}
          <div
            class="media-card"
            class:selected={selectedIds.has(media.id)}
            onclick={() => selectedMedia = media}
            role="button"
            tabindex="0"
          >
            <div class="card-checkbox" onclick|stopPropagation={() => toggleSelect(media.id)}>
              <input type="checkbox" checked={selectedIds.has(media.id)} />
            </div>
            <div class="card-image">
              <img src={media.url} alt={media.alt_text || media.original_filename} loading="lazy" />
            </div>
            <div class="card-info">
              <span class="card-name" title={media.original_filename}>
                {media.original_filename}
              </span>
              <span class="card-category">{media.category}</span>
            </div>
          </div>
        {/each}
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button
          disabled={currentPage === 0}
          onclick={() => { currentPage--; loadMedia(); }}
        >← 이전</button>
        <span>{currentPage + 1} / {Math.ceil(mediaTotal / PAGE_SIZE)}</span>
        <button
          disabled={(currentPage + 1) * PAGE_SIZE >= mediaTotal}
          onclick={() => { currentPage++; loadMedia(); }}
        >다음 →</button>
      </div>
    {/if}
  </section>

  <!-- ── 상세 모달 ────────────────────────── -->
  {#if selectedMedia}
    <div class="modal-overlay" onclick={() => selectedMedia = null} role="dialog">
      <div class="modal" onclick|stopPropagation role="document">
        <button class="modal-close" onclick={() => selectedMedia = null}>✕</button>

        <div class="modal-content">
          <div class="modal-image">
            <img src={selectedMedia.url} alt={selectedMedia.alt_text || ''} />
          </div>

          <div class="modal-details">
            <h3>상세 정보</h3>
            <table>
              <tr><th>ID</th><td>{selectedMedia.id}</td></tr>
              <tr><th>원본 파일명</th><td>{selectedMedia.original_filename}</td></tr>
              <tr><th>저장 파일명</th><td>{selectedMedia.stored_filename}</td></tr>
              <tr><th>카테고리</th><td>{selectedMedia.category}</td></tr>
              <tr><th>크기</th><td>{formatSize(selectedMedia.file_size)}</td></tr>
              <tr><th>타입</th><td>{selectedMedia.content_type}</td></tr>
              <tr><th>태그</th><td>{selectedMedia.tags || '-'}</td></tr>
              <tr><th>대체 텍스트</th><td>{selectedMedia.alt_text || '-'}</td></tr>
              <tr><th>업로드일</th><td>{new Date(selectedMedia.created_at).toLocaleString('ko-KR')}</td></tr>
            </table>

            <div class="modal-url">
              <label>URL</label>
              <input type="text" readonly value={selectedMedia.url} onclick={(e) => e.target.select()} />
            </div>

            <div class="modal-actions">
              <button class="btn-copy" onclick={() => navigator.clipboard.writeText(selectedMedia.url)}>
                📋 URL 복사
              </button>
              <button class="btn-delete" onclick={() => deleteMedia(selectedMedia.id)}>
                🗑️ 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .page {
    min-height: 100vh;
    background: #1a1a2e;
    color: #eee;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;

    .back-link {
      color: #888;
      text-decoration: none;
      &:hover { color: #fff; }
    }

    h1 { margin: 0; font-size: 1.5rem; }
  }

  /* ── 업로드 섹션 ────────────────────── */
  .upload-section {
    background: #16213e;
    border: 1px solid #0f3460;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 2rem;

    h2 { margin: 0 0 1rem; font-size: 1.2rem; }
  }

  .drop-zone {
    border: 2px dashed #0f3460;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    position: relative;
    transition: border-color 0.2s;

    &:hover, &.drag-over { border-color: #e94560; }

    p { margin: 0; color: #888; }

    .file-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
  }

  .upload-preview {
    margin-top: 1rem;
    padding: 0.75rem;
    background: #0d1b30;
    border-radius: 6px;

    .file-list {
      margin: 0.5rem 0 0;
      padding-left: 1.5rem;
      font-size: 0.85rem;
      color: #aaa;
    }
  }

  .upload-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;

    label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: #aaa;
    }

    select, input {
      padding: 0.5rem;
      background: #0d1b30;
      border: 1px solid #0f3460;
      border-radius: 4px;
      color: #eee;
    }
  }

  .btn-upload {
    margin-top: 1rem;
    padding: 0.75rem 2rem;
    background: #e94560;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    &:hover:not(:disabled) { background: #c73e54; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  .upload-results {
    margin-top: 1rem;
    .result-item {
      padding: 0.4rem 0.75rem;
      border-radius: 4px;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
      &.success { background: rgba(46, 204, 113, 0.15); }
      &.error { background: rgba(233, 69, 96, 0.15); }
    }
  }

  /* ── 라이브러리 ─────────────────────── */
  .library-section {
    h2 { margin: 0; font-size: 1.2rem; }
  }

  .library-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .library-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;

    select, input {
      padding: 0.4rem 0.6rem;
      background: #16213e;
      border: 1px solid #0f3460;
      border-radius: 4px;
      color: #eee;
      font-size: 0.85rem;
    }
  }

  .btn-search {
    padding: 0.4rem 0.8rem;
    background: #0f3460;
    color: #eee;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover { background: #1a4a8a; }
  }

  .btn-delete-batch {
    padding: 0.4rem 0.8rem;
    background: #e94560;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover { background: #c73e54; }
  }

  .loading, .empty {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1rem;
  }

  /* ── 이미지 그리드 ──────────────────── */
  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.75rem;
  }

  .media-card {
    position: relative;
    background: #16213e;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.15s;

    &:hover { border-color: #0f3460; transform: translateY(-1px); }
    &.selected { border-color: #e94560; }

    .card-checkbox {
      position: absolute;
      top: 6px;
      left: 6px;
      z-index: 1;

      input {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }

    .card-image {
      aspect-ratio: 1;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .card-info {
      padding: 0.4rem 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;

      .card-name {
        font-size: 0.75rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-category {
        font-size: 0.65rem;
        color: #888;
        text-transform: uppercase;
      }
    }
  }

  /* ── 페이지네이션 ───────────────────── */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;

    button {
      padding: 0.4rem 0.8rem;
      background: #16213e;
      color: #eee;
      border: 1px solid #0f3460;
      border-radius: 4px;
      cursor: pointer;
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }

    span { font-size: 0.9rem; color: #888; }
  }

  /* ── 모달 ───────────────────────────── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
  }

  .modal {
    background: #16213e;
    border: 1px solid #0f3460;
    border-radius: 12px;
    max-width: 900px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
  }

  .modal-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: none;
    border: none;
    color: #888;
    font-size: 1.4rem;
    cursor: pointer;
    z-index: 1;
    &:hover { color: #fff; }
  }

  .modal-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding: 1.5rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .modal-image {
    border-radius: 8px;
    overflow: hidden;
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }

  .modal-details {
    h3 { margin: 0 0 1rem; font-size: 1.1rem; }

    table {
      width: 100%;
      font-size: 0.85rem;
      border-collapse: collapse;

      th {
        text-align: left;
        color: #888;
        padding: 0.3rem 0.5rem 0.3rem 0;
        white-space: nowrap;
        width: 100px;
      }

      td {
        padding: 0.3rem 0;
        word-break: break-all;
      }
    }
  }

  .modal-url {
    margin-top: 1rem;
    label { font-size: 0.85rem; color: #888; }
    input {
      width: 100%;
      margin-top: 0.25rem;
      padding: 0.4rem;
      background: #0d1b30;
      border: 1px solid #0f3460;
      border-radius: 4px;
      color: #eee;
      font-size: 0.8rem;
    }
  }

  .modal-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
    }

    .btn-copy {
      background: #0f3460;
      color: #eee;
      &:hover { background: #1a4a8a; }
    }

    .btn-delete {
      background: #e94560;
      color: white;
      &:hover { background: #c73e54; }
    }
  }
</style>
