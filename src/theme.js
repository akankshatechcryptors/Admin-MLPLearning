// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif', // default fallback for all text

    h1: {
      fontFamily: 'Poppins, sans-serif',
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
    },
    h5: {
      fontFamily: 'Poppins, sans-serif',
    },
    h6: {
      fontFamily: 'Poppins, sans-serif',
    },

    body1: {
      fontFamily: 'Inter, sans-serif',
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
    },

    button: {
      fontFamily: '"Nunito Sans", sans-serif',
      textTransform: 'none', // optional: removes all-uppercase buttons
      borderRadius:'50px'
    },
  },
});

export default theme;
