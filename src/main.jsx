// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;

const script = document.createElement('script');
script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
script.defer = true;
document.head.appendChild(script);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);4