import type { ReactElement } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './index';
import { Join } from './pages/Join/Join';
import { Lobby } from './pages/Lobby/Lobby';
import { Game } from './pages/Game/Game';
import { Results } from './pages/Results/Results';
import { Error } from './pages/Error/Error';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/join/:token',
    element: <Join />,
  },
  {
    path: '/lobby/:token',
    element: <Lobby />,
  },
  {
    path: '/game/:token',
    element: <Game />,
  },
  {
    path: '/results/:token',
    element: <Results />,
  },
  {
    path: '/error',
    element: <Error />,
  },
]);

export default function App(): ReactElement {
  return <RouterProvider router={router} />;
}
