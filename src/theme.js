// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif', // default fallback for all text

    h1: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 'clamp(28px, 4vw, 52px)', // scales between 28px and 52px
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 'clamp(24px, 3vw, 40px)',
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 'clamp(20px, 2.5vw, 32px)',
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 'clamp(18px, 2vw, 28px)',
    },
    h5: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 'clamp(16px, 1.8vw, 24px)',
    },
    h6: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: 'clamp(14px, 1.5vw, 20px)',
    },

    body1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: 'clamp(14px, 1.2vw, 18px)',
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: 'clamp(12px, 1vw, 16px)',
    },

    button: {
      fontFamily: '"Nunito Sans", sans-serif',
      fontSize: 'clamp(12px, 1.2vw, 16px)',
      textTransform: 'none', // keeps normal case
      borderRadius: '50px',
    },
  },
});

export default theme;
