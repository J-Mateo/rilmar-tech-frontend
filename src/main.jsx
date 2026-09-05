import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from './store';
import { setupApiInterceptors } from './api/setupApiInterceptors';

import AppInitializer from './components/app/AppInitializer/AppInitializer';

import './styles/index.css';

setupApiInterceptors(store);

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  </React.StrictMode>
);