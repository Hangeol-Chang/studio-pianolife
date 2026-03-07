<script>
  import { PIANOLIFE_BACKEND_URL } from '$env/static/public';

  const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';

  // ── 상태 ──────────────────────────────────
  let items = $state([]);
  let loading = $state(false);
  let editing = $state(null);
  let showForm = $state(false);

  // ── 폼 데이터 ──────────────────────────────
  let form = $state({
    title: '',
    start_date: '',
    end_date: '',
    brief_description: '',
    content: '',
    apply_link: '',
    poster_media_id: null,
    banner_image_media_id: null,
    is_active: true,
  });

  // ── 미디어 & 이미지 상태 ─────────────────────
  let mediaList = $state([]);
  let showMediaPicker = $state(false);
  let showBannerMediaPicker = $state(false);
  let selectedPosterUrl = $state('');
  let selectedBannerUrl = $state('');

  let imageDragOver = $state(false);
  let bannerDragOver = $state(false);
  let pendingPosterFile = $state(null);
  let pendingBannerFile = $state(null);

  // ── 초기 로드 ──────────────────────────────
  $effect(() => { loadItems(); });

  async function loadItems() {
    loading = true;
    try {
      const res = await fetch(`${API}/api/auditions?active_only=false`);
      items = await res.json();
    } catch (e) {
      console.error('Failed to load auditions:', e);
    }
    loading = false;
  }

  async function loadMedia() {
    try {
      const res = await fetch(`${API}/api/media?category=concert&limit=100`);
      const data = await res.json();
      mediaList = data.items || [];
    } catch (e) {
      console.error('Failed to load media:', e);
    }
  }

  // ── 폼 초기화 ──────────────────────────────
  function resetForm() {
    form = {
      title: '', start_date: '', end_date: '', brief_description: '', content: '', apply_link: '',
      poster_media_id: null, banner_image_media_id: null, is_active: true,
    };
    selectedPosterUrl = '';
    selectedBannerUrl = '';
    pendingPosterFile = null;
    pendingBannerFile = null;
    editing = null;
    showForm = false;
  }

  function openCreate() {
    resetForm();
    showForm = true;
  }

  function openEdit(item) {
    editing = item;
    form = {
      title: item.title || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      brief_description: item.brief_description || '',
      content: item.content || '',
      apply_link: item.apply_link || '',
      poster_media_id: null,
      banner_image_media_id: null,
      is_active: item.is_active ?? true,
    };
    selectedPosterUrl = item.poster_url || '';
    selectedBannerUrl = item.banner_image_url || '';
    showForm = true;
  }

  // ── 포스터 ────────────────────────────────
  function handleImageDrop(e) {
    e.preventDefault(); imageDragOver = false;
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) setPosterLocally(file);
  }
  function handleImageFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) setPosterLocally(file);
    e.target.value = '';
  }
  function setPosterLocally(file) {
    if (pendingPosterFile?._previewUrl) URL.revokeObjectURL(pendingPosterFile._previewUrl);
    const previewUrl = URL.createObjectURL(file);
    file._previewUrl = previewUrl;
    pendingPosterFile = file;
    form.poster_media_id = null;
    selectedPosterUrl = previewUrl;
  }
  async function flushPendingPoster() {
    if (!pendingPosterFile) return;
    const fd = new FormData();
    fd.append('file', pendingPosterFile);
    fd.append('category', 'concert');
    const res = await fetch(`${API}/api/media`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error(await res.text());
    const media = await res.json();
    form.poster_media_id = media.id;
    selectedPosterUrl = media.url;
    URL.revokeObjectURL(pendingPosterFile._previewUrl);
    pendingPosterFile = null;
  }
  async function openMediaPicker() {
    await loadMedia(); showMediaPicker = true;
  }
  function selectMedia(media) {
    form.poster_media_id = media.id;
    selectedPosterUrl = media.thumb_url || media.url;
    showMediaPicker = false;
  }

  // ── 배너 이미지 ──────────────────────────
  function handleBannerDrop(e) {
    e.preventDefault(); bannerDragOver = false;
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) setBannerLocally(file);
  }
  function handleBannerFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) setBannerLocally(file);
    e.target.value = '';
  }
  function setBannerLocally(file) {
    if (pendingBannerFile?._previewUrl) URL.revokeObjectURL(pendingBannerFile._previewUrl);
    const previewUrl = URL.createObjectURL(file);
    file._previewUrl = previewUrl;
    pendingBannerFile = file;
    form.banner_image_media_id = null;
    selectedBannerUrl = previewUrl;
  }
  async function flushPendingBanner() {
    if (!pendingBannerFile) return;
    const fd = new FormData();
    fd.append('file', pendingBannerFile);
    fd.append('category', 'concert');
    const res = await fetch(`${API}/api/media`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error(await res.text());
    const media = await res.json();
    form.banner_image_media_id = media.id;
    selectedBannerUrl = media.url;
    URL.revokeObjectURL(pendingBannerFile._previewUrl);
    pendingBannerFile = null;
  }
  async function openBannerMediaPicker() {
    await loadMedia(); showBannerMediaPicker = true;
  }
  function selectBannerMedia(media) {
    form.banner_image_media_id = media.id;
    selectedBannerUrl = media.thumb_url || media.url;
    showBannerMediaPicker = false;
  }

  // ── 저장 ───────────────────────────────────
  async function saveItem() {
    try {
      await flushPendingPoster();
      await flushPendingBanner();
    } catch (e) {
      alert('이미지 업로드 실패: ' + e.message);
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    if (form.start_date) formData.append('start_date', form.start_date);
    if (form.end_date) formData.append('end_date', form.end_date);
    if (form.brief_description) formData.append('brief_description', form.brief_description);
    if (form.content) formData.append('content', form.content);
    formData.append('apply_link', form.apply_link || '');
    if (form.poster_media_id) formData.append('poster_media_id', String(form.poster_media_id));
    if (form.banner_image_media_id) formData.append('banner_image_media_id', String(form.banner_image_media_id));
    formData.append('is_active', String(form.is_active));

    try {
      const url = editing ? `${API}/api/auditions/${editing.id}` : `${API}/api/auditions`;
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error(await res.text());
      resetForm();
      await loadItems();
    } catch (e) {
      alert('저장 실패: ' + e.message);
    }
  }

  async function deleteItem(item) {
    if (!confirm(`"${item.title}" 오디션을 삭제하시겠습니까?`)) return;
    try {
      await fetch(`${API}/api/auditions/${item.id}`, { method: 'DELETE' });
      await loadItems();
    } catch (e) {
      alert('삭제 실패: ' + e.message);
    }
  }
</script>

<svelte:head>
  <title>오디션 관리 - Admin</title>
</svelte:head>

<div class="page">
  <header class="page-header">
    <div class="header-left">
      <a href="/admin" class="back-link">← Admin</a>
      <h1>오디션 관리</h1>
    </div>
    <button class="btn-primary" onclick={openCreate}>+ 오디션 추가</button>
  </header>

  {#if loading}
    <p class="loading">로딩 중...</p>
  {:else}
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>포스터</th>
            <th>제목</th>
            <th>시작일</th>
            <th>마감일</th>
            <th>지원 링크</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item}
            <tr>
              <td>
                {#if item.poster_thumb_url || item.poster_url}
                  <img src={item.poster_thumb_url || item.poster_url} alt={item.title} class="thumb" />
                {:else}
                  <div class="thumb-placeholder"></div>
                {/if}
              </td>
              <td class="name-cell">{item.title}</td>
              <td>{item.start_date || '-'}</td>
              <td>{item.end_date || '-'}</td>
              <td>
                {#if item.apply_link}
                  <a href={item.apply_link} target="_blank" rel="noreferrer" class="link-cell">링크</a>
                {:else}
                  -
                {/if}
              </td>
              <td>
                <span class="badge" class:active={item.is_active}>
                  {item.is_active ? '활성' : '비활성'}
                </span>
              </td>
              <td class="actions">
                <button class="btn-sm btn-edit" onclick={() => openEdit(item)}>편집</button>
                <button class="btn-sm btn-delete" onclick={() => deleteItem(item)}>삭제</button>
              </td>
            </tr>
          {/each}
          {#if items.length === 0}
            <tr><td colspan="7" class="empty">등록된 오디션이 없습니다.</td></tr>
          {/if}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- ── 편집 / 생성 폼 ──────────────────── -->
  {#if showForm}
    <div class="modal-overlay">
      <div class="modal" role="none" onclick={(e) => e.stopPropagation()}>
        <button class="modal-close" onclick={resetForm}>✕</button>
        <h2>{editing ? '오디션 편집' : '새 오디션'}</h2>

        <!-- 기본 정보 -->
        <div class="form-section">
          <h3>기본 정보</h3>
          <label>
            제목 *
            <input type="text" bind:value={form.title} placeholder="오디션 제목" required />
          </label>
          <div class="row-2">
            <label>
              시작일
              <input type="date" bind:value={form.start_date} />
            </label>
            <label>
              마감일
              <input type="date" bind:value={form.end_date} />
            </label>
          </div>
          <label>
            지원 링크
            <input type="url" bind:value={form.apply_link} placeholder="https://..." />
          </label>
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={form.is_active} />
            활성 상태
          </label>
        </div>

        <!-- 포스터 -->
        <div class="form-section">
          <h3>포스터</h3>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="drop-zone"
            class:drag-over={imageDragOver}
            class:has-image={!!selectedPosterUrl}
            ondragover={(e) => { e.preventDefault(); imageDragOver = true; }}
            ondragleave={() => (imageDragOver = false)}
            ondrop={handleImageDrop}
          >
            <input type="file" accept="image/*" class="file-input" onchange={handleImageFileSelect} />
            {#if selectedPosterUrl}
              <img src={selectedPosterUrl} alt="poster preview" class="preview-img" />
              {#if pendingPosterFile}
                <p class="drop-hint pending-hint">💾 저장 시 업로드됩니다</p>
              {/if}
            {:else}
              <p class="drop-text">이미지를 드래그하거나 클릭하여 선택</p>
              <p class="drop-hint">저장 버튼을 누를 때 업로드됩니다</p>
            {/if}
          </div>
          <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
            <button type="button" class="btn-secondary" onclick={openMediaPicker}>미디어에서 선택</button>
            {#if selectedPosterUrl}
              <button type="button" class="btn-secondary" onclick={() => { selectedPosterUrl = ''; form.poster_media_id = null; pendingPosterFile = null; }}>제거</button>
            {/if}
          </div>
        </div>

        <!-- 배너 이미지 -->
        <div class="form-section">
          <h3>배너 이미지 (Banner Image)</h3>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="drop-zone banner-drop"
            class:drag-over={bannerDragOver}
            class:has-image={!!selectedBannerUrl}
            ondragover={(e) => { e.preventDefault(); bannerDragOver = true; }}
            ondragleave={() => (bannerDragOver = false)}
            ondrop={handleBannerDrop}
          >
            <input type="file" accept="image/*" class="file-input" onchange={handleBannerFileSelect} />
            {#if selectedBannerUrl}
              <img src={selectedBannerUrl} alt="banner preview" class="preview-img banner-preview" />
              {#if pendingBannerFile}
                <p class="drop-hint pending-hint">💾 저장 시 업로드됩니다</p>
              {/if}
            {:else}
              <p class="drop-text">이미지를 드래그하거나 클릭하여 선택</p>
              <p class="drop-hint">저장 버튼을 누를 때 업로드됩니다</p>
            {/if}
          </div>
          <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
            <button type="button" class="btn-secondary" onclick={openBannerMediaPicker}>미디어에서 선택</button>
            {#if selectedBannerUrl}
              <button type="button" class="btn-secondary" onclick={() => { selectedBannerUrl = ''; form.banner_image_media_id = null; pendingBannerFile = null; }}>제거</button>
            {/if}
          </div>
        </div>

        <!-- 내용 -->
        <div class="form-section">
          <h3>간단 설명</h3>
          <label>
            Brief Description
            <textarea bind:value={form.brief_description} placeholder="오디션 간단 설명 (여러 줄 가능)" style="min-height:80px"></textarea>
          </label>
          <h3 style="margin-top:1rem">상세 내용</h3>
          <textarea bind:value={form.content} placeholder="오디션 상세 내용을 입력하세요"></textarea>
        </div>

        <div class="form-actions">
          <button class="btn-primary" onclick={saveItem} disabled={!form.title}>
            {editing ? '수정' : '등록'}
          </button>
          <button class="btn-secondary" onclick={resetForm}>취소</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- ── 포스터 미디어 피커 모달 ──────────── -->
  {#if showMediaPicker}
    <div class="modal-overlay">
      <div class="modal media-picker" role="none" onclick={(e) => e.stopPropagation()}>
        <button class="modal-close" onclick={() => (showMediaPicker = false)}>✕</button>
        <h2>포스터 이미지 선택</h2>
        <div class="media-grid">
          {#each mediaList as media}
            <button type="button" class="media-item" class:already-selected={form.poster_media_id === media.id} onclick={() => selectMedia(media)}>
              <img src={media.url} alt={media.original_filename} />
              <span class="media-name">{media.original_filename}</span>
            </button>
          {/each}
          {#if mediaList.length === 0}
            <p class="empty">업로드된 이미지가 없습니다.</p>
          {/if}
        </div>
        <button class="btn-secondary" onclick={() => (showMediaPicker = false)}>닫기</button>
      </div>
    </div>
  {/if}

  <!-- ── 배너 미디어 피커 모달 ─────────────── -->
  {#if showBannerMediaPicker}
    <div class="modal-overlay">
      <div class="modal media-picker" role="none" onclick={(e) => e.stopPropagation()}>
        <button class="modal-close" onclick={() => (showBannerMediaPicker = false)}>✕</button>
        <h2>배너 이미지 선택</h2>
        <div class="media-grid">
          {#each mediaList as media}
            <button type="button" class="media-item" class:already-selected={form.banner_image_media_id === media.id} onclick={() => selectBannerMedia(media)}>
              <img src={media.url} alt={media.original_filename} />
              <span class="media-name">{media.original_filename}</span>
            </button>
          {/each}
          {#if mediaList.length === 0}
            <p class="empty">업로드된 이미지가 없습니다.</p>
          {/if}
        </div>
        <button class="btn-secondary" onclick={() => (showBannerMediaPicker = false)}>닫기</button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .page {
    min-height: 100vh;
    background: #ffffff;
    color: #222;
    padding: 2rem;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    .header-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .back-link { color: #888; text-decoration: none; &:hover { color: #222; } }
    h1 { margin: 0; font-size: 1.5rem; color: #111; }
  }

  .loading { text-align: center; color: #999; padding: 3rem; }

  .table-wrap { overflow-x: auto; }
  table {
    width: 100%;
    border-collapse: collapse;
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
    th { color: #888; font-weight: 500; font-size: 0.85rem; }
    tbody tr:hover { background: #f8f9fa; }
  }

  .thumb { width: 60px; height: 80px; border-radius: 6px; object-fit: cover; }
  .thumb-placeholder { width: 60px; height: 80px; border-radius: 6px; background: #eee; }
  .name-cell { font-weight: 600; color: #111; }
  .link-cell { color: #2563eb; text-decoration: none; &:hover { text-decoration: underline; } }

  .badge {
    padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;
    background: #eee; color: #666;
    &.active { background: #dcfce7; color: #166534; }
  }

  .actions { display: flex; gap: 0.5rem; }
  .empty { text-align: center; color: #999; padding: 2rem; }

  .btn-primary {
    padding: 0.6rem 1.2rem; background: #2563eb; color: #fff;
    border: none; border-radius: 6px; cursor: pointer;
    &:hover { background: #1d4ed8; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
  .btn-secondary {
    padding: 0.6rem 1.2rem; background: #f3f4f6; color: #444;
    border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer;
    &:hover { background: #e5e7eb; }
  }
  .btn-sm { padding: 0.3rem 0.7rem; font-size: 0.85rem; border-radius: 4px; border: none; cursor: pointer; }
  .btn-edit { background: #2563eb; color: #fff; &:hover { background: #1d4ed8; } }
  .btn-delete { background: #dc3545; color: #fff; &:hover { background: #c82333; } }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.4);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 2rem; overflow-y: auto; z-index: 1000;
  }
  .modal {
    background: #fff; border: 1px solid #e0e0e0; border-radius: 12px;
    padding: 2rem; width: 100%; max-width: 700px; max-height: 90vh;
    overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); position: relative;
    h2 { margin: 0 0 1.5rem; font-size: 1.3rem; color: #111; }
  }
  .modal-close {
    position: absolute; top: 0.75rem; right: 0.75rem;
    background: none; border: none; color: #888; font-size: 1.4rem; cursor: pointer; z-index: 1;
    &:hover { color: #222; }
  }

  .form-section {
    margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #eee;
    h3 { margin: 0 0 0.75rem; font-size: 1rem; color: #666; }
    label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #444; }
    input[type="text"], input[type="date"], input[type="url"], textarea {
      display: block; width: 100%; margin-top: 0.25rem;
      padding: 0.5rem 0.75rem; background: #fff; border: 1px solid #d1d5db;
      border-radius: 6px; color: #222; font-size: 0.9rem;
      &:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
    }
    textarea { resize: vertical; font-family: inherit; min-height: 200px; }
  }

  .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .checkbox-label {
    display: flex !important; align-items: center; gap: 0.5rem; cursor: pointer;
    input { width: auto; margin: 0; cursor: pointer; }
  }

  .drop-zone {
    border: 2px dashed #d1d5db; border-radius: 8px; padding: 2rem;
    text-align: center; cursor: pointer; position: relative;
    transition: border-color 0.2s, background 0.2s;
    &:hover, &.drag-over { border-color: #2563eb; background: #f0f4ff; }
    &.has-image { padding: 1rem; }
    .drop-text { margin: 0; color: #888; }
    .drop-hint { margin: 0.5rem 0 0; font-size: 0.8rem; color: #aaa; }
    .pending-hint { color: #f59e0b; font-weight: 500; }
    .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .preview-img {
      max-width: 200px; max-height: 200px; border-radius: 8px;
      object-fit: contain; display: block; margin: 0 auto;
    }
  }

  .drop-zone.banner-drop {
    aspect-ratio: 16 / 5;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    &.has-image { padding: 0.5rem; }
  }
  .banner-preview {
    max-width: 100%; max-height: 180px; border-radius: 6px;
    object-fit: cover; display: block; margin: 0 auto;
  }

  .form-actions {
    display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: flex-end;
  }

  .media-picker { max-width: 800px; }
  .media-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem; margin-bottom: 1rem; max-height: 400px; overflow-y: auto;
  }
  .media-item {
    background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px;
    cursor: pointer; padding: 0; overflow: hidden; transition: border-color 0.2s;
    &:hover { border-color: #2563eb; }
    &.already-selected { border-color: #2563eb; opacity: 0.6; cursor: default; }
    img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
    .media-name {
      display: block; padding: 0.3rem; font-size: 0.7rem; color: #888;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
  }

  .empty { color: #999; text-align: center; padding: 1rem; }
</style>
