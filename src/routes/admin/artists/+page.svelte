<script>
  import { PIANOLIFE_BACKEND_URL } from '$env/static/public';

  const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';

  // ── 상태 ──────────────────────────────────
  let artists = $state([]);
  let roles = $state([]);
  let concerts = $state([]);
  let loading = $state(false);
  let editing = $state(null);       // 편집 중인 아티스트 객체
  let showForm = $state(false);

  // ── 폼 데이터 ──────────────────────────────
  let form = $state({
    name: '',
    name_en: '',
    role_id: null,
    description: '',
    career: '',
    videos: [],
    notice: '',
    sort_order: 0,
    image_media_id: null,
    concert_ids: [],
  });

  // ── 미디어 선택 ────────────────────────────
  let mediaList = $state([]);
  let showMediaPicker = $state(false);
  let selectedImageUrl = $state('');
  let imageUploading = $state(false);
  let imageDragOver = $state(false);

  // ── 초기 로드 ──────────────────────────────
  $effect(() => {
    loadArtists();
    loadRoles();
    loadConcerts();
  });

  async function loadArtists() {
    loading = true;
    try {
      const res = await fetch(`${API}/api/artists?active_only=false`);
      artists = await res.json();
    } catch (e) {
      console.error('Failed to load artists:', e);
    }
    loading = false;
  }

  async function loadRoles() {
    try {
      const res = await fetch(`${API}/api/roles`);
      roles = await res.json();
    } catch (e) {
      console.error('Failed to load roles:', e);
    }
  }

  async function loadConcerts() {
    try {
      const res = await fetch(`${API}/api/concerts?active_only=false`);
      concerts = await res.json();
    } catch (e) {
      console.error('Failed to load concerts:', e);
    }
  }

  async function loadMedia() {
    try {
      const res = await fetch(`${API}/api/media?category=artist&limit=100`);
      const data = await res.json();
      mediaList = data.items || [];
    } catch (e) {
      console.error('Failed to load media:', e);
    }
  }

  // ── 폼 초기화 ──────────────────────────────
  function resetForm() {
    form = {
      name: '', name_en: '', role_id: null, description: '', career: '',
      videos: [], notice: '', sort_order: 0, image_media_id: null, concert_ids: [],
    };
    selectedImageUrl = '';
    editing = null;
    showForm = false;
  }

  function openCreate() {
    resetForm();
    showForm = true;
  }

  function openEdit(artist) {
    editing = artist;
    form = {
      name: artist.name || '',
      name_en: artist.name_en || '',
      role_id: artist.role_id || null,
      description: artist.description || '',
      career: artist.career || '',
      videos: artist.videos ? [...artist.videos] : [],
      notice: artist.notice || '',
      sort_order: artist.sort_order || 0,
      image_media_id: null,
      concert_ids: (artist.concerts || []).map(c => c.id),
    };
    selectedImageUrl = artist.image_url || '';
    showForm = true;
  }

  // ── Video 관리 ─────────────────────────────
  function addVideo() {
    form.videos = [...form.videos, { id: '', description: '' }];
  }

  function removeVideo(idx) {
    form.videos = form.videos.filter((_, i) => i !== idx);
  }

  // ── Concert 토글 ───────────────────────────
  function toggleConcert(concertId) {
    if (form.concert_ids.includes(concertId)) {
      form.concert_ids = form.concert_ids.filter(id => id !== concertId);
    } else {
      form.concert_ids = [...form.concert_ids, concertId];
    }
  }

  // ── 미디어 선택 ────────────────────────────
  async function openMediaPicker() {
    await loadMedia();
    showMediaPicker = true;
  }

  function selectMedia(media) {
    form.image_media_id = media.id;
    selectedImageUrl = media.url;
    showMediaPicker = false;
  }

  // ── 드래그 앤 드롭 이미지 업로드 ──────────
  async function handleImageDrop(e) {
    e.preventDefault();
    imageDragOver = false;
    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    await uploadAndSelectImage(file);
  }

  async function handleImageFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndSelectImage(file);
  }

  async function uploadAndSelectImage(file) {
    imageUploading = true;
    try {
      // 중복 파일명 체크
      const checkRes = await fetch(`${API}/api/media?limit=10000`);
      const checkData = await checkRes.json();
      const duplicate = (checkData.items || []).find(m => m.original_filename === file.name);
      
      if (duplicate) {
        const proceed = confirm(
          `⚠️ 동일한 파일명이 이미 존재합니다.\n\n` +
          `파일명: ${file.name}\n` +
          `기존 업로드: ${new Date(duplicate.created_at).toLocaleString()}\n` +
          `카테고리: ${duplicate.category}\n\n` +
          `그래도 업로드하시겠습니까?`
        );
        if (!proceed) {
          imageUploading = false;
          return;
        }
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'artist');
      const res = await fetch(`${API}/api/media`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(await res.text());
      const media = await res.json();
      form.image_media_id = media.id;
      selectedImageUrl = media.url;
    } catch (e) {
      alert('이미지 업로드 실패: ' + e.message);
    }
    imageUploading = false;
  }

  // ── 저장 ───────────────────────────────────
  async function saveArtist() {
    const formData = new FormData();
    formData.append('name', form.name);
    if (form.name_en) formData.append('name_en', form.name_en);
    if (form.role_id) formData.append('role_id', String(form.role_id));
    if (form.description) formData.append('description', form.description);
    if (form.career) formData.append('career', form.career);
    if (form.videos.length > 0) formData.append('videos', JSON.stringify(form.videos));
    if (form.notice) formData.append('notice', form.notice);
    formData.append('sort_order', String(form.sort_order));
    if (form.image_media_id) formData.append('image_media_id', String(form.image_media_id));
    if (form.concert_ids.length > 0) formData.append('concert_ids', JSON.stringify(form.concert_ids));

    try {
      const url = editing
        ? `${API}/api/artists/${editing.id}`
        : `${API}/api/artists`;
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error(await res.text());

      resetForm();
      await loadArtists();
    } catch (e) {
      alert('저장 실패: ' + e.message);
    }
  }

  async function deleteArtist(artist) {
    if (!confirm(`"${artist.name}" 아티스트를 삭제하시겠습니까?`)) return;
    try {
      await fetch(`${API}/api/artists/${artist.id}`, { method: 'DELETE' });
      await loadArtists();
    } catch (e) {
      alert('삭제 실패: ' + e.message);
    }
  }

  function getRoleName(roleId) {
    const role = roles.find(r => r.id === roleId);
    return role ? role.label || role.name : '-';
  }
</script>

<svelte:head>
  <title>아티스트 관리 - Admin</title>
</svelte:head>

<div class="page">
  <header class="page-header">
    <div class="header-left">
      <a href="/admin" class="back-link">← Admin</a>
      <h1>아티스트 관리</h1>
    </div>
    <button class="btn-primary" onclick={openCreate}>+ 아티스트 추가</button>
  </header>

  <!-- ── 아티스트 목록 ────────────────────── -->
  {#if loading}
    <p class="loading">로딩 중...</p>
  {:else}
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>순서</th>
            <th>이미지</th>
            <th>이름</th>
            <th>역할</th>
            <th>상태</th>
            <th>콘서트</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {#each artists as artist}
            <tr>
              <td>{artist.sort_order}</td>
              <td>
                {#if artist.image_url}
                  <img src={artist.image_url} alt={artist.name} class="thumb" />
                {:else}
                  <div class="thumb-placeholder"></div>
                {/if}
              </td>
              <td class="name-cell">{artist.name}</td>
              <td>{getRoleName(artist.role_id)}</td>
              <td>
                <span class="badge" class:active={artist.is_active}>
                  {artist.is_active ? '활성' : '비활성'}
                </span>
              </td>
              <td>{(artist.concerts || []).length}개</td>
              <td class="actions">
                <button class="btn-sm btn-edit" onclick={() => openEdit(artist)}>편집</button>
                <button class="btn-sm btn-delete" onclick={() => deleteArtist(artist)}>삭제</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- ── 편집 / 생성 폼 ───────────────────── -->
  {#if showForm}
    <div class="modal-overlay">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <div class="modal" role="dialog" onclick={(e) => e.stopPropagation()}>
        <button class="modal-close" onclick={resetForm}>✕</button>
        <h2>{editing ? '아티스트 편집' : '새 아티스트'}</h2>

        <!-- 기본 정보 -->
        <div class="form-section">
          <h3>기본 정보</h3>
          <label>
            이름 (한글) *
            <input type="text" bind:value={form.name} placeholder="홍길동" required />
          </label>
          <label>
            이름 (영어)
            <input type="text" bind:value={form.name_en} placeholder="Hong Gildong" />
          </label>
          <label>
            역할
            <select bind:value={form.role_id}>
              <option value={null}>선택 안 함</option>
              {#each roles as role}
                <option value={role.id}>{role.label || role.name}</option>
              {/each}
            </select>
          </label>
          <label>
            정렬 순서
            <input type="number" bind:value={form.sort_order} />
          </label>
        </div>

        <!-- 프로필 이미지 -->
        <div class="form-section">
          <h3>프로필 이미지</h3>
          <div
            class="drop-zone"
            class:drag-over={imageDragOver}
            class:has-image={!!selectedImageUrl}
            ondrop={handleImageDrop}
            ondragover={(e) => { e.preventDefault(); imageDragOver = true; }}
            ondragleave={() => imageDragOver = false}
            role="button"
            tabindex="0"
          >
            {#if imageUploading}
              <p class="drop-text">업로드 중...</p>
            {:else if selectedImageUrl}
              <img src={selectedImageUrl} alt="preview" class="preview-img" />
              <p class="drop-hint">다른 이미지를 드래그하여 교체</p>
            {:else}
              <p class="drop-text">이미지를 드래그하거나 클릭하여 선택</p>
            {/if}
            <input
              type="file"
              accept="image/*"
              onchange={handleImageFileSelect}
              class="file-input"
            />
          </div>
          <button type="button" class="btn-secondary btn-sm" onclick={openMediaPicker} style="margin-top: 0.5rem;">
            미디어 라이브러리에서 선택
          </button>
        </div>

        <!-- 소개 -->
        <div class="form-section">
          <h3>소개 (Description)</h3>
          <textarea bind:value={form.description} rows="4" placeholder="아티스트 소개"></textarea>
        </div>

        <!-- 경력 -->
        <div class="form-section">
          <h3>경력 (Career)</h3>
          <textarea bind:value={form.career} rows="4" placeholder="경력 사항"></textarea>
        </div>

        <!-- 공지 -->
        <div class="form-section">
          <h3>공지 (Notice)</h3>
          <textarea bind:value={form.notice} rows="3" placeholder="공지사항"></textarea>
        </div>

        <!-- YouTube 동영상 -->
        <div class="form-section">
          <h3>동영상 (Video)</h3>
          {#each form.videos as video, i}
            <div class="video-row">
              <input type="text" bind:value={video.id} placeholder="YouTube ID" />
              <input type="text" bind:value={video.description} placeholder="설명" />
              <button class="btn-sm btn-delete" onclick={() => removeVideo(i)}>×</button>
            </div>
          {/each}
          <button type="button" class="btn-secondary btn-sm" onclick={addVideo}>+ 동영상 추가</button>
        </div>

        <!-- 콘서트 연결 -->
        <div class="form-section">
          <h3>연결된 콘서트</h3>
          <div class="concert-list">
            {#each concerts as concert}
              <label class="concert-check">
                <input
                  type="checkbox"
                  checked={form.concert_ids.includes(concert.id)}
                  onchange={() => toggleConcert(concert.id)}
                />
                {concert.title} ({concert.date || '날짜 미정'})
              </label>
            {/each}
            {#if concerts.length === 0}
              <p class="empty">등록된 콘서트가 없습니다.</p>
            {/if}
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-primary" onclick={saveArtist} disabled={!form.name}>
            {editing ? '수정' : '생성'}
          </button>
          <button class="btn-secondary" onclick={resetForm}>취소</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- ── 미디어 피커 모달 ──────────────────── -->
  {#if showMediaPicker}
    <div class="modal-overlay">
      <div class="modal media-picker" role="dialog" onclick={(e) => e.stopPropagation()}>
        <button class="modal-close" onclick={() => (showMediaPicker = false)}>✕</button>
        <h2>이미지 선택</h2>
        <div class="media-grid">
          {#each mediaList as media}
            <button class="media-item" onclick={() => selectMedia(media)}>
              <img src={media.url} alt={media.alt_text || media.original_filename} />
              <span class="media-name">{media.original_filename}</span>
            </button>
          {/each}
          {#if mediaList.length === 0}
            <p class="empty">업로드된 아티스트 이미지가 없습니다.</p>
          {/if}
        </div>
        <button class="btn-secondary" onclick={() => (showMediaPicker = false)}>닫기</button>
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

    .back-link {
      color: #888;
      text-decoration: none;
      &:hover { color: #222; }
    }

    h1 { margin: 0; font-size: 1.5rem; color: #111; }
  }

  .loading { text-align: center; color: #999; padding: 3rem; }

  /* ── 테이블 ─────────────────────────── */
  .table-wrap { overflow-x: auto; }
  table {
    width: 100%;
    border-collapse: collapse;
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th { color: #888; font-weight: 500; font-size: 0.85rem; }
    tbody tr:hover { background: #f8f9fa; }
  }

  .thumb {
    width: 48px; height: 48px;
    border-radius: 8px;
    object-fit: cover;
  }
  .thumb-placeholder {
    width: 48px; height: 48px;
    border-radius: 8px;
    background: #eee;
  }

  .name-cell { font-weight: 600; color: #111; }

  .badge {
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
    background: #eee;
    color: #666;
    &.active { background: #dcfce7; color: #166534; }
  }

  .actions { display: flex; gap: 0.5rem; }

  /* ── 버튼 ──────────────────────────── */
  .btn-primary {
    padding: 0.6rem 1.2rem;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    &:hover { background: #1d4ed8; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
  .btn-secondary {
    padding: 0.6rem 1.2rem;
    background: #f3f4f6;
    color: #444;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    &:hover { background: #e5e7eb; }
  }
  .btn-sm { padding: 0.3rem 0.7rem; font-size: 0.85rem; }
  .btn-edit { background: #2563eb; color: #fff; border: none; border-radius: 4px; cursor: pointer; &:hover { background: #1d4ed8; } }
  .btn-delete { background: #dc3545; color: #fff; border: none; border-radius: 4px; cursor: pointer; &:hover { background: #c82333; } }

  /* ── 모달 ──────────────────────────── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem;
    overflow-y: auto;
    z-index: 1000;
  }
  .modal {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 2rem;
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    position: relative;

    h2 { margin: 0 0 1.5rem; font-size: 1.3rem; color: #111; }
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
    &:hover { color: #222; }
  }

  .form-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;

    h3 { margin: 0 0 0.75rem; font-size: 1rem; color: #666; }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: #444;
    }

    input[type="text"],
    input[type="number"],
    select,
    textarea {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      padding: 0.5rem 0.75rem;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      color: #222;
      font-size: 0.9rem;
      &:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
    }
    textarea { resize: vertical; font-family: inherit; }
  }

  /* ── 드래그 앤 드롭 ────────────────── */
  .drop-zone {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    position: relative;
    transition: border-color 0.2s, background 0.2s;

    &:hover, &.drag-over {
      border-color: #2563eb;
      background: #f0f4ff;
    }

    &.has-image {
      padding: 1rem;
    }

    .drop-text { margin: 0; color: #888; }

    .drop-hint {
      margin: 0.5rem 0 0;
      font-size: 0.8rem;
      color: #aaa;
    }

    .file-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    .preview-img {
      max-width: 160px;
      max-height: 160px;
      border-radius: 8px;
      object-fit: cover;
      display: block;
      margin: 0 auto;
    }
  }

  /* ── Video 행 ──────────────────────── */
  .video-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    input { flex: 1; }
  }

  /* ── 콘서트 체크박스 ───────────────── */
  .concert-list {
    max-height: 200px;
    overflow-y: auto;
    padding: 0.5rem;
    background: #f9fafb;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
  }
  .concert-check {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0;
    cursor: pointer;
    color: #333;
    input { cursor: pointer; }
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    justify-content: flex-end;
  }

  /* ── 미디어 피커 ───────────────────── */
  .media-picker { max-width: 800px; }
  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1rem;
    max-height: 400px;
    overflow-y: auto;
  }
  .media-item {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    padding: 0;
    overflow: hidden;
    transition: border-color 0.2s;
    &:hover { border-color: #2563eb; }
    img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
    .media-name {
      display: block;
      padding: 0.3rem;
      font-size: 0.7rem;
      color: #888;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .empty { color: #999; text-align: center; padding: 1rem; }
</style>
