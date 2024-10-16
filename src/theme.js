import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4caf50',
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
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2.5rem',
    },
    h3: {
      fontSize: '2rem',
    },
    body1: {
      fontSize: '1.2rem',
    },
  },
 components: {
    MuiBody: {
      styleOverrides: {
        root: {
          color: '#333333', // Dark text
          margin: 0,
          fontFamily: 'Arial, sans-serif',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4682B4', // Steel blue for primary actions
      contrastText: '#ffffff', // White text for contrast
    },
    secondary: {
      main: '#ff4081', // A vivid pink for secondary actions
      contrastText: '#ffffff', // White text for contrast
    },
    background: {
      default: '#121212', // Darker background for better contrast
      paper: '#1e1e1e', // Slightly lighter for cards and surfaces
    },
    text: {
      primary: '#e0e0e0', // Light grey for primary text
      secondary: '#b0bec5', // Lighter grey for secondary text
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
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
      textTransform: 'none', // Prevent uppercase transformation
    },
  },
  components: {
   MuiBody: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212', // Dark background
          color: '#f5f5f5', // Light text
          margin: 0,
          fontFamily: 'Arial, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Subtle shadow
          '&:hover': {
            backgroundColor: '#4682B4', // Steel blue on hover
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Deeper shadow on hover
          },
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
