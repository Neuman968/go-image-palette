import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WasmProvider } from './context/LoadedWasm';
import { HashRouter } from "react-router-dom";
import { NotificationsProvider } from '@toolpad/core';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <NotificationsProvider>
      <WasmProvider onFailure={(e) => console.error("Failed to load WASM ", e)} fetchParams="go-wasm.wasm">
        <HashRouter>
          <App />
        </HashRouter>
      </WasmProvider>
    </NotificationsProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
