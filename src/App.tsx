import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import {
  MainPage,
  Auth,
  PricingPage,
  ResetPassPage,
  UsersPage,
  Companies,
  NewFeature,
  Ticketpage,
  ChatPage,
  ProfileSettings,
  InvoicesTable,
  InvoicePage,
} from './pages';
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
          <Route element={<UsersPage />} path={routes.users} />
          <Route element={<Companies />} path={routes.companies} />
          <Route element={<NewFeature />} path={routes.newFeature} />
          <Route element={<Ticketpage />} path={routes.tickets} />
          <Route element={<ChatPage />} path={routes.ticketId} />
          <Route element={<ProfileSettings />} path={routes.userSetting} />
          <Route element={<InvoicesTable />} path={routes.allInvoces} />
          <Route element={<InvoicePage />} path={routes.invoceDetails} />
        </Route>
      </Route>
      <Route element={<Auth />} path='/auth' />
      <Route element={<ResetPassPage />} path='/reset-password/:uuid/:token' />
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
