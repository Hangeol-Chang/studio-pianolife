<script>
  import { PIANOLIFE_BACKEND_URL } from '$env/static/public';

  const API = PIANOLIFE_BACKEND_URL || 'http://localhost:8000';

  // ── 상태 ──────────────────────────────────
  let concerts = $state([]);
  let artists = $state([]);
  let loading = $state(false);
  let editing = $state(null);
  let showForm = $state(false);

  // ── 폼 데이터 ──────────────────────────────
  let form = $state({
    title: '',
    date: '',
    time: '',
    brief_description: '',
    location: '',
    location_data: null,
    poster_media_id: null,
    program: [],
    artist_ids: [],
    is_active: true,
  });

  // ── 미디어 선택 ────────────────────────────
  let mediaList = $state([]);
  let showMediaPicker = $state(false);
  let selectedPosterUrl = $state('');

  // ── 드래그 앤 드롭 ────────────────────────────
  let imageUploading = $state(false);
  let imageDragOver = $state(false);
  // ── 장소 검색 ────────────────────────────
  let placeQuery = $state('');
  let placeResults = $state([]);
  let placeSearching = $state(false);
  let showPlaceResults = $state(false);
  // ── 초기 로드 ──────────────────────────────
  $effect(() => {
    loadConcerts();
    loadArtists();
  });

  async function loadConcerts() {
    loading = true;
    try {
      const res = await fetch(`${API}/api/concerts?active_only=false`);
      concerts = await res.json();
    } catch (e) {
      console.error('Failed to load concerts:', e);
    }
    loading = false;
  }

  async function loadArtists() {
    try {
      const res = await fetch(`${API}/api/artists?active_only=false`);
      artists = await res.json();
    } catch (e) {
      console.error('Failed to load artists:', e);
    }
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
      title: '', date: '', time: '', brief_description: '', reserve_link: '', cost: '',
      location: '', location_data: null, poster_media_id: null, program: [], artist_ids: [], is_active: true,
    };
    selectedPosterUrl = '';
    placeQuery = '';
    placeResults = [];
    showPlaceResults = false;
    editing = null;
    showForm = false;
  }

  function openCreate() {
    resetForm();
    showForm = true;
  }

  function openEdit(concert) {
    console.log(concert);

    editing = concert;
    // date 분리: "2026-03-15 19:30" → date="2026-03-15", time="19:30"
    let dateStr = '';
    let timeStr = '';
    if (concert.date) {
      const parts = concert.date.split(' ');
      dateStr = parts[0] || '';
      timeStr = parts[1] || '';
    }
    form = {
      title: concert.title || '',
      date: dateStr,
      time: timeStr,
      brief_description: concert.brief_description || '',
      reserve_link: concert.reserve_link || '',
      cost: concert.cost || '',
      location: concert.location || '',
      location_data: concert.location_data || null,
      poster_media_id: null,
      program: concert.program ? concert.program.map(p => ({
        ...p,
        player_ids: p.player_ids || (p.player_id ? [p.player_id] : []),
      })) : [],
      artist_ids: (concert.artists || []).map(a => a.id),
      is_active: concert.is_active ?? true,
    };
    selectedPosterUrl = concert.poster_url || '';
    placeQuery = '';
    placeResults = [];
    showPlaceResults = false;
    programPlayerQuery = (form.program || []).map(() => '');
    programPlayerOpen = (form.program || []).map(() => false);
    showForm = true;
  }

  // ── Program 관리 ───────────────────────────
  // 각 프로그램 행의 연주자 검색 상태 (인덱스별)
  let programPlayerQuery = $state([]);
  let programPlayerOpen = $state([]);

  function addProgram() {
    form.program = [...form.program, { composer: '', title: '', player_ids: [] }];
    programPlayerQuery = [...programPlayerQuery, ''];
    programPlayerOpen = [...programPlayerOpen, false];
  }

  function removeProgram(idx) {
    form.program = form.program.filter((_, i) => i !== idx);
    programPlayerQuery = programPlayerQuery.filter((_, i) => i !== idx);
    programPlayerOpen = programPlayerOpen.filter((_, i) => i !== idx);
  }

  function addProgramPlayer(progIdx, artistId) {
    const prog = form.program[progIdx];
    if (!prog.player_ids) prog.player_ids = [];
    if (!prog.player_ids.includes(artistId)) {
      form.program[progIdx] = { ...prog, player_ids: [...prog.player_ids, artistId] };
    }
    // 연결 아티스트에도 자동 추가
    if (!form.artist_ids.includes(artistId)) {
      form.artist_ids = [...form.artist_ids, artistId];
    }
    programPlayerQuery[progIdx] = '';
    programPlayerOpen[progIdx] = false;
  }

  function removeProgramPlayer(progIdx, artistId) {
    const prog = form.program[progIdx];
    form.program[progIdx] = { ...prog, player_ids: (prog.player_ids || []).filter(id => id !== artistId) };
  }

  function getProgramPlayerResults(progIdx) {
    const q = (programPlayerQuery[progIdx] || '').trim().toLowerCase();
    if (!q) return [];
    const taken = form.program[progIdx]?.player_ids || [];
    return artists.filter(a =>
      !taken.includes(a.id) &&
      ((a.name || '').toLowerCase().includes(q) || (a.name_en || '').toLowerCase().includes(q))
    );
  }

  // ── 미디어 선택 ────────────────────────────
  async function openMediaPicker() {
    await loadMedia();
    showMediaPicker = true;
  }

  function selectMedia(media) {
    form.poster_media_id = media.id;
    selectedPosterUrl = media.url;
    showMediaPicker = false;
  }

  // ── 드래그 앤 드롭 업로드 ──────────────────────
  function handleImageDrop(e) {
    e.preventDefault();
    imageDragOver = false;
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) uploadAndSelectImage(file);
  }

  function handleImageFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) uploadAndSelectImage(file);
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

      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', 'concert');
      const res = await fetch(`${API}/api/media`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      const media = await res.json();
      form.poster_media_id = media.id;
      selectedPosterUrl = media.url;
    } catch (e) {
      alert('이미지 업로드 실패: ' + e.message);
    }
    imageUploading = false;
  }

  // ── 저장 ───────────────────────────────────
  async function saveConcert() {
    const combinedDate = form.time
      ? `${form.date} ${form.time}`
      : form.date;

    const formData = new FormData();
    formData.append('title', form.title);
    if (combinedDate) formData.append('date', combinedDate);
    if (form.brief_description) formData.append('brief_description', form.brief_description);
    formData.append('reserve_link', form.reserve_link || '');
    formData.append('cost', form.cost || '');
    // 빈 값도 항상 전송 — 지운 경우 DB에서도 지워지도록
    formData.append('location', form.location || '');
    formData.append('location_data', form.location_data ? JSON.stringify(form.location_data) : '');
    if (form.poster_media_id) formData.append('poster_media_id', String(form.poster_media_id));
    if (form.program.length > 0) {
      // player_name / player_names 등 서버가 채워주는 필드는 제거하고 전송
      const programPayload = form.program.map(({ composer, title, player_ids }) => ({
        composer, title, player_ids: player_ids || [],
      }));
      formData.append('program', JSON.stringify(programPayload));
    }
    formData.append('artist_ids', JSON.stringify(form.artist_ids));
    formData.append('is_active', String(form.is_active));

    try {
      const url = editing
        ? `${API}/api/concerts/${editing.id}`
        : `${API}/api/concerts`;
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error(await res.text());

      resetForm();
      await loadConcerts();
    } catch (e) {
      alert('저장 실패: ' + e.message);
    }
  }

  async function deleteConcert(concert) {
    if (!confirm(`"${concert.title}" 콘서트를 삭제하시겠습니까?`)) return;
    try {
      await fetch(`${API}/api/concerts/${concert.id}`, { method: 'DELETE' });
      await loadConcerts();
    } catch (e) {
      alert('삭제 실패: ' + e.message);
    }
  }

  function getArtistName(playerId) {
    const artist = artists.find(a => a.id === playerId);
    return artist ? artist.name : '';
  }

  // ── 아티스트 검색 & 선택 ───────────────────────
  let artistQuery = $state('');
  let showArtistResults = $state(false);
  let filteredArtistResults = $derived(
    artistQuery.trim()
      ? artists.filter(a =>
          !form.artist_ids.includes(a.id) &&
          ((a.name || '').toLowerCase().includes(artistQuery.trim().toLowerCase()) ||
           (a.name_en || '').toLowerCase().includes(artistQuery.trim().toLowerCase()))
        )
      : []
  );
  let selectedArtists = $derived(
    form.artist_ids.map(id => artists.find(a => a.id === id)).filter(Boolean)
  );

  function addArtist(artistId) {
    form.artist_ids = [...form.artist_ids, artistId];
    artistQuery = '';
    showArtistResults = false;
  }
  function removeArtist(artistId) {
    form.artist_ids = form.artist_ids.filter(id => id !== artistId);
  }

  // ── 장소 검색 ──────────────────────────────
  let placeSearchTimer;

  function onPlaceInput() {
    clearTimeout(placeSearchTimer);
    if (!placeQuery.trim()) {
      placeResults = [];
      showPlaceResults = false;
      return;
    }
    placeSearchTimer = setTimeout(() => searchPlaces(), 400);
  }

  async function searchPlaces() {
    if (!placeQuery.trim()) return;
    placeSearching = true;
    showPlaceResults = true;
    try {
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(placeQuery)}`);
      const data = await res.json();
      placeResults = data.items || [];
    } catch (e) {
      console.error('Place search failed:', e);
      placeResults = [];
    }
    placeSearching = false;
  }

  function selectPlace(place) {
    form.location = place.title;
    form.location_data = {
      title: place.title,
      address: place.address,
      roadAddress: place.roadAddress,
      mapx: place.mapx,
      mapy: place.mapy,
      link: place.link,
      category: place.category,
    };
    placeQuery = '';
    placeResults = [];
    showPlaceResults = false;
  }

  function clearPlace() {
    form.location = '';
    form.location_data = null;
  }
</script>

<svelte:head>
  <title>공연 관리 - Admin</title>
</svelte:head>

<div class="page">
  <header class="page-header">
    <div class="header-left">
      <a href="/admin" class="back-link">← Admin</a>
      <h1>공연 관리</h1>
    </div>
    <button class="btn-primary" onclick={openCreate}>+ 공연 추가</button>
  </header>

  <!-- ── 콘서트 목록 ─────────────────────── -->
  {#if loading}
    <p class="loading">로딩 중...</p>
  {:else}
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>포스터</th>
            <th>제목</th>
            <th>날짜/시간</th>
            <th>장소</th>
            <th>프로그램</th>
            <th>아티스트</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {#each concerts as concert}
            <tr>
              <td>
                {#if concert.poster_url}
                  <img src={concert.poster_url} alt={concert.title} class="thumb" />
                {:else}
                  <div class="thumb-placeholder"></div>
                {/if}
              </td>
              <td class="name-cell">{concert.title}</td>
              <td>{concert.date || '-'}</td>
              <td>{concert.location || '-'}</td>
              <td>{(concert.program || []).length}곡</td>
              <td>{(concert.artists || []).length}명</td>
              <td>
                <span class="badge" class:active={concert.is_active}>
                  {concert.is_active ? '활성' : '비활성'}
                </span>
              </td>
              <td class="actions">
                <button class="btn-sm btn-edit" onclick={() => openEdit(concert)}>편집</button>
                <button class="btn-sm btn-delete" onclick={() => deleteConcert(concert)}>삭제</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <!-- ── 편집 / 생성 폼 ──────────────────── -->
  {#if showForm}
    <div class="modal-overlay">
      <div class="modal" role="none" onclick={(e) => e.stopPropagation()}>
        <button class="modal-close" onclick={resetForm}>✕</button>
        <h2>{editing ? '공연 편집' : '새 공연'}</h2>

        <!-- 기본 정보 -->
        <div class="form-section">
          <h3>기본 정보</h3>
          <label>
            제목 *
            <input type="text" bind:value={form.title} placeholder="공연 제목" required />
          </label>
          <div class="row-2">
            <label>
              날짜
              <input type="date" bind:value={form.date} />
            </label>
            <label>
              시간
              <input type="time" bind:value={form.time} />
            </label>
          </div>
          <label>
            장소
          </label>
          {#if form.location_data}
            <div class="selected-place">
              <div class="place-info">
                <strong>{form.location_data.title}</strong>
                <span class="place-address">{form.location_data.roadAddress || form.location_data.address}</span>
                {#if form.location_data.category}
                  <span class="place-category">{form.location_data.category}</span>
                {/if}
              </div>
              <button type="button" class="btn-sm btn-delete" onclick={clearPlace}>×</button>
            </div>
          {:else}
            <div class="place-search-wrap">
              <input
                type="text"
                bind:value={placeQuery}
                oninput={onPlaceInput}
                placeholder="장소 검색 (네이버 지도)"
              />
              {#if showPlaceResults}
                <div class="place-dropdown">
                  {#if placeSearching}
                    <div class="place-item loading">검색 중...</div>
                  {:else if placeResults.length === 0}
                    <div class="place-item empty">검색 결과가 없습니다</div>
                  {:else}
                    {#each placeResults as place}
                      <button type="button" class="place-item" onclick={() => selectPlace(place)}>
                        <strong>{place.title}</strong>
                        <span>{place.roadAddress || place.address}</span>
                        {#if place.category}
                          <span class="place-cat">{place.category}</span>
                        {/if}
                      </button>
                    {/each}
                  {/if}
                </div>
              {/if}
            </div>
            <input type="text" bind:value={form.location} placeholder="또는 직접 입력" style="margin-top: 0.5rem;" />
          {/if}
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={form.is_active} />
            활성 상태
          </label>
        </div>

        <!-- 포스터 (드래그 앤 드롭) -->
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
            {#if imageUploading}
              <p class="drop-text">업로드 중...</p>
            {:else if selectedPosterUrl}
              <img src={selectedPosterUrl} alt="poster preview" class="preview-img poster-preview" />
            {:else}
              <p class="drop-text">이미지를 드래그하거나 클릭하여 업로드</p>
              <p class="drop-hint">자동으로 업로드 후 포스터로 등록됩니다</p>
            {/if}
          </div>
          <button type="button" class="btn-secondary" style="margin-top:0.5rem" onclick={openMediaPicker}>
            미디어에서 선택
          </button>
        </div>

        <!-- 간단한 설명 -->
        <div class="form-section">
          <h3>간단한 설명</h3>
          <textarea bind:value={form.brief_description} rows="3" placeholder="공연 소개"></textarea>
        </div>

        <!-- 예매 링크 -->
        <div class="form-section">
          <h3>예매 링크</h3>
          <input type="url" bind:value={form.reserve_link} placeholder="https://..." />
        </div>

        <!-- 티켓 가격 -->
        <div class="form-section">
          <h3>티켓 가격</h3>
          <input type="text" bind:value={form.cost} placeholder="예) 전석 30,000원" />
        </div>

        <!-- 프로그램 -->
        <div class="form-section">
          <h3>프로그램 (Program)</h3>
          {#each form.program as item, i}
            <div class="program-row">
                <input type="text" bind:value={item.composer} placeholder="작곡가" />
                <input type="text" bind:value={item.title} placeholder="곡명" />
                <button class="btn-sm btn-delete program-del" onclick={() => removeProgram(i)}>×</button>

                <div class="prog-player-search">
                    <input
                        type="text"
                        placeholder="연주자 검색..."
                        value={programPlayerQuery[i] || ''}
                        oninput={e => { programPlayerQuery[i] = e.target.value; programPlayerOpen[i] = true; }}
                        onfocus={() => programPlayerOpen[i] = true}
                    />
                    {#if programPlayerOpen[i] && getProgramPlayerResults(i).length > 0}
                        <ul class="artist-dropdown">
                            {#each getProgramPlayerResults(i) as a}
                                <li>
                                <button type="button" onclick={() => addProgramPlayer(i, a.id)}>
                                    {a.name}{#if a.name_en} <small>({a.name_en})</small>{/if}
                                </button>
                                </li>
                            {/each}
                        </ul>
                    {/if}
                    {#if (programPlayerQuery[i] || '').trim() && getProgramPlayerResults(i).length === 0 && programPlayerOpen[i]}
                        <ul class="artist-dropdown">
                            <li class="no-result">결과 없음</li>
                        </ul>
                    {/if}
                </div>

                <div class="program-players">
                    {#each (item.player_ids || []) as pid}
                        {@const pa = artists.find(a => a.id === pid)}
                        {#if pa}
                            <span class="artist-tag small">
                            {pa.name}
                            <button type="button" class="tag-remove" onclick={() => removeProgramPlayer(i, pid)}>&times;</button>
                            </span>
                        {/if}
                    {/each}
                </div>
            </div>
          {/each}
          <button type="button" class="btn-secondary btn-sm" onclick={addProgram}>+ 프로그램 추가</button>
        </div>

        <!-- 연결 아티스트 -->
        <div class="form-section">
          <h3>연결 아티스트</h3>
          {#if selectedArtists.length > 0}
            <div class="selected-artists">
              {#each selectedArtists as artist}
                <span class="artist-tag">
                  {artist.name}
                  {#if artist.name_en}<small>({artist.name_en})</small>{/if}
                  <button type="button" class="tag-remove" onclick={() => removeArtist(artist.id)}>&times;</button>
                </span>
              {/each}
            </div>
          {/if}
          <div class="artist-search-wrap">
            <input
              type="text"
              placeholder="아티스트 이름 검색..."
              bind:value={artistQuery}
              onfocus={() => showArtistResults = true}
              oninput={() => showArtistResults = true}
            />
            {#if showArtistResults && filteredArtistResults.length > 0}
              <ul class="artist-dropdown">
                {#each filteredArtistResults as artist}
                  <li>
                    <button type="button" onclick={() => addArtist(artist.id)}>
                      {artist.name}
                      {#if artist.name_en}<small>({artist.name_en})</small>{/if}
                    </button>
                  </li>
                {/each}
              </ul>
            {/if}
            {#if artistQuery.trim() && filteredArtistResults.length === 0 && showArtistResults}
              <ul class="artist-dropdown"><li class="no-result">결과 없음</li></ul>
            {/if}
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-primary" onclick={saveConcert} disabled={!form.title}>
            {editing ? '수정' : '생성'}
          </button>
          <button class="btn-secondary" onclick={resetForm}>취소</button>
        </div>
      </div>
    </div>
  {/if}

  <!-- ── 미디어 피커 모달 ─────────────────── -->
  {#if showMediaPicker}
    <div class="modal-overlay">
      <div class="modal media-picker" role="none" onclick={(e) => e.stopPropagation()}>
        <button class="modal-close" onclick={() => (showMediaPicker = false)}>✕</button>
        <h2>포스터 이미지 선택</h2>
        <div class="media-grid">
          {#each mediaList as media}
            <button class="media-item" onclick={() => selectMedia(media)}>
              <img src={media.url} alt={media.alt_text || media.original_filename} />
              <span class="media-name">{media.original_filename}</span>
            </button>
          {/each}
          {#if mediaList.length === 0}
            <p class="empty">업로드된 콘서트 이미지가 없습니다.</p>
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
    width: 60px; height: 80px;
    border-radius: 6px;
    object-fit: cover;
  }
  .thumb-placeholder {
    width: 60px; height: 80px;
    border-radius: 6px;
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
    input[type="date"],
    input[type="time"],
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

  .row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .checkbox-label {
    display: flex !important;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    input { width: auto; margin: 0; cursor: pointer; }
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

    &.has-image { padding: 1rem; }

    .drop-text { margin: 0; color: #888; }
    .drop-hint { margin: 0.5rem 0 0; font-size: 0.8rem; color: #aaa; }

    .file-input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    .preview-img {
      max-width: 200px;
      max-height: 200px;
      border-radius: 8px;
      object-fit: contain;
      display: block;
      margin: 0 auto;
    }
  }

  /* ── Program 행 ────────────────────── */
  .program-row {
    display: grid;
    grid-template-columns: 1fr 3fr 30px;

    gap: 0.3rem;
    margin-bottom: 0.75rem;
    flex-wrap: nowrap;

    .program-players {
        grid-column: 2 / -1;
        align-items: center;;
        display: flex; gap: 0.4rem; flex-wrap: wrap;
    }
    .prog-player-search {
      position: relative;
      input {
        width: 100%; padding: 0.4rem 0.6rem;
        border: 1px solid #d1d5db; border-radius: 4px;
        font-size: 0.85rem; background: #fff; color: #222;
      }
    }
    .program-del { 
        margin-top: 0.2rem; 
    }

    .program-players-wrap {
        display: grid;
        grid-template-columns: 1fr auto;
        width: 100%;
    }

    input, select {
      padding: 0.4rem 0.6rem;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      color: #222;
      font-size: 0.85rem;
    }
  }
  .artist-tag.small { font-size: 0.8rem; padding: 0.15rem 0.4rem; }

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
    img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
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

  /* ── 아티스트 선택 ─────────────────── */
  .selected-artists {
    display: flex; flex-wrap: wrap; gap: 0.4rem;
    margin-bottom: 0.5rem;
  }
  .artist-tag {
    display: inline-flex; align-items: center; gap: 0.3rem;
    background: #e0edff; color: #1a5276;
    padding: 0.25rem 0.5rem; border-radius: 20px;
    font-size: 0.85rem;
    small { color: #5b8fad; margin-left: 0.1rem; }
  }
  .tag-remove {
    background: none; border: none; cursor: pointer;
    font-size: 1rem; color: #888; padding: 0 0.15rem;
    line-height: 1;
    &:hover { color: #c0392b; }
  }
  .artist-search-wrap {
    position: relative;
    input { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.9rem; }
  }
  .artist-dropdown {
    position: absolute; top: 100%; left: 0; right: 0;
    background: #fff; border: 1px solid #ddd; border-top: none;
    border-radius: 0 0 6px 6px;
    max-height: 180px; overflow-y: auto;
    list-style: none; margin: 0; padding: 0;
    z-index: 20; box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    li button {
      display: block; width: 100%; text-align: left;
      padding: 0.5rem 0.75rem; border: none; background: none;
      cursor: pointer; font-size: 0.9rem;
      small { color: #888; }
      &:hover { background: #f0f4ff; }
    }
    .no-result { padding: 0.5rem 0.75rem; color: #999; font-size: 0.85rem; }
  }

  /* ── 장소 검색 ─────────────────────── */
  .place-search-wrap {
    position: relative;
    margin-top: 0.25rem;
  }

  .place-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #d1d5db;
    border-top: none;
    border-radius: 0 0 6px 6px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    z-index: 10;
    max-height: 250px;
    overflow-y: auto;
  }

  .place-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.6rem 0.75rem;
    border: none;
    border-bottom: 1px solid #f0f0f0;
    background: none;
    cursor: pointer;
    font-size: 0.85rem;
    color: #333;

    &:hover { background: #f0f4ff; }
    &.loading, &.empty { cursor: default; color: #999; &:hover { background: none; } }

    strong { display: block; font-size: 0.9rem; color: #111; margin-bottom: 0.15rem; }
    span { display: block; font-size: 0.8rem; color: #888; }
    .place-cat { font-size: 0.75rem; color: #aaa; margin-top: 0.1rem; }
  }

  .selected-place {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-top: 0.5rem;
    padding: 0.75rem;
    background: #f0f7ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;

    .place-info {
      flex: 1;
      strong { display: block; font-size: 0.95rem; color: #111; margin-bottom: 0.2rem; }
      .place-address { display: block; font-size: 0.85rem; color: #666; }
      .place-category { display: block; font-size: 0.75rem; color: #999; margin-top: 0.15rem; }
    }
  }
</style>
