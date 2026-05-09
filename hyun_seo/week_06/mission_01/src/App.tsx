import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import './App.css'
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { HomeLayout } from './layouts/HomeLayout';
import { SignupPage } from './pages/SignupPage';
import { MyPage } from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { GoogleLoginRedirectPage } from './pages/GoogleLoginRedirectPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LpDetailPage } from './pages/LpDetailPage';

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'v1/auth/google/callback', element: <GoogleLoginRedirectPage /> },
      {
        element: <ProtectedLayout />,
        children: [
          { path: 'my', element: <MyPage /> },
          { path: 'lp/:lpId', element: <LpDetailPage /> },
        ],
      },
    ],
  },
];

const router = createBrowserRouter([...publicRoutes]);

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App