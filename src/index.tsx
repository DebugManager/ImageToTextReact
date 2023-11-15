import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './context/Auth';
import { ToastContainer } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const stripePromise = loadStripe(
  'pk_test_51O7yDQDV4Z1ssWPD2djwQ2hHTHlW123md4BuJayXc4U57yFX5fWGyV8v3u8jN0otD88oExiqRjcbKlSmLTB1LerY000I4uwmVV'
);



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <App />
        <ToastContainer />
      </AuthProvider>
    </Elements>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
