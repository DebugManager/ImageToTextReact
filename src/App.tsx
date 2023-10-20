import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { MainPage, Auth } from './pages';
import { Layout } from './components';

import './App.module.css';
import routes from './routes';
import { PrivateRoutes } from './components/PrivatRoytes';



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />} path={routes.index}>
          <Route element={<MainPage />} path={routes.mainPath} />
        </Route>
      </Route>
      <Route element={<Auth />} path='/auth' />
    </>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App;
