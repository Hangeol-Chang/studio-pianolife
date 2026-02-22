import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';

/**
 * 네이버 지역 검색 API 프록시
 * GET /api/places/search?q=세종문화회관
 * 
 * 브라우저 → SvelteKit 서버 → 네이버 검색 API → 결과 반환
 * Client Secret이 서버에만 존재하므로 보안 유지
 */
export async function GET({ url }) {
  const query = url.searchParams.get('q');
  if (!query) {
    return json({ error: '검색어를 입력해주세요' }, { status: 400 });
  }

  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    return json({ error: '네이버 API 키가 설정되지 않았습니다' }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      query,
      display: '5',
      sort: 'random',
    });

    const res = await fetch(`https://openapi.naver.com/v1/search/local.json?${params}`, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Naver API error:', res.status, text);
      return json({ error: '네이버 API 호출 실패' }, { status: res.status });
    }

    const data = await res.json();

    // 필요한 필드만 추출하여 반환
    const items = (data.items || []).map((item) => ({
      title: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
      address: item.address,
      roadAddress: item.roadAddress,
      mapx: item.mapx,  // 경도 × 10^7 (KATECH)
      mapy: item.mapy,  // 위도  × 10^7 (KATECH)
      link: item.link,
      category: item.category,
    }));

    return json({ items });
  } catch (e) {
    console.error('Place search error:', e);
    return json({ error: '장소 검색 중 오류가 발생했습니다' }, { status: 500 });
  }
}
