<script>
    import { onMount } from "svelte";
    import Page from "$routes/+page.svelte";
    import RadialRevealPath from "./RadialRevealPath.svelte";

    export let outlineColor = "black";
    export let inlineColor = "gray";

    export let width = "400px";

    // 가우스 소거법으로 선형 연립방정식 풀기 (Ax = b)
    function solveLinearSystem(A, b) {
        const n = b.length;
        const M = A.map(row => [...row]);
        const v = [...b];

        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
            }
            [M[i], M[maxRow]] = [M[maxRow], M[i]];
            [v[i], v[maxRow]] = [v[maxRow], v[i]];

            for (let k = i + 1; k < n; k++) {
                const c = -M[k][i] / M[i][i];
                M[k][i] = 0;
                for (let j = i + 1; j < n; j++) {
                    M[k][j] += c * M[i][j];
                }
                v[k] += c * v[i];
            }
        }

        const x = new Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) sum += M[i][j] * x[j];
            x[i] = (v[i] - sum) / M[i][i];
        }
        return x;
    }

    // 주어진 점들에 대해 최소자승법으로 다항식 계수 구하기
    function fitPolynomial(coords, degree) {
        const n = coords.length;
        let k = degree;
        if (k >= n) k = n - 1; 

        // t값 정규화 (0 ~ 1)
        const t_values = coords.map((_, i) => i / (n - 1));

        // 정규 방정식 행렬 구성
        const M = Array.from({ length: k + 1 }, () => Array(k + 1).fill(0));
        const v = Array(k + 1).fill(0);

        for (let i = 0; i < n; i++) {
            const t = t_values[i];
            const val = coords[i];
            for (let r = 0; r <= k; r++) {
                const tr = Math.pow(t, r);
                v[r] += val * tr;
                for (let c = 0; c <= k; c++) {
                    M[r][c] += Math.pow(t, r + c);
                }
            }
        }
        return solveLinearSystem(M, v);
    }

    // 다항식 식에 t를 넣어 값 계산
    function evaluatePoly(coeffs, t) {
        let val = 0;
        for (let i = 0; i < coeffs.length; i++) {
            val += coeffs[i] * Math.pow(t, i);
        }
        return val;
    }

    // -------------------------------------------------------------------------
    // 3. (공통) 곡선 위의 점들을 추출하는 함수 (Drawing Logic 분리)
    // -------------------------------------------------------------------------
    function getCurvePoints(points, degree, windowSize = 5) {
        if (points.length < 2) return [];
        const resolution = 20; 
        const curvePts = [];

        // 1. 캐싱
        const coeffsCache = [];
        for (let i = 0; i < points.length; i++) {
            const halfWindow = Math.floor(windowSize / 2);
            let start = Math.max(0, i - halfWindow);
            let end = Math.min(points.length, start + windowSize);
            
            if (end - start < windowSize) {
                if (start === 0 && points.length >= windowSize) end = windowSize; 
                else if (end === points.length && points.length >= windowSize) start = points.length - windowSize;
            }

            const windowPoints = points.slice(start, end);
            const xCoeffs = fitPolynomial(windowPoints.map(p => p[0]), degree);
            const yCoeffs = fitPolynomial(windowPoints.map(p => p[1]), degree);

            coeffsCache.push({ start, end, xCoeffs, yCoeffs, count: windowPoints.length });
        }

        function getPrediction(indexVal, cachedPoly) {
            const { start, end, xCoeffs, yCoeffs, count } = cachedPoly;
            const t = (indexVal - start) / (count - 1); 
            const x = evaluatePoly(xCoeffs, t);
            const y = evaluatePoly(yCoeffs, t);
            return { x, y };
        }

        // 2. 점 생성
        for (let i = 0; i < points.length - 1; i++) {
            const polyA = coeffsCache[i];
            const polyB = coeffsCache[i+1];

            for (let j = 0; j <= resolution; j++) {
                // 마지막 세그먼트의 중복 방지 (다음 세그먼트 시작점과 겹침)
                if (j === 0 && i > 0) continue; 

                const t = j / resolution;
                const currentGlobalIdx = i + t; 

                const posA = getPrediction(currentGlobalIdx, polyA);
                const posB = getPrediction(currentGlobalIdx, polyB);

                const x = posA.x * (1 - t) + posB.x * t;
                const y = posA.y * (1 - t) + posB.y * t;
                
                curvePts.push({x, y});
            }
        }
        return curvePts;
    }

    // 통합된 경로 생성 함수
    function getCompositePolyPath(points, 
        { 
            baseWidth = 2, degree = 3, windowSize = 5, curveMode = 1, 
            ampParams = { yOffset: 1, ampVal: 0.3 }, closePath = false
        } = {}
    ) {
        const pts = getCurvePoints(points, degree, windowSize);
        if (pts.length < 2) return "";

        let seed = 0;
        points.forEach((p, idx) => { seed += (Math.abs(p[0]) + Math.abs(p[1])) * (idx + 1); });

        const freq = 2 + (seed % 40) / 10.0; 
        const phase = ((seed % 100) / 100.0) * Math.PI * 2;
        const ampVar = 0.1 + ((seed % 20) / 100.0);

        const leftSide = [];
        const rightSide = [];

        for (let i = 0; i < pts.length; i++) {
            const progress = i / (pts.length - 1);
            
            const baseShape = (curveMode * (seed % 2)) === 0 ? 
                ( ampParams.ampVal * Math.sin(progress * Math.PI) + ampParams.yOffset ) :
                ( ampParams.ampVal * Math.cos(progress * Math.PI) + ampParams.yOffset );
            const modulation = 1.0 + ampVar * Math.sin(progress * Math.PI * freq + phase);
            
            // 최종 두께
            const w = baseWidth * baseShape * modulation;

            // 법선 벡터 계산
            const pPrev = pts[Math.max(0, i - 1)];
            const pNext = pts[Math.min(pts.length - 1, i + 1)];
            let dx = pNext.x - pPrev.x;
            let dy = pNext.y - pPrev.y;
            if (dx === 0 && dy === 0) { dx = 1; dy = 0; }
            
            const len = Math.sqrt(dx*dx + dy*dy);
            const nx = -dy / len;
            const ny = dx / len;

            leftSide.push({ x: pts[i].x + nx * w * 0.5, y: pts[i].y + ny * w * 0.5 });
            rightSide.push({ x: pts[i].x - nx * w * 0.5, y: pts[i].y - ny * w * 0.5 });
        }

        let d = `M ${leftSide[0].x.toFixed(2)} ${leftSide[0].y.toFixed(2)} `;
        if(!closePath) {
            for (let i = 1; i < leftSide.length; i++) d += `L ${leftSide[i].x.toFixed(2)} ${leftSide[i].y.toFixed(2)} `;
        }
        for (let i = rightSide.length - 1; i >= 0; i--) d += `L ${rightSide[i].x.toFixed(2)} ${rightSide[i].y.toFixed(2)} `;
        d += "Z";
        return d;
    }

    // 불규칙한 원형 점 생성 함수
    function getDistortedCirclePoints(cx, cy, radius, pointsCount = 20, distortion = 10) {
        const pts = [];
        for (let i = 0; i < pointsCount; i++) {
            const angle = (i / pointsCount) * 2 * Math.PI;
            const r = radius + (Math.random() - 0.5) * 2 * distortion; 
            pts.push([
                cx + r * Math.cos(angle), 
                cy + r * Math.sin(angle)
            ]);
        }
        // 닫힌 루프를 위해 첫 점을 마지막에 추가
        pts.push(pts[0]);
        return getCompositePolyPath(pts, { closePath: true });
        // return pts;
    }

    const outlinePoints = [
        { points: [[285,280],[268,277],[237,292],[211,322],[210,360],[226,397],[245,412],[269,422],[286,440],[291,458],[294,462]] },
        { points: [[287,282],[274,305],[280,360],[295,412],[298,445],[294,461]] },
        { points: [[290,279],[305,278],[326,296],[341,328],[343,368],[338,400],[325,421],[320,444],[316,458],[307,463],[294,461]] },

        { points: [[348,362],[362,382],[387,395],[410,405],[426,422],[425,432]] },
        { points: [[297,271],[323,265],[373,300],[414,337],[430,373],[438,405],[437,417]] },
        { points: [[418,413],[419,423],[415,431],[414,435],[430,431],[442,411],[444,401],[458,384],[460,363],[450,339],[439,306],[417,285],[388,271],[358,252],[324,254],[304,264],[294,276]]},

        { points: [[397,273],[412,275],[434,269],[455,275],[471,289],[467,298]] },
        { points: [[308,258],[320,250],[345,228],[406,213],[459,234],[490,270]] },
        { points: [[408,165],[465,182],[482,199],[495,226],[497,251],[486,269],[480,293],[461,299],[446,288],[455,282],[455,281],[457, 275]] },

        { points: [[300,268],[310,260],[328,231],[361,216],[393,199],[414,147],[416,98],[429,55],[427, 40],[418,26],[410, 25],[398,25]] },
        { points: [[300,264],[313,208],[317,160],[341,103],[366,63],[393,31],[399,24]] },
        { points: [[256,157],[255,130],[259,112],[295,67],[318,57],[344,31],[375,12],[384,12],[393,15],[400,24]] },

        { points: [[264,105],[257,87],[240,73],[228,65],[209,59],[189,70],[179,85],[162,95],[140,99],[123,109],[123,126],[133,142],[142,139],[146,133]] },
        { points: [[174,87],[196,105],[221,140],[240,183],[269,235],[291,272]] },
        { points: [[122,116],[130,113],[143,124],[150,139],[157,151],[165,155]] },

        { points: [[290,275],[236,208],[219,180],[175,156],[130,157],[98,171],[84,183],[63,194],[35,210],[30,223],[31,231]] },
        { points: [[32,230],[67,220],[128,218],[186,239],[236,263],[271,270],[290,275]] },
        { points: [[241,288],[227,284],[186,287],[156,289],[118,272],[92,249],[76,244],[44,249],[28,240],[30,232]] },

        { points: [[137,282],[103,305],[80,343],[76,382],[78,402],[79,422],[85,429]] },
        { points: [[233,296],[173,315],[132,344],[104,388],[88,416],[84,427]] },
        { points: [[206,350],[198,356],[187,359],[181,375],[162,383],[132,391],[119,407],[104,418],[91,426],[85,429]] },

        // 꽃술 부분
        { points: [[247,165],[242,163],[239,155],[245,154],[252,155],[262,157],[267,161],[266,165],[260,169]] },
        { points: [[242,163],[250,173],[258,194],[277,241],[289,262],[296,274]] },
        { points: [[265,167],[260,172],[264,189],[274,216],[283,242],[297,269]] },
    ];

    const inlinePoints = [
        { points: [[288,279],[283,295],[292,344],[304,391],[305,420]] },
        { points: [[291,277],[287,296],[304,333],[309,370]] },
        { points: [[300,460],[314,417],[316,377]] },
        { points: [[302,462],[316,434],[322,407]] },
        { points: [[290,277],[292,290],[314,321],[320,349],[320,380]] },
        { points: [[291,276],[288,281],[311,300],[332,336],[338,372]] },
        { points: [[285,279],[262,303],[261,350],[274,387]] },
        { points: [[284,280],[257,292],[241,328],[249,369]] },
        { points: [[232,347],[240,390],[275,411],[280,437],[292,454]] },
        { points: [[281,398],[290,417],[298,441],[296,459]] },
        { points: [[287,278],[260,281],[230,305],[218,343],[225,382]] },

        { points: [[339,322],[363,360],[401,384],[424,402],[431,417],[431,425]] },
        { points: [[298,274],[324,280],[344,305],[358,329],[378,349]] },
        { points: [[393,363],[410,377],[428,397],[434,415],[433,422]] },
        { points: [[301,271],[322,270],[349,292],[367,317],[399,342]] },
        { points: [[412,356],[426,376],[434,392],[436,416]] },
        { points: [[303,263],[343,259],[384,276],[410,298],[433,340]] },
        { points: [[385,294],[423,336],[441,370],[442,399],[442,405]] },

        { points: [[311,258],[359,231],[403,226],[441,236]] },
        { points: [[452,240],[475,257],[483,275]] },
        { points: [[375,260],[401,261],[437,256],[465,264]] },
        { points: [[331,251],[371,240],[409,239]] },
        { points: [[379,208],[415,202],[472,223],[480,246],[490,263]] },
        { points: [[400,184],[427,181],[458,192],[475,206]] },

        { points: [[403,26],[379,69],[341,135],[325,174]] },
        { points: [[405,26],[391,70],[365,114],[353,131]] },
        { points: [[410,24],[412,41],[410,61],[406,76]] },
        { points: [[397,95],[377,128],[348,164],[321,207],[310,238],[303,262]] },
        { points: [[419,39],[417,74],[395,126],[362,165],[324,210],[309,247],[303,262]] },
        { points: [[418,106],[401,148],[365,185],[329,216],[311,246],[306,260]] },
        { points: [[397,22],[354,61],[314,136],[301,210]] },
        { points: [[393,18],[378,20],[362,31],[345,46]] },
        { points: [[334,57],[313,92],[297,138],[291,194],[294,232],[295,259]] },
        { points: [[311,57],[287,102],[278,150],[284,201],[291,240],[293,258]] },
        { points: [[289,77],[267,112],[266,148],[274,196],[283,227]] },

        { points: [[223,72],[237,84],[247,108],[250,127],[249,136]] },
        { points: [[191,70],[205,73],[215,78],[225,88]] },
        { points: [[230,99],[239,118],[244,138],[249,154]] },
        { points: [[199,83],[216,99],[227,116],[234,131],[239,146],[243,154]] },
        { points: [[179,84],[202,102],[220,124]] },
        { points: [[227,139],[237,161],[254,196],[269,225],[283,255]] },
        { points: [[174,93],[197,118],[216,150],[237,184],[251,211]] },
        { points: [[165,93],[179,108],[193,127],[202,142]] },
        { points: [[209,154],[226,179],[245,210],[263,242]] },
        { points: [[153,96],[164,110],[170,130],[186,150],[208,172]] },
        { points: [[137,100],[149,104],[157,126],[169,148],[181,158]] },

        { points: [[80,185],[125,165],[178,178],[218,209],[241,240],[267,262],[285,272]] },
        { points: [[29,219],[60,200],[101,189],[133,188],[165,196]] },
        { points: [[185,203],[209,217],[229,240],[248,258],[269,268],[287,274]] },
        { points: [[30,226],[74,204],[129,205],[178,226],[209,239],[240,258]] },
        { points: [[136,202],[174,211],[202,229],[226,246],[251,262]] },
        { points: [[107,222],[155,236],[203,256],[241,267]] },
        { points: [[57,227],[91,224],[139,239],[185,258],[235,267],[266,274],[281,276]] },
        { points: [[154,258],[177,270],[208,271],[238,272],[264,272]] },
        { points: [[29,240],[70,235],[101,240],[141,268],[187,280],[235,274],[277,276]] },

        { points: [[176,290],[151,292],[121,310],[99,335],[87,368]] },
        { points: [[239,287],[176,295],[139,310],[111,337],[99,358]] },
        { points: [[86,425],[106,364],[150,313],[199,296],[240,290]] },
        { points: [[227,299],[197,308],[173,325],[161,344],[153,366]] },
        { points: [[224,302],[200,313],[183,331],[177,341],[170,356]] },
        { points: [[95,422],[112,390],[139,353]] },

    ]

    const flowerTowPoints = [
        { points: [[290,278],[257,252],[222,220]] },
        { points: [[291,276],[257,246],[239,228]] },
        { points: [[291,275],[251,233],[222,199]] },
        { points: [[291,272],[264,243],[253,223]] },
        { points: [[293,274],[274,254],[264,233]] },
        { points: [[291,272],[257,221],[244,195]] },
        { points: [[294,272],[261,211],[247,177]] },
        { points: [[297,271],[277,226],[267,192]] },
        { points: [[297,270],[285,234],[279,206]] },
        { points: [[297,272],[279,190],[275,169]] },
        { points: [[298,266],[289,208],[287,175]] },
        { points: [[298,270],[293,226],[295,204]] },
        { points: [[297,272],[302,216],[303,191]] },
        { points: [[301,274],[313,217],[321,178]] },
        { points: [[301,270],[297,212],[305,174]] },
    ];
