// 가우스 소거법으로 선형 연립방정식 풀기 (Ax = b)
export function solveLinearSystem(A, b) {
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
export function fitPolynomial(coords, degree) {
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
export function evaluatePoly(coeffs, t) {
    let val = 0;
    for (let i = 0; i < coeffs.length; i++) {
        val += coeffs[i] * Math.pow(t, i);
    }
    return val;
}

// -------------------------------------------------------------------------
// 3. (공통) 곡선 위의 점들을 추출하는 함수 (Drawing Logic 분리)
// -------------------------------------------------------------------------
export function getCurvePoints(points, degree, windowSize = 5) {
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
export function getCompositePolyPath(points, 
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
export function getDistortedCirclePoints(cx, cy, radius, pointsCount = 20, distortion = 10) {
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
