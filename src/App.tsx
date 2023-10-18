import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainPage, Auth } from './pages';
import { Layout } from './components';

import './App.module.css';


const App = () => {
  const isAuthenticated = false;

  return (
    <BrowserRouter>
      <Routes>
        {
          !isAuthenticated &&
          <Route path='*' element={<Navigate to="/auth" />} />
        }

        {
          isAuthenticated &&
          <Route path='/' element={<Layout><MainPage /></Layout>} />
        }

        <Route path='/auth' element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

