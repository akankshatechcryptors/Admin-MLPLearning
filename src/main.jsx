import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';
// Toastify imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
        <App />
        {/* ToastContainer should be placed once in the root */}
        <ToastContainer/>
      </ThemeProvider>
  </StrictMode>
);
