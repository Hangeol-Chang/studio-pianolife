<script>
  import { PIANOLIFE_BACKEND_URL } from '$env/static/public';

  const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';

  // ── 갤러리 목록 ─────────────────────────────────────
  let gallery = $state([]);
  let galleryLoading = $state(true);

  async function loadGallery() {
    galleryLoading = true;
    try {
      const res = await fetch(`${API}/api/gallery/?sort=recent`);
      if (res.ok) gallery = await res.json();
    } catch (e) {
      console.error('Failed to load gallery:', e);
    }
    galleryLoading = false;
  }

  async function deleteGalleryItem(id) {
    if (!confirm('갤러리에서 이 이미지를 제거하시겠습니까?\n(미디어 원본은 삭제되지 않습니다)')) return;
    try {
      const res = await fetch(`${API}/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) await loadGallery();
      else alert('삭제 실패: ' + res.statusText);
    } catch (e) {
      alert('삭제 오류: ' + e.message);
    }
  }

  // ── 추가 패널 탭 ─────────────────────────────────────
  /** @type {'media' | 'upload'} */
  let addTab = $state('media');

  // 폼 공통
  let addTitle = $state('');
  let addCategory = $state('');
  let addSortOrder = $state(0);
  let adding = $state(false);

  // ── 탭 1: 미디어 라이브러리에서 선택 ────────────────
  let mediaList = $state([]);
  let mediaTotal = $state(0);
  let mediaLoading = $state(false);
  let mediaPage = $state(0);
  let mediaFilter = $state('');
  let mediaSearch = $state('');
  let pickedMedia = $state(null);  // 선택된 미디어 객체
  const MEDIA_PAGE_SIZE = 20;

  const mediaCategories = [
    { value: 'artist', label: '아티스트' },
    { value: 'concert', label: '콘서트' },
    { value: 'gallery', label: '갤러리' },
    { value: 'general', label: '일반' },
  ];

  async function loadMedia() {
    mediaLoading = true;
    try {
      const params = new URLSearchParams({
        skip: String(mediaPage * MEDIA_PAGE_SIZE),
        limit: String(MEDIA_PAGE_SIZE),
      });
      if (mediaFilter) params.set('category', mediaFilter);
      if (mediaSearch) params.set('search', mediaSearch);
      const res = await fetch(`${API}/api/media?${params}`);
      const data = await res.json();
      mediaList = data.items || [];
      mediaTotal = data.total || 0;
    } catch (e) {
      console.error('Failed to load media:', e);
    }
    mediaLoading = false;
  }

  async function addFromMedia() {
    if (!pickedMedia) return;
    adding = true;
    try {
      const formData = new FormData();
      formData.append('media_id', String(pickedMedia.id));
      if (addTitle) formData.append('title', addTitle);
      if (addCategory) formData.append('category', addCategory);
      formData.append('sort_order', String(addSortOrder));

      const res = await fetch(`${API}/api/gallery/`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(await res.text());
      pickedMedia = null;
      addTitle = '';
      addCategory = '';
      addSortOrder = 0;
      await loadGallery();
    } catch (e) {
      alert('추가 실패: ' + e.message);
    }
    adding = false;
  }

  // ── 탭 2: 직접 업로드 ────────────────────────────────
  let dropFiles = $state([]);
  let dragOver = $state(false);
  let uploadCategory = $state('gallery');
  let uploading = $state(false);
  let uploadResults = $state([]);

  function handleDrop(e) {
    e.preventDefault();
    dragOver = false;
    dropFiles = Array.from(e.dataTransfer?.files || []).filter(f => f.type.startsWith('image/'));
  }

  function handleFileInput(e) {
    dropFiles = Array.from(e.target.files || []);
    uploadResults = [];
  }

  function removeDropFile(idx) {
    dropFiles = dropFiles.filter((_, i) => i !== idx);
  }

  async function uploadAndAdd() {
    if (!dropFiles.length) return;
    uploading = true;
    uploadResults = [];

    for (const file of dropFiles) {
      try {
        // 1단계: media 업로드
        const mForm = new FormData();
        mForm.append('file', file);
        mForm.append('category', uploadCategory);
        if (addTitle) mForm.append('alt_text', addTitle);

        const mRes = await fetch(`${API}/api/media`, { method: 'POST', body: mForm });
        if (!mRes.ok) throw new Error('미디어 업로드 실패: ' + (await mRes.text()));
        const media = await mRes.json();

        // 2단계: gallery_images에 추가
        const gForm = new FormData();
        gForm.append('media_id', String(media.id));
        if (addTitle) gForm.append('title', addTitle);
        if (addCategory) gForm.append('category', addCategory);
        gForm.append('sort_order', String(addSortOrder));

        const gRes = await fetch(`${API}/api/gallery/`, { method: 'POST', body: gForm });
        if (!gRes.ok) throw new Error('갤러리 추가 실패: ' + (await gRes.text()));

        uploadResults = [...uploadResults, { success: true, name: file.name }];
      } catch (e) {
        uploadResults = [...uploadResults, { success: false, name: file.name, error: e.message }];
      }
    }

    uploading = false;
    dropFiles = [];
    addTitle = '';
    addCategory = '';
    addSortOrder = 0;
    await loadGallery();
  }

  // ── 유틸 ──────────────────────────────────────────────
  function formatSize(bytes) {
    if (!bytes) return '-';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // 초기 로드
  $effect(() => {
    loadGallery();
    loadMedia();
  });
</script>

<svelte:head>
  <title>갤러리 관리 - Admin</title>
</svelte:head>

<div class="page">
  <header class="page-header">
    <a href="/admin" class="back-link">← Admin</a>
    <h1>🖼️ 갤러리 관리</h1>
  </header>

  <div class="layout">

    <!-- ── 왼쪽: 현재 갤러리 ───────────────────────── -->
    <section class="gallery-section">
      <div class="section-head">
        <h2>등록된 이미지 <span class="count">({gallery.length})</span></h2>
      </div>

      {#if galleryLoading}
        <div class="state-msg">로딩 중...</div>
      {:else if gallery.length === 0}
        <div class="state-msg empty">등록된 이미지가 없습니다.<br/>오른쪽 패널에서 추가해주세요.</div>
      {:else}
        <div class="gallery-grid">
          {#each gallery as item}
            <div class="gallery-card">
              <div class="card-img-wrap">
                <img src={item.image_url} alt={item.title || ''} loading="lazy" />
                <button
                  class="card-delete"
                  onclick={() => deleteGalleryItem(item.id)}
                  aria-label="제거"
                >✕</button>
              </div>
              <div class="card-meta">
                <span class="card-title" title={item.title}>{item.title || '(제목 없음)'}</span>
                <span class="card-tags">
                  {#if item.category}<span class="tag">{item.category}</span>{/if}
                  <span class="date">{formatDate(item.created_at)}</span>
                </span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>

    <!-- ── 오른쪽: 추가 패널 ─────────────────────────── -->
    <aside class="add-panel">
      <h2>이미지 추가</h2>

      <!-- 탭 -->
      <div class="tabs">
        <button
          class="tab {addTab === 'media' ? 'active' : ''}"
          onclick={() => addTab = 'media'}
        >📂 미디어에서 선택</button>
        <button
          class="tab {addTab === 'upload' ? 'active' : ''}"
          onclick={() => addTab = 'upload'}
        >⬆️ 직접 업로드</button>
      </div>

      <!-- 공통 메타 필드 -->
      <div class="meta-fields">
        <label>
          제목 (선택)
          <input type="text" bind:value={addTitle} placeholder="이미지 제목" />
        </label>
        <div class="row-2">
          <label>
            카테고리
            <input type="text" bind:value={addCategory} placeholder="예: concert" />
          </label>
          <label>
            순서
            <input type="number" bind:value={addSortOrder} min="0" />
          </label>
        </div>
      </div>

      <!-- ── 탭 1: 미디어 선택 ── -->
      {#if addTab === 'media'}
        <div class="media-picker">
          <!-- 필터/검색 -->
          <div class="picker-controls">
            <select bind:value={mediaFilter} onchange={() => { mediaPage = 0; loadMedia(); }}>
              <option value="">전체 카테고리</option>
              {#each mediaCategories as cat}
                <option value={cat.value}>{cat.label}</option>
              {/each}
            </select>
            <input
              type="text"
              placeholder="검색..."
              bind:value={mediaSearch}
              onkeydown={(e) => { if (e.key === 'Enter') { mediaPage = 0; loadMedia(); } }}
            />
            <button class="btn-sm" onclick={() => { mediaPage = 0; loadMedia(); }}>검색</button>
          </div>

          <!-- 선택된 미디어 미리보기 -->
          {#if pickedMedia}
            <div class="picked-preview">
              <img src={pickedMedia.url} alt="" />
              <div class="picked-info">
                <span class="picked-name">{pickedMedia.original_filename}</span>
                <span class="picked-cat">{pickedMedia.category} · {formatSize(pickedMedia.file_size)}</span>
              </div>
              <button class="btn-cancel-pick" onclick={() => pickedMedia = null}>✕</button>
            </div>
          {/if}

          <!-- 미디어 그리드 -->
          {#if mediaLoading}
            <div class="state-msg">로딩 중...</div>
          {:else if mediaList.length === 0}
            <div class="state-msg empty">이미지가 없습니다.</div>
          {:else}
            <div class="picker-grid">
              {#each mediaList as media}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div
                  class="picker-card {pickedMedia?.id === media.id ? 'picked' : ''}"
                  onclick={() => pickedMedia = (pickedMedia?.id === media.id ? null : media)}
                  role="button"
                  tabindex="0"
                >
                  <img src={media.url} alt={media.alt_text || media.original_filename} loading="lazy" />
                  {#if pickedMedia?.id === media.id}
                    <div class="picker-check">✓</div>
                  {/if}
                </div>
              {/each}
            </div>

            <div class="pagination">
              <button disabled={mediaPage === 0} onclick={() => { mediaPage--; loadMedia(); }}>←</button>
              <span>{mediaPage + 1} / {Math.max(1, Math.ceil(mediaTotal / MEDIA_PAGE_SIZE))}</span>
              <button
                disabled={(mediaPage + 1) * MEDIA_PAGE_SIZE >= mediaTotal}
                onclick={() => { mediaPage++; loadMedia(); }}
              >→</button>
            </div>
          {/if}

          <button
            class="btn-add"
            onclick={addFromMedia}
            disabled={!pickedMedia || adding}
          >{adding ? '추가 중...' : '갤러리에 추가'}</button>
        </div>

      <!-- ── 탭 2: 직접 업로드 ── -->
      {:else}
        <div class="upload-tab">
          <!-- 업로드 카테고리 -->
          <label class="upload-cat-label">
            미디어 카테고리
            <select bind:value={uploadCategory}>
              {#each mediaCategories as cat}
                <option value={cat.value}>{cat.label}</option>
              {/each}
            </select>
          </label>

          <!-- 드롭존 -->
          <div
            class="drop-zone {dragOver ? 'drag-over' : ''}"
            ondrop={handleDrop}
            ondragover={(e) => { e.preventDefault(); dragOver = true; }}
            ondragleave={() => dragOver = false}
            role="button"
            tabindex="0"
          >
            <p>📁 파일을 드래그하거나 클릭하여 선택</p>
            <p class="drop-hint">여러 파일 동시 선택 가능</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onchange={handleFileInput}
              class="file-input"
            />
          </div>

          {#if dropFiles.length > 0}
            <ul class="drop-file-list">
              {#each dropFiles as file, i}
                <li>
                  <span class="file-thumb-wrap">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      class="file-thumb"
                    />
                  </span>
                  <span class="file-name">{file.name}</span>
                  <span class="file-size">({formatSize(file.size)})</span>
                  <button class="btn-remove-file" onclick={() => removeDropFile(i)}>✕</button>
                </li>
              {/each}
            </ul>
          {/if}

          {#if uploadResults.length > 0}
            <div class="upload-results">
              {#each uploadResults as r}
                <div class="result-item {r.success ? 'ok' : 'err'}">
                  {r.success ? '✅' : '❌'} {r.name}{r.error ? ' — ' + r.error : ''}
                </div>
              {/each}
            </div>
          {/if}

          <button
            class="btn-add"
            onclick={uploadAndAdd}
            disabled={!dropFiles.length || uploading}
          >{uploading ? '업로드 중...' : `업로드 후 갤러리에 추가 (${dropFiles.length})`}</button>
        </div>
      {/if}
    </aside>
  </div>
</div>

<style lang="scss">
  .page {
    min-height: 100vh;
    background: #fff;
    color: #222;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;

    .back-link { color: #888; text-decoration: none; &:hover { color: #222; } }
    h1 { margin: 0; font-size: 1.5rem; color: #111; }
  }

  /* ── 2-column layout ── */
  .layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 2rem;
    align-items: start;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  /* ── 섹션 헤더 ── */
  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.15rem;
    color: #111;
    font-weight: 600;
  }

  .count { font-weight: 400; color: #888; font-size: 0.9rem; }

  .state-msg {
    text-align: center;
    padding: 3rem 1rem;
    color: #aaa;
    font-size: 0.95rem;
    &.empty { line-height: 1.7; }
  }

  /* ── 갤러리 그리드 ── */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }

  .gallery-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    background: #fafafa;
    transition: box-shadow 0.2s;

    &:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.1); }
  }

  .card-img-wrap {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .card-delete {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0,0,0,0.55);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;

    .gallery-card:hover & { opacity: 1; }
    &:hover { background: #dc3545; }
  }

  .card-meta {
    padding: 0.4rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .card-title {
    font-size: 0.78rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-tags {
    display: flex;
    gap: 0.3rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .tag {
    font-size: 0.65rem;
    background: #e0f2fe;
    color: #0369a1;
    padding: 0.1rem 0.4rem;
    border-radius: 99px;
    text-transform: uppercase;
  }

  .date { font-size: 0.65rem; color: #bbb; }

  /* ── 추가 패널 ── */
  .add-panel {
    background: #f8f9fa;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    position: sticky;
    top: 1.5rem;
  }

  /* ── 탭 ── */
  .tabs {
    display: flex;
    gap: 0;
    margin-bottom: 1.25rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    overflow: hidden;
  }

  .tab {
    flex: 1;
    padding: 0.6rem 0.5rem;
    font-size: 0.8rem;
    background: #fff;
    border: none;
    cursor: pointer;
    color: #666;
    transition: background 0.2s, color 0.2s;

    &:not(:last-child) { border-right: 1px solid #d1d5db; }
    &.active { background: #111; color: #fff; font-weight: 500; }
    &:hover:not(.active) { background: #f3f4f6; }
  }

  /* ── 공통 메타 필드 ── */
  .meta-fields {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid #e5e7eb;

    label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8rem;
      color: #666;
    }

    input, select {
      padding: 0.45rem 0.6rem;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 5px;
      color: #222;
      font-size: 0.85rem;

      &:focus { outline: none; border-color: #2563eb; }
    }
  }

  .row-2 {
    display: grid;
    grid-template-columns: 1fr 80px;
    gap: 0.5rem;
  }

  /* ── 미디어 피커 ── */
  .media-picker { display: flex; flex-direction: column; gap: 0.75rem; }

  .picker-controls {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;

    select, input {
      flex: 1;
      min-width: 80px;
      padding: 0.4rem 0.5rem;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 5px;
      color: #222;
      font-size: 0.8rem;
    }
  }

  .btn-sm {
    padding: 0.4rem 0.7rem;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
    &:hover { background: #1d4ed8; }
  }

  /* 선택 프리뷰 */
  .picked-preview {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.5rem;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;

    img { width: 44px; height: 44px; object-fit: cover; border-radius: 4px; }

    .picked-info { flex: 1; min-width: 0; }
    .picked-name {
      display: block;
      font-size: 0.78rem;
      color: #1e40af;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .picked-cat { font-size: 0.68rem; color: #60a5fa; }

    .btn-cancel-pick {
      background: none;
      border: none;
      color: #93c5fd;
      cursor: pointer;
      font-size: 1rem;
      flex-shrink: 0;
      &:hover { color: #1e40af; }
    }
  }

  .picker-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.4rem;
    max-height: 320px;
    overflow-y: auto;
  }

  .picker-card {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    border: 2px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    transition: border-color 0.15s;

    img { width: 100%; height: 100%; object-fit: cover; display: block; }

    &:hover { border-color: #93c5fd; }
    &.picked { border-color: #2563eb; }
  }

  .picker-check {
    position: absolute;
    inset: 0;
    background: rgba(37, 99, 235, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.2rem;
    font-weight: 700;
  }

  /* ── 업로드 탭 ── */
  .upload-tab { display: flex; flex-direction: column; gap: 0.75rem; }

  .upload-cat-label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.8rem;
    color: #666;

    select {
      padding: 0.45rem 0.6rem;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 5px;
      color: #222;
      font-size: 0.85rem;
    }
  }

  .drop-zone {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 1.5rem 1rem;
    text-align: center;
    cursor: pointer;
    position: relative;
    transition: border-color 0.2s, background 0.2s;

    &.drag-over { border-color: #2563eb; background: #f0f4ff; }
    &:hover { border-color: #93c5fd; }

    p { margin: 0.2rem 0; color: #888; font-size: 0.85rem; }
    .drop-hint { font-size: 0.75rem; color: #bbb; }

    .file-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
  }

  .drop-file-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    max-height: 200px;
    overflow-y: auto;

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.3rem 0.5rem;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 5px;
      font-size: 0.8rem;
    }

    .file-thumb-wrap { flex-shrink: 0; }
    .file-thumb { width: 32px; height: 32px; object-fit: cover; border-radius: 3px; }
    .file-name { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #333; }
    .file-size { flex-shrink: 0; color: #aaa; font-size: 0.72rem; }

    .btn-remove-file {
      flex-shrink: 0;
      background: none;
      border: none;
      color: #bbb;
      cursor: pointer;
      font-size: 0.85rem;
      &:hover { color: #dc3545; }
    }
  }

  .upload-results {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .result-item {
      padding: 0.35rem 0.6rem;
      border-radius: 4px;
      font-size: 0.8rem;
      &.ok { background: rgba(34,197,94,0.1); color: #166534; }
      &.err { background: rgba(220,53,69,0.1); color: #991b1b; }
    }
  }

  /* ── 공통 버튼 ── */
  .btn-add {
    width: 100%;
    padding: 0.75rem;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 0.25rem;

    &:hover:not(:disabled) { background: #374151; }
    &:disabled { opacity: 0.45; cursor: not-allowed; }
  }

  /* ── 페이지네이션 ── */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;

    button {
      padding: 0.3rem 0.7rem;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      cursor: pointer;
      color: #444;
      font-size: 0.85rem;
      &:hover { background: #f3f4f6; }
      &:disabled { opacity: 0.35; cursor: not-allowed; }
    }

    span { font-size: 0.82rem; color: #888; }
  }
</style>
