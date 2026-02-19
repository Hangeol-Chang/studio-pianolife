<script>
    import { page } from '$app/stores';
    import { PIANOLIFE_BACKEND_URL } from "$env/static/public";
    import ConcertDetail from '$lib/components/concerts/ConcertDetail.svelte';

    const API = PIANOLIFE_BACKEND_URL || "http://localhost:8000";

    let concert = $state(null);
    let loading = $state(true);
    let error = $state(null);

    const concertId = $derived($page.params.id);

    $effect(() => {
        const id = concertId;
        if (!id) return;
        loading = true;
        error = null;
        concert = null;

        fetch(`${API}/api/concerts/${id}`)
            .then(res => {
                if (!res.ok) throw new Error(`콘서트를 찾을 수 없습니다 (${res.status})`);
                return res.json();
            })
            .then(data => { concert = data; })
            .catch(err => { error = err.message; })
            .finally(() => { loading = false; });
    });
</script>

<svelte:head>
    <title>{concert ? concert.title : 'Concert'} - Studio Pianolife</title>
</svelte:head>

{#if loading}
    <div class="loading-state">
        <p>Loading...</p>
    </div>
{:else if error}
    <div class="error-state">
        <p>{error}</p>
        <a href="/concerts">← 공연 목록으로</a>
    </div>
{:else if concert}
    <ConcertDetail {concert} />
{/if}

<style>
    .loading-state,
    .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        gap: 1rem;
        color: #999;
        font-weight: 300;
    }

    .error-state a {
        color: #666;
        text-decoration: none;
        font-size: 0.9rem;
    }
    .error-state a:hover {
        text-decoration: underline;
    }
</style>
