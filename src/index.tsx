import {createRoot} from 'react-dom/client';
import {Analytics} from '@vercel/analytics/react';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <div
    style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
    }}>
    <App />
    {/* Vercel Web Analytics: renders nothing; mounted once at the app root. */}
    <Analytics />
  </div>,
);
