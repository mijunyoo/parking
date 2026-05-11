# 나어주 — 가족 주차 위치 공유

> "나 어디 주차했지?" — 우리 가족이 지하주차장 어디에 차를 세웠는지 기록하고 가족 모두가 한눈에 보는 모바일 웹앱.

3대 차(아빠차/엄마차/미르차)를 B3~B6 4개 층 평면도 위에서 핀으로 기록 → 가족 누구나 같은 URL로 접속해서 실시간 동기화로 봅니다.

---

## 1. 빠른 시작 (로컬에서 돌려보기)

```bash
cd app
npm install
npm run dev
```

브라우저에서 안내된 URL(보통 `http://localhost:5173`)을 열고 모바일 사이즈로 좁혀서 확인하세요. **이 단계에선 가족 동기화 없이 로컬에만 저장돼요** (혼자 테스트용).

---

## 2. 배포 (가족과 같이 쓰려면 필요)

배포 = 인터넷에 올려서 가족이 핸드폰에서 접속할 수 있게 하기. 두 가지가 필요합니다:

### 2-A. Supabase 설정 (실시간 동기화 백엔드, 무료)

1. **계정 만들기**: [supabase.com](https://supabase.com) → GitHub 또는 이메일로 회원가입 (무료)
2. **새 프로젝트 만들기**: 대시보드 → New project → 이름 아무거나 (예: `naeoju`) → Region: Northeast Asia (Seoul) → DB 비밀번호 설정 → Create
3. **테이블 만들기** (1분):
   - 좌측 사이드바 → **SQL Editor** → **New query**
   - [`app/supabase-schema.sql`](supabase-schema.sql) 파일 내용 전체 복사 → 붙여넣기 → **Run**
   - "Success. No rows returned" 떠야 정상
4. **연결 정보 복사**:
   - 좌측 사이드바 → **Project Settings** (톱니바퀴) → **API**
   - `Project URL`과 `anon public` 키를 메모

### 2-B. 코드 배포 (Vercel 추천, 무료, 5분)

가장 쉬운 옵션 두 가지 — 둘 중 하나만 선택:

#### 옵션 1: Vercel (가장 쉬움)
1. **GitHub 계정** 준비 + 이 코드를 GitHub 저장소에 push (이미 했다면 건너뛰기)
2. [vercel.com](https://vercel.com) 가입 → **New Project** → GitHub 저장소 선택
3. **Root Directory**: `app` 으로 지정 (중요! 코드가 `/app/` 안에 있으니까)
4. **Environment Variables** 클릭 → 두 개 추가:
   - `VITE_SUPABASE_URL` = (위에서 복사한 Project URL)
   - `VITE_SUPABASE_ANON_KEY` = (위에서 복사한 anon public 키)
5. **Deploy** 클릭 → 1~2분 후 `naeoju-xxx.vercel.app` URL 발급
6. 그 URL이 가족과 공유할 주소

#### 옵션 2: Netlify
거의 동일 — [netlify.com](https://netlify.com) → Import → GitHub 저장소 → Base directory `app` → Build command `npm run build` → Publish directory `app/dist` → Environment variables 두 개 추가 → Deploy.

#### 코드를 GitHub에 안 올리고 싶으면?
```bash
cd app
npm run build
# dist/ 폴더가 생김 → Vercel CLI로 직접 push:
npx vercel --prod
# 또는 Netlify drag-and-drop으로 dist/ 폴더 통째로 업로드
```

> 환경변수 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) 는 어떤 방식이든 호스팅 설정에 넣어줘야 동기화 작동.

---

## 3. 가족과 사용하기

### 3-A. 가족 그룹 URL 정하기
배포된 주소 뒤에 `?g=가족이름` 을 붙입니다. 예시:
```
https://naeoju.vercel.app/?g=yoo-family
https://naeoju.vercel.app/?g=mijun-team
```
- `?g=` 의 값이 **가족 식별자**. 이 값만 같으면 같은 그룹으로 인식
- 영문 소문자 / 숫자 / `-` `_` 만 허용 (한글 X)
- 가족만 알 수 있는 적당히 추측 어려운 값으로 (예: `yoo-fam-2026`)
- **이 URL을 아는 사람은 누구나 읽기/쓰기 가능** — 외부에 노출 안 되게 가족 카카오톡방에서만 공유

### 3-B. 가족에게 링크 보내기
1. 위에서 만든 URL을 카카오톡 가족방에 공유
2. 각자 핸드폰에서 링크 탭 → 사파리/크롬에서 열림
3. **(선택) 홈 화면에 추가**:
   - **iPhone (Safari)**: 하단 공유 버튼 → "홈 화면에 추가"
   - **Android (Chrome)**: 우측 상단 ⋮ → "홈 화면에 추가" 또는 "앱 설치"
   - 추가하면 진짜 앱처럼 아이콘 생김 (PWA — 매번 브라우저 안 켜도 됨)

### 3-C. 사용 흐름
1. **시작 페이지**: "시작하기" 탭 → 차량 현황 화면으로
2. **차량 현황**: 4개 층(B3~B6) 미니 지도 + 어떤 차가 어디 있는지 한눈에
3. **+ 기록** 탭 → 주차 기록 화면:
   - 위에서 차 선택 (아빠차/엄마차/미르차)
   - 층 선택 (B3~B6)
   - 지도에서 주차한 위치 탭 → 그 좌표에 차 사진 핀
   - 노란 **저장** 버튼 → 즉시 가족 모두에게 동기화
4. **출차**: 차량 현황에서 차량 카드 탭 → "출차 처리"
5. **상단 좌측의 점**:
   - 🟢 초록 = 실시간 동기화 중 (정상)
   - 🟠 주황 = 동기화 시도 중
   - ⚪ 회색 = 오프라인 (Supabase 미설정 또는 인터넷 끊김 — 로컬에만 저장)

### 3-D. 별 ⭐ 표시
F구역 아래쪽 노란 별은 **우리 가족 지정 자리(B5 F구역)** 표시:
- B5: 진한 노란 별 (우리 자리)
- B3/B4/B6: 옅은 별 (다른 층에서 같은 위치를 가늠하는 기준점)

---

## 4. 코드 구조

| 파일 | 역할 |
|---|---|
| `src/screens/Start.tsx` | 시작 페이지 (나어주 헤드라인 + 차 3대) |
| `src/screens/Status.tsx` | 차량 현황 (4층 미니맵 + 요약 + 출차) |
| `src/screens/Record.tsx` | 주차 기록 (차/층/지도 한 화면) |
| `src/components/FloorMap.tsx` | SVG 평면도 (12 zones, 핀 클릭) |
| `src/components/CarPin.tsx` | 원형 차 사진 핀 |
| `src/components/CarPanel.tsx` | 가로형 차 카드 (시작 페이지) |
| `src/components/DesignatedStar.tsx` | F구역 별 마커 |
| `src/lib/zones.ts` | 12 구역 좌표 + `pointToZone()` 매핑 |
| `src/lib/storage.ts` | localStorage (오프라인 캐시) |
| `src/lib/sync.ts` | Supabase 실시간 동기화 hook |
| `src/lib/supabase.ts` | Supabase 클라이언트 |
| `src/lib/group.ts` | URL `?g=` 파라미터 파싱 |
| `supabase-schema.sql` | DB 테이블 + RLS 정책 |

## 5. 데이터 모델

```ts
interface ParkingRecord {
  carBrand: 'mercedes' | 'jaguar' | 'audi';
  floor: 'B3' | 'B4' | 'B5' | 'B6';
  pinX: number;  // 0..343 (평면도 좌표)
  pinY: number;
  zone: ZoneName; // pinX/pinY → 자동 매핑
  recordedAt: number;
}
```
DB는 `(group_id, car_brand)` 가 PK라서 **차량당 현재 위치 1개만** 유지. 새로 저장하면 자동 덮어쓰기.

## 6. 다음 단계 아이디어

- 주차 히스토리 (차량별 최근 기록)
- 푸시 알림 (가족이 차 옮기면 알림)
- 사진 첨부 (가끔 혼동될 때)
- 여러 가족 (가족 단위로 분리)
- 출차 시간 자동 기록 → 일주일 사용 통계

## 7. 비용

- **Supabase 무료 티어**: DB 500MB, 사용자 5만명 등 — 가족 4명에게 평생 무료
- **Vercel/Netlify 무료 티어**: 개인 프로젝트 무제한 — 무료

총비용 0원. 가족 4명이 하루 10번씩 써도 무료 한도 한참 못 미침.

## 8. 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| 상단 점이 회색(오프라인) | `.env.local` 또는 Vercel 환경변수에 Supabase URL/Key 설정 안 됨 |
| 저장은 되는데 다른 폰에 안 나옴 | URL의 `?g=` 값이 같은지 확인. 다르면 다른 그룹 |
| Supabase 401 에러 | RLS 정책이 안 만들어짐 → `supabase-schema.sql` 다시 실행 |
| 핀이 차 그림 위치가 이상함 | `src/components/CarPin.tsx` → `CAR_CENTERS_RATIO` 조정 |
| 빌드 에러 (TypeScript) | `npm install` 다시 실행 / Node 18+ 사용 확인 |
