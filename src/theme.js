import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5F259F',
    },
    secondary: {
      main: '#ff5722',
    },
    background: {
      default: '#f5f5f5',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiBody: {
      styleOverrides: {
        root: {
          color: '#333333',
          margin: 0,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            //backgroundColor: '#4682B4',
            //boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4682B4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff4081',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#ffffff',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#ffffff',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
      color: '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      color: '#e0e0e0',
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiBody: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212',
          color: '#f5f5f5',
          margin: 0,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            backgroundColor: '#4682B4',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
  },
});

export { lightTheme, darkTheme };

