import './App.css'
import MoviePage from './pages/MoviePage'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import MovieDetailPage from './pages/MovieDetailPage'
import { Navigate } from 'react-router-dom'


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <Navigate to="movies/category/popular" />
      },
      {
        path: 'movies/category/:category',   
        element: <MoviePage />
      },
      {
        path: 'movies/:movieId',            
        element: <MovieDetailPage />
      },
    ],
  },
]);
  


function App() {
  return <RouterProvider router={router} />
}

export default App;