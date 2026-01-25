<script>
    import { page } from '$app/stores';
    import ConcertDetail from '$lib/components/concerts/ConcertDetail.svelte';

    // Mock Data based on Figma raw code
    const concertsData = {
        "1": {
            id: 1,
            title: "Four Colors for Chopin",
            subtitle: "4명의 연주자가 그리는 쇼팽의 사계", // Extrapolated
            description: "‘쇼팽의 작품은 머나먼 나라와 아득한 후세에게 전해질 운명이다.’ - F. Liszt\n\n머나먼 나라에서 클래식 음악을 사랑하는 아득한 후세들이 각자의 색을 담아 연주하는 쇼팽의 곡들과 함께 여러분들의 연말을 따뜻하고 아름다운 순간으로 한 줄 장식해보시길 바랍니다.",
            date: "2023년 12월 16일",
            time: "15:00",
            location: "서초문화예술회관 아트홀",
            price: "전석 무료",
            image: "", // Placeholder
            status: "finished",
            artists: [
                { name: "고정우", en: "KO JEONG WOO", image: "" },
                { name: "황수연", en: "HWANG SOO YEON", image: "" },
                { name: "김효재", en: "KIM HYO JAE", image: "" },
                { name: "박태원", en: "PARK TAE WON", image: "" }
            ],
            program: [
                {
                    part: "1부 Ballade",
                    pieces: [
                        { title: "F.Chopin - Nocturne in c sharp minor, Op.27 No.1", performer: "고정우" },
                        { title: "F.Chopin - Etude in c minor, Op.25 No.12", performer: "고정우" },
                        { title: "F.Chopin - Ballade No.1 in g minor, Op.23", performer: "고정우" },
                        { title: "F.Chopin - Ballade No.4 in f minor, Op.52", performer: "황수연" },
                        { title: "F.Chopin - Allegro de concert in A Major, Op.46", performer: "황수연" }
                    ]
                },
                {
                    part: "2부 Polonaise",
                    pieces: [
                        { title: "F.Chopin - Etude in E Major, Op.10 No.3", performer: "김효재" },
                        { title: "F.Chopin - Waltz in A Flat Major, Op.42", performer: "김효재" },
                        { title: "F.Chopin - Polonaise-Fantasy in A Flat Major, Op.61", performer: "김효재" },
                        { title: "F.Chopin - Prelude in E Flat Major, Op.28 No.19", performer: "박태원" },
                        { title: "F.Chopin - Waltz in E Flat Major, Op.18", performer: "박태원" },
                        { title: "F.Chopin - Andante Spianato and Grande Polonaise Brillante in E Flat Major, Op.22", performer: "박태원" }
                    ]
                }
            ]
        },
        "2": {
            id: 2,
            title: "슈만, 시인은 말한다",
            subtitle: "피아노라는 악기를 누구보다 열망하고 사랑한 슈만",
            description: "피아노라는 악기를 누구보다 열망하고 사랑한 슈만. 정해진 음악 형식을 벗어나 깊은 곳에서 부터 묻어나는 열정과 인간 본연의 감정에 집중하는 그의 음악으로 4명의 아마추어 연주자들이 낭만을 들려주는 시인이 되어 사랑, 격정, 변덕, 그리고 즐거움을 노래하며 관객들이 슈만을 더욱 가까이에서 만나고 그와 짙은 사랑에 빠지기를 소망합니다.",
            date: "2025년 3월 15일",
            time: "19:30",
            location: "Hall Fioreum",
            price: "10,000 Won",
            image: "",
            status: "booking",
            artists: [
                { name: "박지민", en: "PARK JIMIN", image: "" },
                { name: "이준호", en: "LEE JUNHO", image: "" }
            ]
        }
    };

    $: concertId = $page.params.id;
    $: concert = concertsData[concertId] || concertsData["1"]; // Default to 1 if not found or while loading
</script>

<ConcertDetail {concert} />
