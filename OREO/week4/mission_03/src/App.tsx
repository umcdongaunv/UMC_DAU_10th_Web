import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomeLayout } from './layouts/HomeLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MyPage } from './pages/MyPage';
import { NotFoundPage } from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'my', element: <MyPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
