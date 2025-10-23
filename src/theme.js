import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1920,
    },
  },

  typography: {
    fontFamily: 'Inter, sans-serif',

    h1: { fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '6vw',
      '@media (min-width:600px)': { fontSize: '5vw' },
      '@media (min-width:900px)': { fontSize: '4vw' },
      '@media (min-width:1200px)': { fontSize: '3.5vw' },
      '@media (min-width:1536px)': { fontSize: '3vw' },
      '@media (min-width:1920px)': { fontSize: '2.5vw' },
    },
    h2: { fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '5vw',
      '@media (min-width:600px)': { fontSize: '4.5vw' },
      '@media (min-width:900px)': { fontSize: '4vw' },
      '@media (min-width:1200px)': { fontSize: '3.5vw' },
      '@media (min-width:1536px)': { fontSize: '3vw' },
      '@media (min-width:1920px)': { fontSize: '2.5vw' },
    },
    h3: { fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '4.5vw',
      '@media (min-width:300px)': { fontSize: '6vw' },
      '@media (min-width:400px)': { fontSize: '5vw' },
      '@media (min-width:600px)': { fontSize: '4vw' },
      '@media (min-width:900px)': { fontSize: '3.5vw' },
      '@media (min-width:1200px)': { fontSize: '3vw' },
      '@media (min-width:1536px)': { fontSize: '2.5vw' },
      '@media (min-width:1920px)': { fontSize: '2vw' },
    },
    h4: { fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '4vw',
      '@media (min-width:300px)': { fontSize: '5vw' },
      '@media (min-width:400px)': { fontSize: '4.5vw' },
      '@media (min-width:600px)': { fontSize: '3.5vw' },
      '@media (min-width:900px)': { fontSize: '3vw' },
      '@media (min-width:1200px)': { fontSize: '2.5vw' },
      '@media (min-width:1536px)': { fontSize: '2vw' },
      '@media (min-width:1920px)': { fontSize: '1.8vw' },
    },
    h5: { fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '3.5vw',
      '@media (min-width:300px)': { fontSize: '4vw' },
      '@media (min-width:400px)': { fontSize: '3.5vw' },
      '@media (min-width:600px)': { fontSize: '3vw' },
      '@media (min-width:900px)': { fontSize: '2.5vw' },
      '@media (min-width:1200px)': { fontSize: '2vw' },
      '@media (min-width:1536px)': { fontSize: '1.8vw' },
      '@media (min-width:1920px)': { fontSize: '1.5vw' },
    },
    h6: { fontFamily: 'Poppins, sans-serif', fontWeight: 200, fontSize: '1.5vw',
      '@media (min-width:300px)': { fontSize: '3.5vw' },
      '@media (min-width:400px)': { fontSize: '3.5vw' },
      '@media (min-width:600px)': { fontSize: '2.5vw' },
      '@media (min-width:900px)': { fontSize: '1vw' },
      '@media (min-width:1200px)': { fontSize: '1.5vw' },
      '@media (min-width:1536px)': { fontSize: '1.5vw' },
      '@media (min-width:1920px)': { fontSize: '1.5vw' },
    },

    subtitle1: { fontSize: '2vw', fontWeight: 500,
      '@media (min-width:300px)': { fontSize: '2vw' },
      '@media (min-width:400px)': { fontSize: '1.9vw' },
      '@media (min-width:600px)': { fontSize: '1.8vw' },
      '@media (min-width:900px)': { fontSize: '1.6vw' },
      '@media (min-width:1200px)': { fontSize: '1.4vw' },
      '@media (min-width:1536px)': { fontSize: '1.2vw' },
      '@media (min-width:1920px)': { fontSize: '1vw' },
    },
    subtitle2: { fontSize: '1.8vw', fontWeight: 500,  
      '@media (min-width:600px)': { fontSize: '1.6vw' },
      '@media (min-width:900px)': { fontSize: '1.4vw' },
      '@media (min-width:1200px)': { fontSize: '1.2vw' },
      '@media (min-width:1536px)': { fontSize: '1vw' },
      '@media (min-width:1920px)': { fontSize: '0.9vw' },
    },
    body1: { fontSize: '1.5vw', fontWeight: 400,
      '@media (min-width:300px)': { fontSize: '3.3vw' },
      '@media (min-width:400px)': { fontSize: '3vw' },
      '@media (min-width:600px)': { fontSize: '1.3vw' },
      '@media (min-width:900px)': { fontSize: '1.2vw' },
      '@media (min-width:1200px)': { fontSize: '1.1vw' },
      '@media (min-width:1536px)': { fontSize: '1vw' },
      '@media (min-width:1920px)': { fontSize: '0.9vw' },
    },
    body2: { fontSize: '1.2vw', fontWeight: 400,
      '@media (min-width:300px)': { fontSize: '2.5vw' },
      '@media (min-width:400px)': { fontSize: '2.2vw' },
      '@media (min-width:600px)': { fontSize: '2.1vw' },
      '@media (min-width:900px)': { fontSize: '1vw' },
      '@media (min-width:1200px)': { fontSize: '1vw' },
      '@media (min-width:1536px)': { fontSize: '1vw' },
      '@media (min-width:1920px)': { fontSize: '1vw' },
    },
    caption: { fontSize: '1vw', fontWeight: 400,
      '@media (min-width:600px)': { fontSize: '0.95vw' },
      '@media (min-width:900px)': { fontSize: '0.9vw' },
      '@media (min-width:1200px)': { fontSize: '0.85vw' },
      '@media (min-width:1536px)': { fontSize: '0.8vw' },
      '@media (min-width:1920px)': { fontSize: '0.75vw' },
    },
    overline: { fontSize: '0.9vw', fontWeight: 400,
      '@media (min-width:300px)': { fontSize: '4.1vw' },
      '@media (min-width:400px)': { fontSize: '3.1vw' },
      '@media (min-width:600px)': { fontSize: '0.85vw' },
      '@media (min-width:900px)': { fontSize: '0.8vw' },
      '@media (min-width:1200px)': { fontSize: '0.75vw' },
      '@media (min-width:1536px)': { fontSize: '0.7vw' },
      '@media (min-width:1920px)': { fontSize: '0.65vw' },
    },
    disclaimer: { fontSize: '0.9vw', fontWeight: 400, lineHeight: '1.2vw',
      '@media (min-width:300px)': { fontSize: '2vw', lineHeight: '2.2vw' },
      '@media (min-width:400px)': { fontSize: '1.5vw', lineHeight: '1.7vw' },
      '@media (min-width:600px)': { fontSize: '0.85vw', lineHeight: '0.95vw' },
      '@media (min-width:900px)': { fontSize: '0.8vw', lineHeight: '0.9vw' },
      '@media (min-width:1200px)': { fontSize: '0.75vw', lineHeight: '0.85vw' },
      '@media (min-width:1536px)': { fontSize: '0.7vw', lineHeight: '0.8vw' },
      '@media (min-width:1920px)': { fontSize: '0.65vw', lineHeight: '0.75vw' },
    },
    button: { fontFamily: '"Nunito Sans", sans-serif', textTransform: 'none', fontSize: '1.2vw',
      '@media (min-width:300px)': { fontSize: '4.1vw' },
      '@media (min-width:400px)': { fontSize: '3.1vw' },
      '@media (min-width:600px)': { fontSize: '2.1vw' },
      '@media (min-width:900px)': { fontSize: '1vw' },
      '@media (min-width:1200px)': { fontSize: '0.95vw' },
      '@media (min-width:1536px)': { fontSize: '0.9vw' },
      '@media (min-width:1920px)': { fontSize: '0.85vw' },
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '25px  ',
          padding: '1vw 2vw',
          fontSize: '1.2vw',
          [theme.breakpoints.up('xs')]: { fontSize: '3vw', padding: '1.1vw 2.4vw' },
          [theme.breakpoints.up('sm')]: { fontSize: '1.1vw', padding: '0.9vw 1.8vw' },
          [theme.breakpoints.up('md')]: { fontSize: '1vw', padding: '0.8vw 1.6vw' },
          [theme.breakpoints.up('lg')]: { fontSize: '0.95vw', padding: '0.7vw 1.4vw' },
          [theme.breakpoints.up('xl')]: { fontSize: '0.9vw', padding: '0.6vw 1.2vw' },
          [theme.breakpoints.up('xxl')]: { fontSize: '0.85vw', padding: '0.5vw 1vw' },
        }),
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '1.2vw',
          [theme.breakpoints.up('xs')]: { fontSize: '1.5vw' },
          [theme.breakpoints.up('sm')]: { fontSize: '1.1vw' },
          [theme.breakpoints.up('md')]: { fontSize: '1vw' },
          [theme.breakpoints.up('lg')]: { fontSize: '0.95vw' },
          [theme.breakpoints.up('xl')]: { fontSize: '0.9vw' },
          [theme.breakpoints.up('xxl')]: { fontSize: '0.85vw' },
        }),
      },
    },
  MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '1.2vw',
          textAlign:'left',
          [theme.breakpoints.up('xs')]: { fontSize: '1.5vw' },
          [theme.breakpoints.up('sm')]: { fontSize: '1.1vw' },
          [theme.breakpoints.up('md')]: { fontSize: '1vw' },
          [theme.breakpoints.up('lg')]: { fontSize: '0.95vw' },
          [theme.breakpoints.up('xl')]: { fontSize: '0.9vw' },
          [theme.breakpoints.up('xxl')]: { fontSize: '0.85vw' },
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: ({ theme }) => ({
          fontSize: '1.2vw',
         [theme.breakpoints.up('xs')]: { fontSize: '3.1vw' },
          [theme.breakpoints.up('sm')]: { fontSize: '1.1vw' },
          [theme.breakpoints.up('md')]: { fontSize: '1vw' },
          [theme.breakpoints.up('lg')]: { fontSize: '0.95vw' },
          [theme.breakpoints.up('xl')]: { fontSize: '0.9vw' },
          [theme.breakpoints.up('xxl')]: { fontSize: '0.85vw' },
        }),
      },
    },

    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '1vw',
          padding: '1vw',
          boxShadow: '0 0.5vw 1.5vw rgba(0,0,0,0.08)',

           [theme.breakpoints.up('xs')]: { padding: '0.2vw' },
          [theme.breakpoints.up('md')]: { padding: '0.5vw' },
          [theme.breakpoints.up('sm')]: { padding: '2.5vw' },
          [theme.breakpoints.up('md')]: { padding: '2vw' },
          [theme.breakpoints.up('lg')]: { padding: '1vw' },
          [theme.breakpoints.up('xl')]: { padding: '1.2vw' },
          [theme.breakpoints.up('xxl')]: { padding: '1vw' },
        }),
      },
    },
 MuiIcon: {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: '8px', // rounded corners
      padding: '0.5rem',   // default padding
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // subtle shadow
      fontSize: '1.5rem',  // default icon size

      // Small screens
       [theme.breakpoints.up('xs')]: {
        padding: '0.50rem',
        fontSize: '0.8vw',
      },

      [theme.breakpoints.up('sm')]: {
        padding: '0.75rem',
        fontSize: '1vw',
      },

      // Medium screens
      [theme.breakpoints.up('md')]: {
        padding: '1rem',
        fontSize: '2rem',
      },

      // Large screens
      [theme.breakpoints.up('lg')]: {
        padding: '1.2rem',
        fontSize: '2.2rem',
      },

      // Extra large screens
      [theme.breakpoints.up('xl')]: {
        padding: '1.5rem',
        fontSize: '2.5rem',
      },

      // XXL screens
      [theme.breakpoints.up('xxl')]: {
        padding: '1.5rem',
        fontSize: '2.5rem',
      },

      // Optional: smooth transition when resizing
      transition: 'all 0.3s ease-in-out',
    }),
  },
},
MuiAccordion: {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: '5px',
      transition: 'all 0.3s ease',
      '&:before': { display: 'none' },

      [theme.breakpoints.up('xs')]: {
        borderRadius: '1.5vw',
        margin: '0.6vw 0',
      },
      [theme.breakpoints.up('sm')]: {
        borderRadius: '1.2vw',
        margin: '0.6vw 0',
      },
      [theme.breakpoints.up('md')]: {
        borderRadius: '1vw',
        margin: '0.8vw 0',
      },
      [theme.breakpoints.up('lg')]: {
        borderRadius: '1.8vw',
        margin: '1vw 0',
      },
    }),
  },
},

