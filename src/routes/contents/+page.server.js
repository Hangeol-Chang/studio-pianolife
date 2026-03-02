import { YOUTUBE_API_KEY } from '$env/static/private';

const PLAYLIST_IDS = {
    Interview: 'PLhZCc83h1JRRHeV6z1sqUc_xTerdd_Zgf',
    Podcast:   null, // TODO: 팟캐스트 재생목록 ID 추가
};

/**
 * YouTube Data API v3로 재생목록 영상 목록을 가져옵니다.
 * @param {string} playlistId
 * @returns {Promise<Array<{id: string, title: string, description: string, thumbnail: string}>>}
 */
async function fetchPlaylist(playlistId) {
    if (!playlistId) return [];

    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('key', YOUTUBE_API_KEY);

    const res = await fetch(url.toString());
    if (!res.ok) {
        console.error('YouTube API error:', res.status, await res.text());
        return [];
    }

    const json = await res.json();
    return (json.items ?? [])
        .filter(item => item.snippet?.resourceId?.kind === 'youtube#video')
        .map(item => ({
            id:          item.snippet.resourceId.videoId,
            title:       item.snippet.title,
            description: item.snippet.description ?? '',
            thumbnail:   item.snippet.thumbnails?.medium?.url
                      ?? item.snippet.thumbnails?.default?.url
                      ?? `https://img.youtube.com/vi/${item.snippet.resourceId.videoId}/mqdefault.jpg`,
        }));
}

export async function load() {
    const [interview, podcast] = await Promise.all([
        fetchPlaylist(PLAYLIST_IDS.Interview),
        fetchPlaylist(PLAYLIST_IDS.Podcast),
    ]);

    return { interview, podcast };
}
