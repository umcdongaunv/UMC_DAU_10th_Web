# Week 5 — Mission 1: Protected Route

UMC 10th DAU Web · 5주차 미션 1 — **Protected Route를 활용하여 페이지 안전하게 보호하기**

## 미션 요약

- 로그인하지 않은 유저가 프리미엄 컨텐츠 페이지(`/premium/webtoon/:id`)에 접근하면 `/login`으로 리다이렉트
- 로그인 후에는 원래 가려던 페이지로 자동 복귀
- 토큰은 `localStorage.accessToken`으로 관리 (데모용 가짜 토큰)

## 폴더 구조

```
mission1/
├── assets/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   └── PremiumWebtoon.jsx
├── App.css
├── App.jsx
├── ProtectedRoute.jsx       ← 핵심 가드 컴포넌트
├── index.css
└── main.jsx
```

## 핵심 코드

`ProtectedRoute.jsx`

```jsx
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem('accessToken')
  const location = useLocation()

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
```

`App.jsx` 라우트 설정

```jsx
<Route
  path="/premium/webtoon/:id"
  element={
    <ProtectedRoute>
      <PremiumWebtoon />
    </ProtectedRoute>
  }
/>
```

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## 동작 확인 시나리오

1. 비로그인 상태로 `/premium/webtoon/1` 접근 → `/login`으로 리다이렉트
2. `/login`에서 "로그인하기" 버튼 클릭 → 원래 가려던 `/premium/webtoon/1`로 복귀
3. 로그아웃 후 다시 시도 → 다시 `/login`으로 리다이렉트