MuiAccordionSummary: {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: '#e8f5e9',
      padding: '0.5vw ',
      borderRadius: 'inherit',
      minHeight: '4vw',
      '&.Mui-expanded': { minHeight: '5vw' },
       [theme.breakpoints.up('xs')]: { padding: '2.2vw 2.5vw' },
      [theme.breakpoints.up('sm')]: { padding: '1.2vw 1.5vw' },
      [theme.breakpoints.up('md')]: { padding: '1.2vw 1.8vw' },
    }),
    content: {
      margin: '0',
      '&.Mui-expanded': { margin: '0' },
    },
  },
},

MuiAccordionDetails: {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: '1vw',
      backgroundColor: '#fff',
      borderTop: '0.1vw solid rgba(0,0,0,0.05)',

      [theme.breakpoints.up('sm')]: { padding: '1vw' },
      [theme.breakpoints.up('md')]: { padding: '1.2vw' },
    }),
  },
},


    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: '1.2vw',
          borderRadius: '50px',
          [theme.breakpoints.up('xs')]: { fontSize: '3vw', borderRadius: '50px' },
          [theme.breakpoints.up('sm')]: { fontSize: '2vw', borderRadius: '50px' },
          [theme.breakpoints.up('md')]: { fontSize: '1vw', borderRadius: '50px' },
          [theme.breakpoints.up('lg')]: { fontSize: '0.95vw', borderRadius: '50px' },
          [theme.breakpoints.up('xl')]: { fontSize: '0.9vw', borderRadius: '50px' },
          [theme.breakpoints.up('xxl')]: { fontSize: '0.85vw', borderRadius: '50px' },
        }),
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          width: '2vw',
          height: '2vw',
          fontSize: '1.5vw',
          [theme.breakpoints.up('xs')]: { width: '6.5vw', height: '6.5vw', fontSize: '4.2vw' },
          [theme.breakpoints.up('sm')]: { width: '3.5vw', height: '3.5vw', fontSize: '1vw' },
          [theme.breakpoints.up('md')]: { width: '3vw', height: '3vw', fontSize: '1vw' },
          [theme.breakpoints.up('lg')]: { width: '3vw', height: '3vw', fontSize: '1.8vw' },
          [theme.breakpoints.up('xl')]: { width: '3vw', height: '3vw', fontSize: '1.6vw' },
          [theme.breakpoints.up('xxl')]: { width: '2.5vw', height: '2.5vw', fontSize: '1.4vw' },
        }),
      },
    },
  },
});

export default theme;
