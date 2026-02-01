<script>
    import { page } from '$app/stores';
    import ArtistDetail from '$lib/components/artists/ArtistDetail.svelte';

    // Mock Data based on Figma
    const artistsData = {
        "ko-jeong-woo": {
            id: "ko-jeong-woo",
            name: "고정우",
            en: "KO JEONG WOO",
            slogan: "끝 없는 도전과 성장의 아이콘\n‘공피라 - 공대생의 piano life’",
            subSlogan: "공대생의 Piano Life",
            image: "", // Placeholder
            career: [
                "2024 제2회 한별 콩쿠르 2등",
                "2025 제4회 한별 콩쿠르 2등",
                "2024 아람아티스트 선정",
                "2025 서울문화재단 거리예술축제 아티스트 선정",
                "2025 경기아트센트 ‘Stage for you’ 아티스트 선정",
                "2026 클래시카 서울 라이징스타 오디션 아마추어부 1등",
                "2026 포아 클래식 아티스트 선정"
            ],
            description: "그 외 피피남컴퍼니 ‘피피남과 친구들’ 등 기획 연주회 및 독주회를 진행하며 아마추어 연주자로서 왕성한 연주 활동을 하는 동시에 다양한 유튜브 컨텐츠 제작을 하며 클래식 엔터테이먼트의 새로운 방향성을 찾고자 나아가는 중이다."
        },
        "default": {
             id: "unknown",
            name: "아티스트",
            en: "ARTIST NAME",
            slogan: "Artist Slogan Here",
            image: "",
            career: [],
            description: "준비중입니다."
        }
    };

    $: artistId = $page.params.id;
    $: artist = artistsData[artistId] || artistsData["ko-jeong-woo"]; // Default for demo
</script>

<ArtistDetail {artist} />
