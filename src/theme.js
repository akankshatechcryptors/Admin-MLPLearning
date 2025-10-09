import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',

    h1: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '2vw', // default
      '@media (min-width:600px)': { fontSize: '2.6vw' },
      '@media (min-width:900px)': { fontSize: '3.2vw' },
      '@media (min-width:1200px)': { fontSize: '3.8vw' },
      '@media (min-width:1536px)': { fontSize: '4.4vw' },
      // Mobile landscape
      '@media (max-width:599px) and (orientation: landscape)': { fontSize: '3vw' },
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '1.8vw',
      '@media (min-width:600px)': { fontSize: '2.2vw' },
      '@media (max-width:599px) and (orientation: landscape)': { fontSize: '2.5vw' },
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '1.5vw',
      '@media (min-width:600px)': { fontSize: '1.8vw' },
      '@media (max-width:599px) and (orientation: landscape)': { fontSize: '2.2vw' },
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '1vw',
      '@media (min-width:600px)': { fontSize: '1.1vw' },
      '@media (max-width:599px) and (orientation: landscape)': { fontSize: '1.3vw' },
    },
    body2: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.9vw',
      '@media (min-width:600px)': { fontSize: '1vw' },
      '@media (max-width:599px) and (orientation: landscape)': { fontSize: '1.2vw' },
    },
    button: {
      fontFamily: '"Nunito Sans", sans-serif',
      fontSize: '0.9vw',
      textTransform: 'none',
      borderRadius: '50px',
      '@media (min-width:600px)': { fontSize: '1vw' },
      '@media (max-width:599px) and (orientation: landscape)': { fontSize: '1.1vw' },
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: '0.5vw 1vw',
          [theme.breakpoints.up('sm')]: { padding: '0.6vw 1.5vw', fontSize: '1vw' },
          '@media (max-width:599px) and (orientation: landscape)': { padding: '0.8vw 1.5vw', fontSize: '1.05vw' },
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '1vw',
          [theme.breakpoints.up('sm')]: { fontSize: '1.1vw' },
          '@media (max-width:599px) and (orientation: landscape)': { fontSize: '1.2vw' },
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: ({ theme }) => ({
          fontSize: '1vw',
          [theme.breakpoints.up('sm')]: { fontSize: '1.1vw' },
          '@media (max-width:599px) and (orientation: landscape)': { fontSize: '1.2vw' },
        }),
      },
    },
  },
});

export default theme;
