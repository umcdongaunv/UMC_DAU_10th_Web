import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './02Mission2/pages/HomePage';
import MoviePage from './02Mission2/pages/MoviePage';
import NotFoundPage from './02Mission2/pages/NotFoundPage';
import { MovieDetailPage } from './02Mission2/pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'movies/:category',
        element: <MoviePage />
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailPage />
      }
    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
