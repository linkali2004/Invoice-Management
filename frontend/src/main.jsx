import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from '../src/App';
import { InvoiceProvider } from './context/InvoiceContext';

const theme = createTheme({
    palette: {
        primary: { main: '#6a1b9a' },
        secondary: { main: '#8e24aa' },
    },
});


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <ThemeProvider theme={theme}>
        <InvoiceProvider>
            <CssBaseline />
            <App />
        </InvoiceProvider>
    </ThemeProvider>
);
