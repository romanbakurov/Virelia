import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

import './index.css';

import '@vellira-ui/assets/styles';
import '@vellira-ui/tokens/css';
import '@vellira-ui/react/styles';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
