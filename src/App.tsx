import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { MainPage, Auth, PricingPage } from './pages';
import { Layout } from './components';

import './App.module.css';
import routes from './routes';
import { PrivateRoutes } from './components/PrivatRoytes';
import { OnePricePage } from './pages/OnePricePage';



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />} path={routes.index}>
          <Route element={<MainPage />} path={routes.index} />
          <Route element={<PricingPage />} path={routes.pricing} />
          <Route element={<OnePricePage />} path={routes.pricingId} />
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
