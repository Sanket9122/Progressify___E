import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { 
    light: {
      palette: {
        primary: {
          main: '#1976d2',
        },
        secondary: {
          main: '#9c27b0',
        },
        custom: {
          background: '#f0f2f5',
          paper: '#ffffff',
          text: '#333333',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#90caf9',
        },
        secondary: {
          main: '#ce93d8',
        },
        custom: {
          background: '#121212',
          paper: '#1e1e1e',
          text: '#ffffff',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