</script>

<svg
    viewBox="0 0 500 500"
    {width}
    height={width}
    xmlns="http://www.w3.org/2000/svg"
    class="flower-svg"
>
    <!-- Outline -->
    <g stroke-linecap="round" stroke-linejoin="round">
        {#each outlinePoints as data}
            <RadialRevealPath 
                d={getCompositePolyPath(data.points, { baseWidth: 2, ampParams: { yOffset: 0.8, ampVal : 0.3} })} 
                fill={outlineColor} 
                delay={Math.random() * 1000} 
            />
        {/each}
    </g>

    <g stroke-linecap="round" stroke-linejoin="round" opacity="1">
        {#each inlinePoints as data}
            <RadialRevealPath 
                d={getCompositePolyPath(data.points, { baseWidth: 1.5, curveMode: 0, ampParams: { yOffset: 0, ampVal: 1 } })} 
                fill={inlineColor} 
                delay={600 + Math.random() * 1000} 
            />
        {/each}
    </g>

    <g stroke-linecap="round" stroke-linejoin="round" opacity="1.0">
        {#each flowerTowPoints as data}
            <RadialRevealPath 
                d={getCompositePolyPath(data.points, { baseWidth: 2, ampParams: { yOffset: 0.5, ampVal: 1 } })} 
                fill={outlineColor} 
                delay={Math.random() * 1200} 
            />
            <RadialRevealPath 
                d={getDistortedCirclePoints(data.points[data.points.length -1][0], data.points[data.points.length -1][1], 3, 10, 1)} 
                fill={outlineColor} 
                delay={800 + Math.random() * 1000} 
            />
        {/each}
    </g>
</svg>

<style>
    path {
        transition: 0.5s;
    }

    .flower-svg {
        display: block;
        margin: 0 auto;
    }
</style>