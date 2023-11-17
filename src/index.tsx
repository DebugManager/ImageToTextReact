import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './context/Auth';
import { ToastContainer } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './18n';
import LanguageProvider from './context/LanguageContext';
import { ExchangeRateProvider } from './context/ExchangeContext';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// import ReactGA from 'react-ga';

// function initializeReactGA() {
//   ReactGA.initialize('G-898SHVFZE2');
//   ReactGA.pageview(window.location.pathname + window.location.search);
// }

// initializeReactGA();

const stripePromise = loadStripe(
  'pk_test_51O7yDQDV4Z1ssWPD2djwQ2hHTHlW123md4BuJayXc4U57yFX5fWGyV8v3u8jN0otD88oExiqRjcbKlSmLTB1LerY000I4uwmVV'
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <ExchangeRateProvider>
        <LanguageProvider>
          <AuthProvider>
            <App />
            <ToastContainer />
          </AuthProvider>
        </LanguageProvider>
      </ExchangeRateProvider>
    </Elements>
  </React.StrictMode>
);

// const SendAnalytics = () => {
//   ReactGA.send({
//     hitType: 'pageview',
//     page: window.location.pathname,
//   });
// };

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(SendAnalytics);
reportWebVitals();
