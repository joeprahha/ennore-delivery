// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4caf50', // Green theme color
        },
        secondary: {
            main: '#ff5722', // Orange for secondary actions
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
        h1: {
            fontWeight: 600,
        },
        h2: {
            fontWeight: 500,
        },
        h3: {
            fontWeight: 400,
        },
    },
});

export default theme;
