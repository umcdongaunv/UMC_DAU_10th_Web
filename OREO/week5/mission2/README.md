# Week 5 — Mission 2: Refresh Token

UMC 10th DAU Web · 5주차 미션 2 — **Refresh Token으로 지속 로그인 유지**

## 미션 요약

- 짧은 수명의 **Access Token** (30초) + 긴 수명의 **Refresh Token** (7일)
- API 호출 시 401 응답을 받으면 **axios response interceptor가 refresh API를 자동 호출**해 새 토큰을 받고 원 요청을 재시도
- `_retry` 플래그로 무한 루프 방지
- 동시에 401을 받은 다중 요청은 단일 `refreshPromise`에 대기시켜 **race condition 차단**

## 폴더 구조

```
mission2/
├── api/
│   ├── axios.js          ← interceptor 본체 (핵심!)
│   └── auth.js           ← login/signup/logout/me
├── auth/
│   ├── AuthContext.jsx   ← 인증 상태 (loading/authenticated/unauthenticated)
│   └── tokenStorage.js   ← localStorage 추상화
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx         ← 이메일/비밀번호 폼
│   └── PremiumWebtoon.jsx← /users/me 호출 + 진단 패널
├── App.css
├── App.jsx
├── ProtectedRoute.jsx    ← AuthContext 기반 가드
├── index.css
└── main.jsx
```

## 핵심 코드 — `api/axios.js`

```js
let isRefreshing = false
let refreshPromise = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }
    if (originalRequest.url?.includes('/auth/refresh')) {
      tokenStorage.clear()
      return Promise.reject(error)
    }
    originalRequest._retry = true

    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = performRefresh().finally(() => {
        isRefreshing = false
        refreshPromise = null
      })
    }
    const newAccessToken = await refreshPromise
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
    return api(originalRequest)
  },
)
```

## 실행

### 1. 백엔드 켜기

```bash
cd ../mission3/backend
npm install
npm run dev    # localhost:8000
```

데모 계정: `umc@umc.com` / `1234`

### 2. 프론트 켜기

```bash
cd mission2
npm install
npm run dev    # localhost:5173
```

## 동작 검증 시나리오

1. `/login` → 데모 계정으로 로그인 (자동 입력)
2. `/premium/webtoon/1` 진입 → `/users/me` 호출 (200)
3. **30초 대기** (백엔드 `JWT_EXPIRES_IN=30s`)
4. "다시 호출" 버튼 클릭 — DevTools Network 탭:
   - `GET /users/me` → **401**
   - `POST /auth/refresh` → **200** (자동 갱신)
   - `GET /users/me` 재시도 → **200**
5. 화면은 끊김 없이 데이터 갱신
6. (보너스) 한번 더 시도하면 새 30초 카운트가 시작됨

## 체크리스트

- [x] **서버 세팅** — `mission3/backend`에 stub Express 서버 (포트 8000)
- [x] **토큰 갱신 로직** — axios response interceptor에서 401 잡아 refresh + 재시도
- [x] **무한 루프 방지** — `_retry` 플래그로 한번 재시도된 요청은 다시 처리하지 않음
- [x] **동작 검증** — 30초 후 호출하면 끊김 없이 동작
- [x] **(보너스) 동시 요청 race-condition** — `isRefreshing` + `refreshPromise` 패턴으로 refresh API는 단 1번만 호출
- [x] **(보너스) Refresh Token Rotation 호환** — 백엔드에서 토큰 회전해도 새 토큰을 받아서 동작
