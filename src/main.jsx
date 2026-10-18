import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';
import './styles/sections.css';
import './styles/core.css';
import './styles/notfound.css';
import './styles/about.css';
import './styles/pages.css';
import './styles/contact.css';
import './styles/student-access.css';
import './styles/student-assistant.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>
);