import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Header = ({ invoiceCount, onNewInvoice }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                backgroundColor: '#5c6bc0', // Indigo background
                borderRadius: 3,
                boxShadow: 4,
                marginBottom: 2,
            }}
        >
            {/* Title */}
            <Typography 
                variant="h5" 
                sx={{ 
                    color: 'white', 
                    fontWeight: 'bold', 
                }}
            >
                Invoices
                <Typography 
                    variant="subtitle1" 
                    component="span" 
                    sx={{
                        marginLeft: 1, 
                        fontSize: '0.9rem', 
                        color: '#e8eaf6', // Lighter indigo for subtle text
                    }}
                >
                    ({invoiceCount} total)
                </Typography>
            </Typography>

            {/* Button */}
            <Button
                variant="contained"
                onClick={onNewInvoice}
                sx={{
                    backgroundColor: '#1e88e5', // Blue accent for the button
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    paddingX: 3,
                    paddingY: 1,
                    borderRadius: 2,
                    '&:hover': { 
                        backgroundColor: '#1565c0', // Darker blue on hover
                    },
                }}
            >
                New Invoice
            </Button>
        </Box>
    );
};

export default Header;
